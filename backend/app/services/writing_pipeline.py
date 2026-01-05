"""Writing pipeline orchestrated with LangGraph."""
from __future__ import annotations

from typing import Dict, Any, List, Optional, TypedDict
from uuid import UUID
import json
import math

from langgraph.graph import StateGraph, END
from sqlalchemy import select, func
from sqlalchemy.ext.asyncio import AsyncSession

from app.core.config import settings
from app.models.document import Document, DocumentType
from app.schemas.document import DocumentCreate
from app.services.context_service import ProjectContextService
from app.services.document_service import DocumentService
from app.services.llm_client import DeepSeekClient
from app.services.rag_service import RagService


class WritingState(TypedDict, total=False):
    project_id: UUID
    user_id: UUID
    chapter_title: str
    chapter_prompt: str
    target_word_count: Optional[int]
    constraints: Dict[str, Any]
    use_rag: bool
    reindex_documents: bool
    order_index: Optional[int]
    create_document: bool
    project_context: Dict[str, Any]
    retrieved_chunks: List[str]
    chapter_plan: str
    chapter_text: str
    document_id: Optional[str]


class WritingPipeline:
    """LangGraph pipeline for autonomous chapter and book generation."""

    def __init__(self, db: AsyncSession) -> None:
        self.db = db
        self.context_service = ProjectContextService(db)
        self.rag_service = RagService()
        self.llm_client = DeepSeekClient()
        self.graph = self._build_graph()

    def _build_graph(self):
        graph = StateGraph(WritingState)
        graph.add_node("collect_context", self.collect_context)
        graph.add_node("retrieve_context", self.retrieve_context)
        graph.add_node("plan_chapter", self.plan_chapter)
        graph.add_node("write_chapter", self.write_chapter)
        graph.add_node("persist_chapter", self.persist_chapter)

        graph.set_entry_point("collect_context")
        graph.add_edge("collect_context", "retrieve_context")
        graph.add_edge("retrieve_context", "plan_chapter")
        graph.add_edge("plan_chapter", "write_chapter")
        graph.add_edge("write_chapter", "persist_chapter")
        graph.add_edge("persist_chapter", END)
        return graph.compile()

    async def collect_context(self, state: WritingState) -> Dict[str, Any]:
        context = await self.context_service.build_project_context(
            project_id=state["project_id"],
            user_id=state["user_id"],
        )
        constraints = state.get("constraints") or context.get("constraints", {})
        return {
            "project_context": context,
            "constraints": constraints,
        }

    async def retrieve_context(self, state: WritingState) -> Dict[str, Any]:
        if not state.get("use_rag", True):
            return {"retrieved_chunks": []}

        if state.get("reindex_documents"):
            documents = await self._load_project_documents(state["project_id"])
            await self.rag_service.aindex_documents(state["project_id"], documents, clear_existing=True)

        query = f"{state.get('chapter_title', '')}\n{state.get('chapter_prompt', '')}".strip()
        chunks = await self.rag_service.aretrieve(
            project_id=state["project_id"],
            query=query,
            top_k=settings.RAG_TOP_K,
        )
        return {"retrieved_chunks": chunks}

    async def plan_chapter(self, state: WritingState) -> Dict[str, Any]:
        context_block = self._format_context(state)
        prompt = (
            "Create a short chapter plan (bullet points) that follows the project context.\n\n"
            f"Chapter title: {state.get('chapter_title', '')}\n"
            f"Chapter prompt: {state.get('chapter_prompt', '')}\n"
            f"Target word count: {state.get('target_word_count') or 'unspecified'}\n\n"
            f"{context_block}\n"
            "Return only the plan."
        )
        messages = [
            {"role": "system", "content": "You are a senior literary editor and outline planner."},
            {"role": "user", "content": prompt},
        ]
        plan = await self.llm_client.chat(messages, temperature=0.5, max_tokens=800)
        return {"chapter_plan": plan.strip()}

    async def write_chapter(self, state: WritingState) -> Dict[str, Any]:
        context_block = self._format_context(state)
        rag_block = "\n\nRelevant excerpts:\n" + "\n---\n".join(state.get("retrieved_chunks", []))
        base_prompt = (
            "Write the chapter in full. Follow the plan and constraints strictly.\n\n"
            f"Chapter title: {state.get('chapter_title', '')}\n"
            f"Chapter prompt: {state.get('chapter_prompt', '')}\n"
            f"Target word count: {state.get('target_word_count') or 'unspecified'}\n\n"
            f"Chapter plan:\n{state.get('chapter_plan', '')}\n\n"
            f"{context_block}"
            f"{rag_block}\n\n"
        )
        target_word_count = state.get("target_word_count")
        if target_word_count and target_word_count > 0:
            chapter_text = await self._generate_long_form(base_prompt, target_word_count)
        else:
            prompt = f"{base_prompt}Return only the chapter text, no extra commentary."
            messages = [
                {"role": "system", "content": "You are THOTH, a French literary writing assistant."},
                {"role": "user", "content": prompt},
            ]
            chapter_text = await self.llm_client.chat(
                messages,
                temperature=0.7,
                max_tokens=max(1, settings.CHAT_MAX_TOKENS),
            )
        return {"chapter_text": (chapter_text or "").strip()}

    async def persist_chapter(self, state: WritingState) -> Dict[str, Any]:
        if not state.get("create_document", True):
            return {}

        order_index = state.get("order_index")
        if order_index is None:
            order_index = await self._get_next_order_index(state["project_id"])

        title = state.get("chapter_title") or f"Chapter {order_index + 1}"
        document_data = DocumentCreate(
            title=title,
            content=state.get("chapter_text", ""),
            document_type=DocumentType.CHAPTER,
            order_index=order_index,
            project_id=state["project_id"],
        )
        doc_service = DocumentService(self.db)
        document = await doc_service.create(document_data, user_id=state["user_id"])
        return {"document_id": str(document.id)}

    async def generate_chapter(self, state: WritingState) -> Dict[str, Any]:
        result = await self.graph.ainvoke(state)
        return {
            "chapter_title": result.get("chapter_title", state.get("chapter_title", "")),
            "chapter_plan": result.get("chapter_plan", ""),
            "chapter_text": result.get("chapter_text", ""),
            "document_id": result.get("document_id"),
            "retrieved_chunks": result.get("retrieved_chunks", []),
        }

    async def generate_book(
        self,
        project_id: UUID,
        user_id: UUID,
        book_prompt: str,
        chapter_count: int,
        per_chapter_word_count: Optional[int] = None,
        constraints: Optional[Dict[str, Any]] = None,
        use_rag: bool = True,
        reindex_documents: bool = False,
        create_documents: bool = True,
    ) -> Dict[str, Any]:
        outline = await self._generate_outline(
            project_id=project_id,
            user_id=user_id,
            book_prompt=book_prompt,
            chapter_count=chapter_count,
            constraints=constraints,
        )

        base_order_index = await self._get_next_order_index(project_id) if create_documents else 0
        chapters: List[Dict[str, Any]] = []
        for idx, item in enumerate(outline):
            chapter_state: WritingState = {
                "project_id": project_id,
                "user_id": user_id,
                "chapter_title": item.get("title") or f"Chapter {idx + 1}",
                "chapter_prompt": item.get("prompt") or book_prompt,
                "target_word_count": per_chapter_word_count,
                "constraints": constraints or {},
                "use_rag": use_rag,
                "reindex_documents": reindex_documents if idx == 0 else False,
                "order_index": base_order_index + idx if create_documents else None,
                "create_document": create_documents,
            }
            result = await self.generate_chapter(chapter_state)
            chapters.append(result)

        return {"outline": outline, "chapters": chapters}

    async def _generate_outline(
        self,
        project_id: UUID,
        user_id: UUID,
        book_prompt: str,
        chapter_count: int,
        constraints: Optional[Dict[str, Any]] = None,
    ) -> List[Dict[str, str]]:
        context = await self.context_service.build_project_context(project_id, user_id)
        constraint_block = json.dumps(constraints or context.get("constraints", {}), ensure_ascii=True)
        prompt = (
            "Generate a chapter outline as JSON. Provide a list of objects with keys: title, prompt.\n"
            f"Chapter count: {chapter_count}\n"
            f"Book prompt: {book_prompt}\n"
            f"Constraints JSON: {constraint_block}\n"
            "Return only JSON."
        )
        messages = [
            {"role": "system", "content": "You are a senior story architect."},
            {"role": "user", "content": prompt},
        ]
        outline_text = await self.llm_client.chat(messages, temperature=0.4, max_tokens=1200)
        return self._parse_outline(outline_text, chapter_count, book_prompt)

    def _parse_outline(
        self,
        outline_text: str,
        chapter_count: int,
        fallback_prompt: str,
    ) -> List[Dict[str, str]]:
        try:
            outline = json.loads(outline_text)
            if isinstance(outline, list):
                return [
                    {
                        "title": str(item.get("title", f"Chapter {idx + 1}")),
                        "prompt": str(item.get("prompt", fallback_prompt)),
                    }
                    for idx, item in enumerate(outline[:chapter_count])
                ]
        except json.JSONDecodeError:
            pass

        return [
            {"title": f"Chapter {idx + 1}", "prompt": fallback_prompt}
            for idx in range(chapter_count)
        ]

    async def _get_next_order_index(self, project_id: UUID) -> int:
        result = await self.db.execute(
            select(func.max(Document.order_index)).where(Document.project_id == project_id)
        )
        max_index = result.scalar()
        return (max_index + 1) if max_index is not None else 0

    async def _load_project_documents(self, project_id: UUID) -> List[Document]:
        result = await self.db.execute(
            select(Document).where(Document.project_id == project_id).order_by(Document.order_index.asc())
        )
        return list(result.scalars().all())

    def _count_words(self, text: str) -> int:
        return len(text.split())

    def _build_continuation_hint(self, text: str) -> str:
        if not text:
            return "Start the chapter from the beginning."
        excerpt = text[-1200:]
        return (
            "Last excerpt:\n"
            f"{excerpt}\n"
            "Continue from the excerpt without repeating earlier text."
        )

    async def _generate_long_form(self, base_prompt: str, target_word_count: int) -> str:
        chunk_word_target = 1200
        estimated = math.ceil(target_word_count / chunk_word_target)
        max_iterations = min(24, max(1, estimated + 2))
        content = ""
        current_words = 0
        for _ in range(max_iterations):
            if current_words >= target_word_count:
                break
            remaining = target_word_count - current_words
            chunk_target = min(chunk_word_target, remaining)
            continuation_hint = self._build_continuation_hint(content)
            prompt = (
                f"{base_prompt}"
                f"Minimum word count: {target_word_count}\n"
                f"Current word count: {current_words}\n"
                f"Write the next part in about {chunk_target} words.\n"
                f"{continuation_hint}\n"
                "Return only the next part without repeating earlier text."
            )
            messages = [
                {"role": "system", "content": "You are THOTH, a French literary writing assistant."},
                {"role": "user", "content": prompt},
            ]
            part = await self.llm_client.chat(
                messages,
                temperature=0.7,
                max_tokens=max(1, settings.CHAT_MAX_TOKENS),
            )
            part = (part or "").strip()
            if not part:
                break
            content = f"{content}\n\n{part}" if content else part
            current_words = self._count_words(content)
        return content

    def _format_context(self, state: WritingState) -> str:
        context = state.get("project_context") or {}
        project = context.get("project", {})
        constraints = state.get("constraints") or {}
        character_list = ", ".join(
            [
                f"{char.get('name')} ({char.get('role') or 'unknown'})"
                for char in context.get("characters", [])
                if char.get("name")
            ][:20]
        )
        document_list = ", ".join(
            [
                doc.get("title", "")
                for doc in context.get("documents", [])
                if doc.get("title")
            ][:20]
        )
        instruction_list = "; ".join(
            [
                f"{item.get('title')}: {item.get('detail')}"
                for item in context.get("instructions", [])
                if item.get("title") and item.get("detail")
            ][:20]
        )
        return (
            "Project context:\n"
            f"- Title: {project.get('title')}\n"
            f"- Genre: {project.get('genre')}\n"
            f"- Description: {project.get('description')}\n"
            f"- Structure: {project.get('structure_template')}\n"
            f"- Word count: {project.get('current_word_count')} / {project.get('target_word_count')}\n"
            f"- Characters: {character_list or 'none'}\n"
            f"- Documents: {document_list or 'none'}\n"
            f"- Instructions: {instruction_list or 'none'}\n"
            f"- Constraints: {json.dumps(constraints, ensure_ascii=True)}\n"
        )
