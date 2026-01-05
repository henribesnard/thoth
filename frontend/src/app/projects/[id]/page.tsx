/**
 * Project detail page with instructions, elements, and characters
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter, useParams } from 'next/navigation'
import { getAuthToken } from '@/lib/api'
import {
  getProject,
  getDocuments,
  getCharacters,
  createCharacter,
  generateMainCharacters,
  createElement,
  generateElement,
  listDocumentVersions,
  getDocumentVersion,
  listInstructions,
  createInstruction,
  updateInstruction,
  deleteInstruction,
  deleteProject,
} from '@/lib/api-extended'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Dialog, DialogHeader, DialogTitle, DialogDescription, DialogContent, DialogFooter } from '@/components/ui/dialog'
import { formatDate, formatWordCount, calculateReadingTime } from '@/lib/utils'
import type { Project, Document, Character, Instruction, DocumentVersion } from '@/types'

const ELEMENT_TYPES = [
  { value: 'partie', label: 'Partie', level: 1 },
  { value: 'chapitre', label: 'Chapitre', level: 2 },
  { value: 'sous-chapitre', label: 'Sous-chapitre', level: 3 },
  { value: 'section', label: 'Section', level: 4 },
]
const MAX_ELEMENT_LEVEL = Math.max(...ELEMENT_TYPES.map((item) => item.level))

const DOCUMENT_TYPE_FALLBACK: Record<string, string> = {
  chapter: 'chapitre',
  scene: 'section',
  note: 'section',
  outline: 'section',
}

export default function ProjectDetailPage() {
  const router = useRouter()
  const params = useParams()
  const projectId = params.id as string

  const [loading, setLoading] = useState(true)
  const [project, setProject] = useState<Project | null>(null)
  const [documents, setDocuments] = useState<Document[]>([])
  const [characters, setCharacters] = useState<Character[]>([])
  const [instructions, setInstructions] = useState<Instruction[]>([])
  const [activeTab, setActiveTab] = useState<'overview' | 'elements' | 'instructions' | 'characters'>('overview')
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [deleteConfirmation, setDeleteConfirmation] = useState('')
  const [deleteError, setDeleteError] = useState('')
  const [isDeleting, setIsDeleting] = useState(false)
  const [showCharacterDialog, setShowCharacterDialog] = useState(false)
  const [characterForm, setCharacterForm] = useState({
    name: '',
    description: '',
    physical_description: '',
    personality: '',
    backstory: '',
  })
  const [characterError, setCharacterError] = useState('')
  const [isSavingCharacter, setIsSavingCharacter] = useState(false)
  const [showAutoCharactersDialog, setShowAutoCharactersDialog] = useState(false)
  const [autoCharactersSummary, setAutoCharactersSummary] = useState('')
  const [autoCharactersPrecision, setAutoCharactersPrecision] = useState('')
  const [autoCharactersError, setAutoCharactersError] = useState('')
  const [isGeneratingCharacters, setIsGeneratingCharacters] = useState(false)
  const [showInstructionDialog, setShowInstructionDialog] = useState(false)
  const [instructionForm, setInstructionForm] = useState({ title: '', detail: '' })
  const [instructionError, setInstructionError] = useState('')
  const [isSavingInstruction, setIsSavingInstruction] = useState(false)
  const [editingInstruction, setEditingInstruction] = useState<Instruction | null>(null)
  const [showElementDialog, setShowElementDialog] = useState(false)
  const [elementType, setElementType] = useState('chapitre')
  const [elementParentId, setElementParentId] = useState<string | null>(null)
  const [elementError, setElementError] = useState('')
  const [isCreatingElement, setIsCreatingElement] = useState(false)
  const [showGenerateDialog, setShowGenerateDialog] = useState(false)
  const [generateTarget, setGenerateTarget] = useState<Document | null>(null)
  const [generateInstructions, setGenerateInstructions] = useState('')
  const [generateMinWords, setGenerateMinWords] = useState('')
  const [generateMaxWords, setGenerateMaxWords] = useState('')
  const [generateSummary, setGenerateSummary] = useState('')
  const [generateError, setGenerateError] = useState('')
  const [isGeneratingElement, setIsGeneratingElement] = useState(false)
  const [showElementPreview, setShowElementPreview] = useState(false)
  const [previewElement, setPreviewElement] = useState<Document | null>(null)
  const [versions, setVersions] = useState<DocumentVersion[]>([])
  const [selectedVersionId, setSelectedVersionId] = useState('')
  const [selectedVersion, setSelectedVersion] = useState<DocumentVersion | null>(null)
  const [isLoadingVersions, setIsLoadingVersions] = useState(false)
  const [versionError, setVersionError] = useState('')

  useEffect(() => {
    const token = getAuthToken()
    if (!token) {
      router.push('/auth/login')
    } else {
      loadProjectData()
    }
  }, [projectId, router])

  useEffect(() => {
    if (!showElementPreview || !previewElement) return
    let cancelled = false

    const loadVersions = async () => {
      try {
        setIsLoadingVersions(true)
        setVersionError('')
        const list = await listDocumentVersions(previewElement.id)
        if (cancelled) return
        setVersions(list)

        if (!list.length) {
          setSelectedVersion(null)
          setSelectedVersionId('')
          return
        }

        const current = list.find((item) => item.is_current) || list[list.length - 1]
        setSelectedVersionId(current.id)
        const full = await getDocumentVersion(previewElement.id, current.id)
        if (cancelled) return
        setSelectedVersion(full)
      } catch (error) {
        if (cancelled) return
        setVersionError(error instanceof Error ? error.message : 'Impossible de charger les versions')
      } finally {
        if (!cancelled) {
          setIsLoadingVersions(false)
        }
      }
    }

    loadVersions()

    return () => {
      cancelled = true
    }
  }, [showElementPreview, previewElement?.id])

  const loadProjectData = async () => {
    try {
      setLoading(true)
      const [projectData, docsData, charsData, instructionsData] = await Promise.all([
        getProject(projectId),
        getDocuments(projectId),
        getCharacters(projectId),
        listInstructions(projectId),
      ])

      setProject(projectData)
      setDocuments(docsData)
      setCharacters(charsData)
      setInstructions(instructionsData)
    } catch (error) {
      console.error('Failed to load project data:', error)
    } finally {
      setLoading(false)
    }
  }

  const resetDeleteDialog = () => {
    setShowDeleteDialog(false)
    setDeleteConfirmation('')
    setDeleteError('')
  }

  const resetCharacterDialog = () => {
    setShowCharacterDialog(false)
    setCharacterForm({
      name: '',
      description: '',
      physical_description: '',
      personality: '',
      backstory: '',
    })
    setCharacterError('')
  }

  const openAutoCharactersDialog = () => {
    setAutoCharactersSummary(project?.description || '')
    setAutoCharactersPrecision('')
    setAutoCharactersError('')
    setShowAutoCharactersDialog(true)
  }

  const resetAutoCharactersDialog = () => {
    setShowAutoCharactersDialog(false)
    setAutoCharactersSummary('')
    setAutoCharactersPrecision('')
    setAutoCharactersError('')
  }

  const resetInstructionDialog = () => {
    setShowInstructionDialog(false)
    setInstructionForm({ title: '', detail: '' })
    setInstructionError('')
    setEditingInstruction(null)
  }

  const openInstructionDialog = (instruction?: Instruction) => {
    if (instruction) {
      setInstructionForm({ title: instruction.title, detail: instruction.detail })
      setEditingInstruction(instruction)
    } else {
      setInstructionForm({ title: '', detail: '' })
      setEditingInstruction(null)
    }
    setInstructionError('')
    setShowInstructionDialog(true)
  }

  const resetElementDialog = () => {
    setShowElementDialog(false)
    setElementType('chapitre')
    setElementParentId(null)
    setElementError('')
  }

  const resetGenerateDialog = () => {
    setShowGenerateDialog(false)
    setGenerateTarget(null)
    setGenerateInstructions('')
    setGenerateMinWords('')
    setGenerateMaxWords('')
    setGenerateSummary('')
    setGenerateError('')
  }

  const openElementPreview = (doc: Document) => {
    setPreviewElement(doc)
    setShowElementPreview(true)
  }

  const resetElementPreview = () => {
    setShowElementPreview(false)
    setPreviewElement(null)
    setVersions([])
    setSelectedVersionId('')
    setSelectedVersion(null)
    setVersionError('')
    setIsLoadingVersions(false)
  }

  const getElementTypeFromDocument = (doc: Document) => {
    const metaType = doc.metadata?.element_type
    if (typeof metaType === 'string') {
      return metaType
    }
    return DOCUMENT_TYPE_FALLBACK[doc.document_type] || 'section'
  }

  const getElementLabel = (elementTypeValue: string) => {
    const match = ELEMENT_TYPES.find((item) => item.value === elementTypeValue)
    return match ? match.label : elementTypeValue
  }

  const getElementLevel = (elementTypeValue: string) => {
    const match = ELEMENT_TYPES.find((item) => item.value === elementTypeValue)
    return match ? match.level : 0
  }

  const getElementDepth = (doc: Document, map: Map<string, Document>) => {
    let depth = 0
    let current = doc
    const visited = new Set<string>()
    while (current?.metadata?.parent_id && typeof current.metadata.parent_id === 'string') {
      const parentId = current.metadata.parent_id
      if (visited.has(parentId)) break
      visited.add(parentId)
      const parent = map.get(parentId)
      if (!parent) break
      depth += 1
      current = parent
    }
    return depth
  }

  const getAllowedElementTypes = (parentId: string | null) => {
    if (!parentId) return ELEMENT_TYPES
    const parent = documents.find((doc) => doc.id === parentId)
    if (!parent) return ELEMENT_TYPES
    const parentType = getElementTypeFromDocument(parent)
    const parentLevel = getElementLevel(parentType)
    return ELEMENT_TYPES.filter((item) => item.level > parentLevel)
  }

  const getMinWordCount = (doc: Document | null) => {
    if (!doc) return null
    const value = doc.metadata?.min_word_count
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value
    }
    if (typeof value === 'string') {
      const parsed = Number.parseInt(value, 10)
      return Number.isNaN(parsed) ? null : parsed
    }
    return null
  }

  const getMaxWordCount = (doc: Document | null) => {
    if (!doc) return null
    const value = doc.metadata?.max_word_count
    if (typeof value === 'number' && Number.isFinite(value)) {
      return value
    }
    if (typeof value === 'string') {
      const parsed = Number.parseInt(value, 10)
      return Number.isNaN(parsed) ? null : parsed
    }
    return null
  }

  const normalizeTitle = (value: string) => {
    const normalized = typeof value.normalize === 'function' ? value.normalize('NFKC') : value
    return normalized.trim().replace(/\s+/g, ' ').toLowerCase()
  }

  const isDeleteMatch = project
    ? normalizeTitle(deleteConfirmation) === normalizeTitle(project.title)
    : false

  const handleDeleteProject = async () => {
    if (!project) return
    if (!isDeleteMatch) {
      setDeleteError('Le nom du projet ne correspond pas')
      return
    }

    try {
      setIsDeleting(true)
      setDeleteError('')
      await deleteProject(project.id, deleteConfirmation.trim())
      router.push('/dashboard')
    } catch (error) {
      setDeleteError(error instanceof Error ? error.message : 'Une erreur est survenue')
    } finally {
      setIsDeleting(false)
    }
  }

  const handleCreateCharacter = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!project) return

    if (!characterForm.name.trim()) {
      setCharacterError('Le nom du personnage est requis')
      return
    }

    try {
      setIsSavingCharacter(true)
      setCharacterError('')
      const created = await createCharacter({
        name: characterForm.name.trim(),
        description: characterForm.description.trim() || undefined,
        physical_description: characterForm.physical_description.trim() || undefined,
        personality: characterForm.personality.trim() || undefined,
        backstory: characterForm.backstory.trim() || undefined,
        project_id: project.id,
      })
      setCharacters((prev) => [...prev, created])
      resetCharacterDialog()
    } catch (error) {
      setCharacterError(error instanceof Error ? error.message : 'Une erreur est survenue')
    } finally {
      setIsSavingCharacter(false)
    }
  }

  const handleAutoGenerateCharacters = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!project) return

    const summary = autoCharactersSummary.trim()
    if (!summary) {
      setAutoCharactersError('Ajoutez un resume du projet pour generer les personnages')
      return
    }

    try {
      setIsGeneratingCharacters(true)
      setAutoCharactersError('')
      const precision = autoCharactersPrecision.trim()
      const created = await generateMainCharacters(project.id, summary, precision || undefined)
      setCharacters((prev) => [...prev, ...created])
      resetAutoCharactersDialog()
    } catch (error) {
      setAutoCharactersError(error instanceof Error ? error.message : 'Une erreur est survenue')
    } finally {
      setIsGeneratingCharacters(false)
    }
  }

  const handleSaveInstruction = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!project) return
    const title = instructionForm.title.trim()
    const detail = instructionForm.detail.trim()
    if (!title || !detail) {
      setInstructionError('Le titre et le detail sont requis')
      return
    }

    try {
      setIsSavingInstruction(true)
      setInstructionError('')
      if (editingInstruction) {
        const updated = await updateInstruction(project.id, editingInstruction.id, { title, detail })
        setInstructions((prev) =>
          prev.map((item) => (item.id === updated.id ? updated : item))
        )
      } else {
        const created = await createInstruction(project.id, { title, detail })
        setInstructions((prev) => [...prev, created])
      }
      resetInstructionDialog()
    } catch (error) {
      setInstructionError(error instanceof Error ? error.message : 'Une erreur est survenue')
    } finally {
      setIsSavingInstruction(false)
    }
  }

  const handleDeleteInstruction = async (instructionId: string) => {
    if (!project) return
    try {
      await deleteInstruction(project.id, instructionId)
      setInstructions((prev) => prev.filter((item) => item.id !== instructionId))
    } catch (error) {
      console.error('Failed to delete instruction:', error)
    }
  }

  const handleCreateElement = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!project) return
    try {
      setIsCreatingElement(true)
      setElementError('')
      const created = await createElement(project.id, elementType, elementParentId || undefined)
      setDocuments((prev) => [...prev, created])
      resetElementDialog()
    } catch (error) {
      setElementError(error instanceof Error ? error.message : 'Une erreur est survenue')
    } finally {
      setIsCreatingElement(false)
    }
  }

  const handleSelectVersion = async (versionId: string) => {
    setSelectedVersionId(versionId)
    if (!previewElement || !versionId) {
      setSelectedVersion(null)
      return
    }
    try {
      setIsLoadingVersions(true)
      setVersionError('')
      const full = await getDocumentVersion(previewElement.id, versionId)
      setSelectedVersion(full)
    } catch (error) {
      setVersionError(error instanceof Error ? error.message : 'Impossible de charger la version')
    } finally {
      setIsLoadingVersions(false)
    }
  }

  const openGenerateDialog = (doc: Document) => {
    setGenerateTarget(doc)
    setGenerateInstructions('')
    const existingMin = getMinWordCount(doc)
    setGenerateMinWords(existingMin ? String(existingMin) : '')
    const existingMax = getMaxWordCount(doc)
    setGenerateMaxWords(existingMax ? String(existingMax) : '')
    const existingSummary = typeof doc.metadata?.summary === 'string' ? doc.metadata.summary : ''
    setGenerateSummary(existingSummary)
    setGenerateError('')
    setShowGenerateDialog(true)
  }

  const handleGenerateElement = async (event: React.FormEvent) => {
    event.preventDefault()
    if (!generateTarget) return

    const minWordsValue = generateMinWords.trim()
    let minWordCount: number | undefined
    if (minWordsValue) {
      const parsed = Number.parseInt(minWordsValue, 10)
      if (Number.isNaN(parsed) || parsed < 1) {
        setGenerateError('Le nombre de mots minimum doit etre superieur a 0')
        return
      }
      minWordCount = parsed
    }

    const maxWordsValue = generateMaxWords.trim()
    let maxWordCount: number | undefined
    if (maxWordsValue) {
      const parsedMax = Number.parseInt(maxWordsValue, 10)
      if (Number.isNaN(parsedMax) || parsedMax < 1) {
        setGenerateError('Le nombre de mots maximum doit etre superieur a 0')
        return
      }
      maxWordCount = parsedMax
    }

    if (minWordCount && maxWordCount && maxWordCount < minWordCount) {
      setGenerateError('Le nombre de mots maximum doit etre superieur ou egal au minimum')
      return
    }

    try {
      setIsGeneratingElement(true)
      setGenerateError('')
      const updated = await generateElement(
        generateTarget.id,
        generateInstructions.trim() || undefined,
        minWordCount,
        maxWordCount,
        generateSummary.trim() || undefined
      )
      setDocuments((prev) => prev.map((doc) => (doc.id === updated.id ? updated : doc)))
      resetGenerateDialog()
    } catch (error) {
      setGenerateError(error instanceof Error ? error.message : 'Une erreur est survenue')
    } finally {
      setIsGeneratingElement(false)
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'draft':
        return 'default'
      case 'in_progress':
        return 'primary'
      case 'completed':
        return 'success'
      case 'archived':
        return 'warning'
      default:
        return 'default'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'draft':
        return 'Brouillon'
      case 'in_progress':
        return 'En cours'
      case 'completed':
        return 'Termine'
      case 'archived':
        return 'Archive'
      default:
        return status
    }
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'protagonist':
        return 'primary'
      case 'antagonist':
        return 'danger'
      case 'supporting':
        return 'info'
      case 'minor':
        return 'default'
      default:
        return 'default'
    }
  }

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'protagonist':
        return 'Protagoniste'
      case 'antagonist':
        return 'Antagoniste'
      case 'supporting':
        return 'Secondaire'
      case 'minor':
        return 'Mineur'
      default:
        return role
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-atlas flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-700 mx-auto"></div>
          <p className="mt-4 text-ink/60">Chargement...</p>
        </div>
      </div>
    )
  }

  if (!project) {
    return (
      <div className="min-h-screen bg-atlas flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-semibold text-ink mb-2">Projet non trouve</h2>
          <Button variant="primary" onClick={() => router.push('/dashboard')}>
            Retour au tableau de bord
          </Button>
        </div>
      </div>
    )
  }

  const tabs = [
    {
      id: 'overview',
      label: 'Vue d ensemble',
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      ),
    },
    {
      id: 'elements',
      label: 'Elements',
      count: documents.length,
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h10M7 11h6M7 15h8M5 3h14v18H5z" />
        </svg>
      ),
    },
    {
      id: 'instructions',
      label: 'Instructions',
      count: instructions.length,
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h10M4 18h7" />
        </svg>
      ),
    },
    {
      id: 'characters',
      label: 'Personnages',
      count: characters.length,
      icon: (
        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M20 21a8 8 0 10-16 0" />
          <circle cx="12" cy="7" r="4" />
        </svg>
      ),
    },
  ]

  const documentMap = new Map(documents.map((doc) => [doc.id, doc]))
  const sortedDocuments = [...documents].sort((a, b) => a.order_index - b.order_index)
  const parentOptions = sortedDocuments.filter((doc) => {
    const typeValue = getElementTypeFromDocument(doc)
    return getElementLevel(typeValue) < MAX_ELEMENT_LEVEL
  })
  const previewMinWords = selectedVersion?.min_word_count ?? getMinWordCount(previewElement)
  const previewMaxWords = selectedVersion?.max_word_count ?? getMaxWordCount(previewElement)

  return (
    <div className="min-h-screen bg-atlas">
      <header className="border-b border-stone-200 bg-white/80 backdrop-blur">
        <div className="mx-auto max-w-7xl px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <Button
                variant="ghost"
                onClick={() => router.push('/dashboard')}
                className="flex items-center"
              >
                <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                </svg>
                Retour
              </Button>
              <div>
                <h1 className="text-2xl font-semibold text-ink font-serif">{project.title}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant={getStatusColor(project.status)}>{getStatusLabel(project.status)}</Badge>
                  {project.genre && <span className="text-sm text-ink/50">{project.genre}</span>}
                </div>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Button variant="primary" onClick={() => setShowElementDialog(true)}>
                Ajouter un element
              </Button>
              <Button variant="danger" onClick={() => setShowDeleteDialog(true)}>
                Supprimer
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="flex flex-wrap gap-2 rounded-2xl bg-white/80 p-2 shadow-soft">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`flex items-center gap-2 rounded-xl px-4 py-2 text-sm transition ${
                activeTab === tab.id
                  ? 'bg-brand-700 text-white'
                  : 'text-ink/60 hover:bg-white'
              }`}
            >
              {tab.icon}
              <span>{tab.label}</span>
              {'count' in tab && tab.count !== undefined && (
                <Badge variant={activeTab === tab.id ? 'default' : 'primary'}>{tab.count}</Badge>
              )}
            </button>
          ))}
        </div>

        <div className="mt-6">
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
              <div className="lg:col-span-2 space-y-6">
                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle>Informations du projet</CardTitle>
                  </CardHeader>
                  <CardContent>
                    {project.description && (
                      <div className="mb-4">
                        <h4 className="font-semibold text-ink/70 mb-2">Description</h4>
                        <p className="text-ink/70">{project.description}</p>
                      </div>
                    )}
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <h4 className="text-sm font-semibold text-ink/60">Mots ecrits</h4>
                        <p className="text-2xl font-semibold text-brand-700">
                          {formatWordCount(project.current_word_count)}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-ink/60">Temps de lecture</h4>
                        <p className="text-2xl font-semibold text-accent-600">
                          {calculateReadingTime(project.current_word_count)}
                        </p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-ink/60">Elements</h4>
                        <p className="text-2xl font-semibold text-emerald-600">{documents.length}</p>
                      </div>
                      <div>
                        <h4 className="text-sm font-semibold text-ink/60">Personnages</h4>
                        <p className="text-2xl font-semibold text-ink">{characters.length}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {project.structure_template && (
                  <Card variant="elevated">
                    <CardHeader>
                      <CardTitle>Structure narrative</CardTitle>
                      <CardDescription>{project.structure_template}</CardDescription>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-ink/70">
                        Votre projet utilise la structure: {project.structure_template}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>

              <div className="space-y-6">
                <Card variant="elevated">
                  <CardHeader>
                    <CardTitle>Details</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div>
                      <span className="text-sm text-ink/50">Cree le</span>
                      <p className="font-medium text-ink">{formatDate(project.created_at)}</p>
                    </div>
                    <div>
                      <span className="text-sm text-ink/50">Derniere modification</span>
                      <p className="font-medium text-ink">{formatDate(project.updated_at)}</p>
                    </div>
                  </CardContent>
                </Card>

                <Card variant="outlined" className="border-dashed border-brand-300 bg-brand-50">
                  <CardContent className="p-6 text-center">
                    <div className="mx-auto mb-3 flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h10M4 18h7" />
                      </svg>
                    </div>
                    <h4 className="font-semibold text-ink mb-2">Instructions de projet</h4>
                    <p className="text-sm text-ink/70 mb-4">
                      Ajoutez des consignes qui guideront chaque generation.
                    </p>
                    <Button variant="primary" onClick={() => setActiveTab('instructions')} className="w-full">
                      Gerer les instructions
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          )}

          {activeTab === 'elements' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-serif text-lg text-ink">Elements</h3>
                <Button variant="primary" onClick={() => setShowElementDialog(true)}>
                  Ajouter un element
                </Button>
              </div>

              {sortedDocuments.length === 0 ? (
                <Card variant="outlined" className="p-12 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-200 text-ink">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M7 7h10M7 11h6M7 15h8M5 3h14v18H5z" />
                    </svg>
                  </div>
                  <h3 className="font-serif text-xl text-ink">Aucun element</h3>
                  <p className="text-ink/70">Ajoutez une partie, un chapitre ou une section.</p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {sortedDocuments.map((doc) => {
                    const elementTypeValue = getElementTypeFromDocument(doc)
                    const elementLabel = getElementLabel(elementTypeValue)
                    const depth = getElementDepth(doc, documentMap)
                    const hasContent = Boolean(doc.content && doc.content.trim())
                    const minWordCount = getMinWordCount(doc)
                    const maxWordCount = getMaxWordCount(doc)
                    const minWordLabel = minWordCount ? ` - min ${formatWordCount(minWordCount)} mots` : ''
                    const maxWordLabel = maxWordCount ? ` - max ${formatWordCount(maxWordCount)} mots` : ''
                    return (
                      <div key={doc.id} style={{ marginLeft: depth * 20 }}>
                        <Card
                          variant="elevated"
                          hoverable
                          onClick={() => openElementPreview(doc)}
                        >
                          <CardHeader>
                            <div className="flex flex-wrap items-start justify-between gap-4">
                              <div>
                                <CardTitle>{doc.title}</CardTitle>
                                <CardDescription className="mt-1">
                                  {elementLabel} - {formatWordCount(doc.word_count)} mots{minWordLabel}{maxWordLabel} -{' '}
                                  {hasContent ? 'Rempli' : 'Vide'}
                                </CardDescription>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge variant={hasContent ? 'success' : 'warning'}>
                                  {hasContent ? 'Pret' : 'A generer'}
                                </Badge>
                                <Button
                                  variant="outline"
                                  onClick={(event) => {
                                    event.stopPropagation()
                                    openGenerateDialog(doc)
                                  }}
                                >
                                  {hasContent ? 'Corriger' : 'Generer'}
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                        </Card>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {activeTab === 'instructions' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-serif text-lg text-ink">Instructions</h3>
                <Button variant="primary" onClick={() => openInstructionDialog()}>
                  Ajouter une instruction
                </Button>
              </div>

              {instructions.length === 0 ? (
                <Card variant="outlined" className="p-12 text-center">
                  <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-200 text-ink">
                    <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h10M4 18h7" />
                    </svg>
                  </div>
                  <h3 className="font-serif text-xl text-ink">Aucune instruction</h3>
                  <p className="text-ink/70">Ajoutez des consignes pour guider la generation.</p>
                </Card>
              ) : (
                <div className="space-y-3">
                  {instructions.map((instruction) => (
                    <Card key={instruction.id} variant="elevated">
                      <CardHeader>
                        <div className="flex flex-wrap items-start justify-between gap-4">
                          <div>
                            <CardTitle>{instruction.title}</CardTitle>
                            <CardDescription className="mt-2 whitespace-pre-wrap">
                              {instruction.detail}
                            </CardDescription>
                          </div>
                          <div className="flex items-center gap-2">
                            <Button variant="outline" onClick={() => openInstructionDialog(instruction)}>
                              Modifier
                            </Button>
                            <Button variant="ghost" onClick={() => handleDeleteInstruction(instruction.id)}>
                              Supprimer
                            </Button>
                          </div>
                        </div>
                      </CardHeader>
                    </Card>
                  ))}
                </div>
              )}
            </div>
          )}

          {activeTab === 'characters' && (
            <div className="space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h3 className="font-serif text-lg text-ink">Personnages</h3>
                <div className="flex items-center gap-3">
                  <Button variant="outline" onClick={openAutoCharactersDialog}>
                    Generer les personnages
                  </Button>
                  <Button variant="primary" onClick={() => setShowCharacterDialog(true)}>
                    Nouveau personnage
                  </Button>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
                {characters.length === 0 ? (
                  <Card variant="outlined" className="col-span-full p-12 text-center">
                    <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-200 text-ink">
                      <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M20 21a8 8 0 10-16 0" />
                        <circle cx="12" cy="7" r="4" />
                      </svg>
                    </div>
                    <h3 className="font-serif text-xl text-ink">Aucun personnage</h3>
                    <p className="text-ink/70">Creez vos personnages et leurs details.</p>
                  </Card>
                ) : (
                  characters.map((char) => (
                    <Card key={char.id} variant="elevated" hoverable className="cursor-pointer">
                      <CardHeader>
                        <div className="flex items-start justify-between gap-3">
                          <CardTitle>{char.name}</CardTitle>
                          {char.role && (
                            <Badge variant={getRoleColor(char.role)}>{getRoleLabel(char.role)}</Badge>
                          )}
                        </div>
                        {char.description && (
                          <CardDescription className="line-clamp-3 mt-2">
                            {char.description}
                          </CardDescription>
                        )}
                      </CardHeader>
                    </Card>
                  ))
                )}
              </div>
            </div>
          )}

        </div>
      </div>

      <Dialog open={showDeleteDialog} onClose={resetDeleteDialog} size="sm">
        <DialogHeader>
          <DialogTitle>Supprimer le projet</DialogTitle>
          <DialogDescription>
            Cette action est irreversible. Tapez le nom du projet pour confirmer.
          </DialogDescription>
        </DialogHeader>
        <DialogContent className="space-y-4">
          <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
            Nom attendu: <span className="font-semibold">{project?.title}</span>
          </div>
          <Input
            label="Nom du projet"
            value={deleteConfirmation}
            onChange={(e) => {
              setDeleteConfirmation(e.target.value)
              if (deleteError) {
                setDeleteError('')
              }
            }}
            placeholder="Saisissez le nom exact"
            disabled={isDeleting}
            error={deleteError || undefined}
          />
        </DialogContent>
        <DialogFooter>
          <Button variant="ghost" onClick={resetDeleteDialog} disabled={isDeleting}>
            Annuler
          </Button>
          <Button
            variant="danger"
            onClick={handleDeleteProject}
            disabled={!project || !isDeleteMatch || isDeleting}
            isLoading={isDeleting}
          >
            Supprimer definitivement
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog open={showInstructionDialog} onClose={resetInstructionDialog} size="md">
        <DialogHeader>
          <DialogTitle>{editingInstruction ? 'Modifier l instruction' : 'Nouvelle instruction'}</DialogTitle>
          <DialogDescription>
            Les instructions sont ajoutees au contexte de generation de votre projet.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSaveInstruction}>
          <DialogContent className="space-y-4">
            <Input
              label="Titre"
              value={instructionForm.title}
              onChange={(e) => {
                setInstructionForm((prev) => ({ ...prev, title: e.target.value }))
                if (instructionError) setInstructionError('')
              }}
              placeholder="Ex: Ton general"
              disabled={isSavingInstruction}
              error={instructionError || undefined}
            />
            <Textarea
              value={instructionForm.detail}
              onChange={(e) => {
                setInstructionForm((prev) => ({ ...prev, detail: e.target.value }))
                if (instructionError) setInstructionError('')
              }}
              placeholder="Detaillez votre consigne"
              className="min-h-[140px]"
              disabled={isSavingInstruction}
            />
            {instructionError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {instructionError}
              </div>
            )}
          </DialogContent>
          <DialogFooter>
            <Button variant="ghost" onClick={resetInstructionDialog} disabled={isSavingInstruction}>
              Annuler
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={!instructionForm.title.trim() || !instructionForm.detail.trim() || isSavingInstruction}
              isLoading={isSavingInstruction}
            >
              {editingInstruction ? 'Mettre a jour' : 'Ajouter'}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>

      <Dialog open={showElementDialog} onClose={resetElementDialog} size="md">
        <DialogHeader>
          <DialogTitle>Ajouter un element</DialogTitle>
          <DialogDescription>
            Choisissez le type d element et son emplacement dans la structure.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleCreateElement}>
          <DialogContent className="space-y-4">
            <Select
              label="Type d element"
              value={elementType}
              onChange={(e) => {
                setElementType(e.target.value)
                if (elementError) setElementError('')
              }}
              options={getAllowedElementTypes(elementParentId).map((item) => ({
                value: item.value,
                label: item.label,
              }))}
              disabled={isCreatingElement}
            />
            <Select
              label="Element parent (optionnel)"
              value={elementParentId || ''}
              onChange={(e) => {
                const nextParent = e.target.value || null
                setElementParentId(nextParent)
                const allowed = getAllowedElementTypes(nextParent)
                if (!allowed.length) {
                  setElementError('Ce parent ne peut pas avoir d element enfant')
                  return
                }
                if (!allowed.some((item) => item.value === elementType)) {
                  setElementType(allowed[0].value)
                }
                if (elementError) {
                  setElementError('')
                }
              }}
              options={[
                { value: '', label: 'Aucun (niveau racine)' },
                ...parentOptions.map((doc) => {
                  const depth = getElementDepth(doc, documentMap)
                  const prefix = depth ? `${'>'.repeat(depth)} ` : ''
                  return { value: doc.id, label: `${prefix}${doc.title}` }
                }),
              ]}
              disabled={isCreatingElement}
            />
            {elementError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {elementError}
              </div>
            )}
          </DialogContent>
          <DialogFooter>
            <Button variant="ghost" onClick={resetElementDialog} disabled={isCreatingElement}>
              Annuler
            </Button>
            <Button variant="primary" type="submit" isLoading={isCreatingElement}>
              Creer
            </Button>
          </DialogFooter>
        </form>
      </Dialog>

      <Dialog open={showGenerateDialog} onClose={resetGenerateDialog} size="md">
        <DialogHeader>
          <DialogTitle>
            {generateTarget && (generateTarget.content || '').trim() ? 'Corriger l element' : 'Generer l element'}
          </DialogTitle>
          <DialogDescription>
            Ajoutez des instructions pour guider la generation.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleGenerateElement}>
          <DialogContent className="space-y-4">
            {generateTarget && (
              <div className="rounded-2xl border border-stone-200 bg-white/80 px-4 py-3 text-sm text-ink/70">
                Element: <span className="font-semibold text-ink">{generateTarget.title}</span>
              </div>
            )}
            <Input
              label="Nombre de mots minimum"
              type="number"
              value={generateMinWords}
              onChange={(e) => {
                setGenerateMinWords(e.target.value)
                if (generateError) setGenerateError('')
              }}
              placeholder="Ex: 8000"
              disabled={isGeneratingElement}
            />
            <Input
              label="Nombre de mots maximum"
              type="number"
              value={generateMaxWords}
              onChange={(e) => {
                setGenerateMaxWords(e.target.value)
                if (generateError) setGenerateError('')
              }}
              placeholder="Ex: 9000"
              disabled={isGeneratingElement}
            />
            <Textarea
              label="Resume"
              value={generateSummary}
              onChange={(e) => {
                setGenerateSummary(e.target.value)
                if (generateError) setGenerateError('')
              }}
              placeholder="Resume de ce que l element doit contenir"
              className="min-h-[120px]"
              disabled={isGeneratingElement}
            />
            <Textarea
              value={generateInstructions}
              onChange={(e) => {
                setGenerateInstructions(e.target.value)
                if (generateError) setGenerateError('')
              }}
              placeholder="Instructions supplementaires"
              className="min-h-[140px]"
              disabled={isGeneratingElement}
            />
            {generateError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {generateError}
              </div>
            )}
          </DialogContent>
          <DialogFooter>
            <Button variant="ghost" onClick={resetGenerateDialog} disabled={isGeneratingElement}>
              Annuler
            </Button>
            <Button variant="primary" type="submit" isLoading={isGeneratingElement}>
              {generateTarget && (generateTarget.content || '').trim() ? 'Corriger' : 'Generer'}
            </Button>
          </DialogFooter>
        </form>
      </Dialog>

      <Dialog open={showElementPreview} onClose={resetElementPreview} size="lg">
        <DialogHeader>
          <DialogTitle>{previewElement?.title || 'Element'}</DialogTitle>
          <DialogDescription>
            {previewElement
              ? `${formatWordCount(selectedVersion?.word_count ?? previewElement.word_count)} mots`
              : 'Contenu'}
            {previewMinWords ? ` - min ${formatWordCount(previewMinWords)} mots` : ''}
            {previewMaxWords ? ` - max ${formatWordCount(previewMaxWords)} mots` : ''}
          </DialogDescription>
        </DialogHeader>
        <DialogContent className="space-y-4">
          {versions.length > 0 && (
            <Select
              label="Version"
              value={selectedVersionId}
              onChange={(e) => handleSelectVersion(e.target.value)}
              options={versions.map((version) => {
                const suffix = version.is_current ? ' (actuelle)' : ''
                return {
                  value: version.id,
                  label: `${version.version} - ${formatDate(version.created_at)}${suffix}`,
                }
              })}
              disabled={isLoadingVersions}
            />
          )}
          {versionError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {versionError}
            </div>
          )}
          {selectedVersion?.summary && (
            <div className="rounded-2xl border border-stone-200 bg-white/80 px-4 py-3 text-sm text-ink/70">
              <span className="font-semibold text-ink">Resume:</span> {selectedVersion.summary}
            </div>
          )}
          {selectedVersion?.instructions && (
            <div className="rounded-2xl border border-stone-200 bg-white/80 px-4 py-3 text-sm text-ink/70 whitespace-pre-wrap">
              <span className="font-semibold text-ink">Instructions:</span> {selectedVersion.instructions}
            </div>
          )}
          <div className="rounded-2xl border border-stone-200 bg-white/80 px-4 py-3 text-sm text-ink/70 whitespace-pre-wrap max-h-[60vh] overflow-y-auto">
            {selectedVersion?.content && selectedVersion.content.trim()
              ? selectedVersion.content
              : previewElement?.content && previewElement.content.trim()
              ? previewElement.content
              : 'Element vide pour le moment.'}
          </div>
        </DialogContent>
        <DialogFooter>
          <Button variant="ghost" onClick={resetElementPreview}>
            Fermer
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog open={showCharacterDialog} onClose={resetCharacterDialog} size="md">
        <DialogHeader>
          <DialogTitle>Nouveau personnage</DialogTitle>
          <DialogDescription>
            Enregistrez un personnage dans votre projet pour le reutiliser dans les elements.
          </DialogDescription>
        </DialogHeader>
        <DialogContent className="space-y-4">
          <Input
            label="Nom"
            value={characterForm.name}
            onChange={(e) => {
              setCharacterForm((prev) => ({ ...prev, name: e.target.value }))
              if (characterError) setCharacterError('')
            }}
            placeholder="Ex: Lea Martin"
            disabled={isSavingCharacter}
            error={characterError || undefined}
          />
          <Textarea
            value={characterForm.description}
            onChange={(e) => setCharacterForm((prev) => ({ ...prev, description: e.target.value }))}
            placeholder="Description generale"
            className="min-h-[90px]"
            disabled={isSavingCharacter}
          />
          <Textarea
            value={characterForm.physical_description}
            onChange={(e) => setCharacterForm((prev) => ({ ...prev, physical_description: e.target.value }))}
            placeholder="Description physique"
            className="min-h-[90px]"
            disabled={isSavingCharacter}
          />
          <Textarea
            value={characterForm.personality}
            onChange={(e) => setCharacterForm((prev) => ({ ...prev, personality: e.target.value }))}
            placeholder="Traits de personnalite"
            className="min-h-[90px]"
            disabled={isSavingCharacter}
          />
          <Textarea
            value={characterForm.backstory}
            onChange={(e) => setCharacterForm((prev) => ({ ...prev, backstory: e.target.value }))}
            placeholder="Backstory"
            className="min-h-[90px]"
            disabled={isSavingCharacter}
          />
          {characterError && (
            <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
              {characterError}
            </div>
          )}
        </DialogContent>
        <DialogFooter>
          <Button variant="ghost" onClick={resetCharacterDialog} disabled={isSavingCharacter}>
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={handleCreateCharacter}
            disabled={!characterForm.name.trim() || isSavingCharacter}
            isLoading={isSavingCharacter}
          >
            Ajouter le personnage
          </Button>
        </DialogFooter>
      </Dialog>

      <Dialog open={showAutoCharactersDialog} onClose={resetAutoCharactersDialog} size="md">
        <DialogHeader>
          <DialogTitle>Generer les personnages principaux</DialogTitle>
          <DialogDescription>
            THOTH cree des personnages a partir du resume du projet et les enregistre automatiquement.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleAutoGenerateCharacters}>
          <DialogContent className="space-y-4">
            <Textarea
              value={autoCharactersSummary}
              onChange={(e) => {
                setAutoCharactersSummary(e.target.value)
                if (autoCharactersError) setAutoCharactersError('')
              }}
              placeholder="Resume du projet"
              className="min-h-[140px]"
              disabled={isGeneratingCharacters}
            />
            <Input
              label="Precision (optionnel)"
              value={autoCharactersPrecision}
              onChange={(e) => setAutoCharactersPrecision(e.target.value)}
              placeholder="Ex: 3 personnages, romance contemporaine"
              disabled={isGeneratingCharacters}
            />
            {autoCharactersError && (
              <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700">
                {autoCharactersError}
              </div>
            )}
          </DialogContent>
          <DialogFooter>
            <Button variant="ghost" onClick={resetAutoCharactersDialog} disabled={isGeneratingCharacters}>
              Annuler
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={!autoCharactersSummary.trim() || isGeneratingCharacters}
              isLoading={isGeneratingCharacters}
            >
              Generer et enregistrer
            </Button>
          </DialogFooter>
        </form>
      </Dialog>
    </div>
  )
}
