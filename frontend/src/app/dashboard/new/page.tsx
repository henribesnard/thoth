/**
 * Modern dashboard with project management
 */

'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { getAuthToken, removeAuthToken } from '@/lib/api'
import { getProjects } from '@/lib/api-extended'
import { Button } from '@/components/ui/button'
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { CreateProjectWizard } from '@/components/projects/create-project-wizard'
import { formatDate, formatWordCount } from '@/lib/utils'
import type { Project } from '@/types'

export default function ModernDashboardPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [loading, setLoading] = useState(true)
  const [projects, setProjects] = useState<Project[]>([])
  const [showCreateWizard, setShowCreateWizard] = useState(false)

  useEffect(() => {
    const token = getAuthToken()
    if (!token) {
      router.push('/auth/login')
    } else {
      loadProjects()
    }
  }, [router])

  useEffect(() => {
    if (searchParams.get('create') === '1') {
      setShowCreateWizard(true)
    }
  }, [searchParams])

  const loadProjects = async () => {
    try {
      setLoading(true)
      const result = await getProjects()
      setProjects(result.projects)
    } catch (error) {
      if (error instanceof Error && /validate credentials|not authenticated|401/i.test(error.message)) {
        removeAuthToken()
        router.push('/auth/login')
        return
      }
      console.error('Failed to load projects:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = () => {
    removeAuthToken()
    router.push('/')
  }

  const handleProjectCreated = () => {
    loadProjects()
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

  return (
    <div className="min-h-screen bg-atlas">
      <header className="sticky top-0 z-20 border-b border-stone-200 bg-white/80 backdrop-blur">
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-2xl bg-brand-700 text-white text-lg font-semibold">
              T
            </div>
            <div>
              <p className="text-xs uppercase tracking-[0.25em] text-brand-700">THOTH</p>
              <p className="text-xs text-ink/60">Assistant d'ecriture litteraire</p>
            </div>
          </div>
          <Button variant="outline" onClick={handleLogout}>
            Deconnexion
          </Button>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-6 md:grid-cols-4">
          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-ink/60">Projets</p>
                  <p className="text-3xl font-semibold text-ink">{projects.length}</p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M3 7h6l2 2h10v10H3z" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-ink/60">Mots ecrits</p>
                  <p className="text-3xl font-semibold text-ink">
                    {formatWordCount(projects.reduce((sum, p) => sum + p.current_word_count, 0))}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-100 text-accent-700">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h10M4 17h7" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-ink/60">En cours</p>
                  <p className="text-3xl font-semibold text-ink">
                    {projects.filter((p) => p.status === 'in_progress').length}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-stone-200 text-ink">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 8v4l3 3" />
                    <circle cx="12" cy="12" r="8" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card variant="elevated">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs uppercase tracking-[0.2em] text-ink/60">Termines</p>
                  <p className="text-3xl font-semibold text-ink">
                    {projects.filter((p) => p.status === 'completed').length}
                  </p>
                </div>
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-emerald-100 text-emerald-700">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div className="lg:col-span-2">
            <div className="mb-6 flex items-center justify-between">
              <h2 className="font-serif text-2xl text-ink">Mes projets</h2>
              <Button variant="primary" onClick={() => setShowCreateWizard(true)}>
                Nouveau projet
              </Button>
            </div>

            {projects.length === 0 ? (
              <Card variant="outlined" className="p-10 text-center">
                <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
                  <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
                  </svg>
                </div>
                <h3 className="font-serif text-xl text-ink">Aucun projet pour le moment</h3>
                <p className="mt-2 text-sm text-ink/60">
                  Creez votre premier projet et commencez a ecrire avec THOTH.
                </p>
                <Button variant="primary" className="mt-6" onClick={() => setShowCreateWizard(true)}>
                  Creer mon premier projet
                </Button>
              </Card>
            ) : (
              <div className="space-y-4">
                {projects.map((project) => (
                  <Card
                    key={project.id}
                    variant="elevated"
                    hoverable
                    onClick={() => router.push(`/projects/${project.id}`)}
                    className="cursor-pointer"
                  >
                    <CardHeader>
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex-1">
                          <CardTitle className="text-xl">{project.title}</CardTitle>
                          {project.description && (
                            <CardDescription className="mt-2 line-clamp-2">
                              {project.description}
                            </CardDescription>
                          )}
                        </div>
                        <Badge variant={getStatusColor(project.status)}>
                          {getStatusLabel(project.status)}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="flex flex-wrap items-center justify-between gap-4 text-sm text-ink/60">
                        <div className="flex flex-wrap items-center gap-4">
                          {project.genre && (
                            <span className="flex items-center gap-2">
                              <span className="h-2 w-2 rounded-full bg-accent-500" />
                              {project.genre}
                            </span>
                          )}
                          <span className="flex items-center gap-2">
                            <span className="h-2 w-2 rounded-full bg-brand-500" />
                            {formatWordCount(project.current_word_count)} mots
                          </span>
                        </div>
                        <span>{formatDate(project.updated_at)}</span>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>

          <div className="lg:col-span-1">
            <Card variant="outlined" className="p-8 text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h10M4 18h7" />
                </svg>
              </div>
              <h3 className="font-serif text-lg text-ink">Instructions de projet</h3>
              <p className="mt-2 text-sm text-ink/60">
                Ouvrez un projet pour definir les instructions et generer les elements.
              </p>
            </Card>
          </div>
        </div>
      </div>

      <CreateProjectWizard
        open={showCreateWizard}
        onClose={() => setShowCreateWizard(false)}
        onSuccess={handleProjectCreated}
      />
    </div>
  )
}
