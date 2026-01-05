/**
 * Multi-step wizard for creating a new project
 */

'use client'

import * as React from 'react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Select } from '@/components/ui/select'
import { Card, CardContent } from '@/components/ui/card'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { createProject } from '@/lib/api-extended'
import { Genre, type ProjectCreate } from '@/types'

interface CreateProjectWizardProps {
  open: boolean
  onClose: () => void
  onSuccess: (projectId: string) => void
}

type Step = 'type' | 'details' | 'structure'

const GENRE_OPTIONS = [
  { value: '', label: 'Selectionnez un genre' },
  { value: Genre.FICTION, label: 'Fiction' },
  { value: Genre.FANTASY, label: 'Fantasy' },
  { value: Genre.SCIFI, label: 'Science fiction' },
  { value: Genre.THRILLER, label: 'Thriller' },
  { value: Genre.ROMANCE, label: 'Romance' },
  { value: Genre.MYSTERY, label: 'Mystere' },
  { value: Genre.HORROR, label: 'Horreur' },
  { value: Genre.HISTORICAL, label: 'Historique' },
  { value: Genre.OTHER, label: 'Autre' },
]

const STRUCTURE_OPTIONS = [
  { value: '', label: 'Aucune structure predefinie' },
  { value: '3-act', label: 'Structure en 3 actes (classique)' },
  { value: '5-act', label: 'Structure en 5 actes (Shakespeare)' },
  { value: 'hero-journey', label: 'Voyage du heros (Campbell)' },
  { value: 'save-the-cat', label: 'Save The Cat (Blake Snyder)' },
  { value: 'seven-point', label: 'Structure en 7 points (Dan Wells)' },
]

export function CreateProjectWizard({ open, onClose, onSuccess }: CreateProjectWizardProps) {
  const [step, setStep] = React.useState<Step>('type')
  const [projectType, setProjectType] = React.useState<'new' | 'import'>('new')
  const [isLoading, setIsLoading] = React.useState(false)
  const [error, setError] = React.useState<string>('')

  const [formData, setFormData] = React.useState<ProjectCreate>({
    title: '',
    description: '',
    genre: undefined,
    structure_template: '',
  })

  const handleReset = () => {
    setStep('type')
    setProjectType('new')
    setFormData({
      title: '',
      description: '',
      genre: undefined,
      structure_template: '',
    })
    setError('')
  }

  const handleClose = () => {
    handleReset()
    onClose()
  }

  const handleNext = () => {
    if (step === 'type') setStep('details')
    else if (step === 'details') setStep('structure')
  }

  const handleBack = () => {
    if (step === 'structure') setStep('details')
    else if (step === 'details') setStep('type')
  }

  const handleSubmit = async () => {
    if (!formData.title.trim()) {
      setError('Le titre est obligatoire')
      return
    }

    setIsLoading(true)
    setError('')

    try {
      const project = await createProject({
        ...formData,
        genre: formData.genre || undefined,
        structure_template: formData.structure_template || undefined,
      })

      onSuccess(project.id)
      handleClose()
    } catch (err: any) {
      setError(err.message || 'Erreur lors de la creation du projet')
    } finally {
      setIsLoading(false)
    }
  }

  const renderStepIndicator = () => (
    <div className="flex items-center justify-center space-x-2 mb-6">
      {['type', 'details', 'structure'].map((s, index) => (
        <React.Fragment key={s}>
          <div
            className={cn(
              'w-8 h-8 rounded-full flex items-center justify-center text-sm font-semibold transition-colors',
              step === s
                ? 'bg-brand-700 text-white'
                : ['type', 'details', 'structure'].indexOf(step) > index
                ? 'bg-brand-200 text-brand-800'
                : 'bg-stone-200 text-ink/50'
            )}
          >
            {index + 1}
          </div>
          {index < 2 && (
            <div
              className={cn(
                'w-12 h-1 rounded-full transition-colors',
                ['type', 'details', 'structure'].indexOf(step) > index ? 'bg-brand-300' : 'bg-stone-200'
              )}
            />
          )}
        </React.Fragment>
      ))}
    </div>
  )

  const renderTypeStep = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-center mb-6">Comment souhaitez-vous commencer ?</h3>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card
          variant={projectType === 'new' ? 'elevated' : 'outlined'}
          hoverable
          onClick={() => setProjectType('new')}
          className={cn(
            'cursor-pointer transition-all p-6',
            projectType === 'new' && 'ring-2 ring-brand-500'
          )}
        >
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-brand-100 text-brand-700">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
              </svg>
            </div>
            <h4 className="font-semibold mb-2">Nouveau projet</h4>
            <p className="text-sm text-ink/70">
              Commencez une nouvelle histoire depuis le debut avec l'aide de THOTH.
            </p>
          </div>
        </Card>

        <Card
          variant={projectType === 'import' ? 'elevated' : 'outlined'}
          hoverable
          onClick={() => setProjectType('import')}
          className={cn(
            'cursor-pointer transition-all p-6',
            projectType === 'import' && 'ring-2 ring-brand-500'
          )}
        >
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-accent-100 text-accent-700">
              <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 5v14M5 12h14" />
              </svg>
            </div>
            <h4 className="font-semibold mb-2">Importer un projet</h4>
            <p className="text-sm text-ink/70">
              Importez un DOCX, TXT ou PDF et continuez avec THOTH.
            </p>
          </div>
        </Card>
      </div>

      {projectType === 'import' && (
        <div className="mt-4 rounded-2xl border border-accent-200 bg-accent-50 p-4 text-sm text-accent-800">
          L'import de fichiers sera disponible apres avoir renseigne les details du projet.
        </div>
      )}
    </div>
  )

  const renderDetailsStep = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-center mb-6">Details du projet</h3>

      <Input
        label="Titre du projet *"
        value={formData.title}
        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
        placeholder="Ex: Le Seigneur des Anneaux"
        error={error && !formData.title.trim() ? error : undefined}
      />

      <Textarea
        label="Description"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        placeholder="Decrivez brievement votre histoire..."
        rows={4}
      />

      <Select
        label="Genre"
        value={formData.genre || ''}
        onChange={(e) => setFormData({ ...formData, genre: (e.target.value as Genre) || undefined })}
        options={GENRE_OPTIONS}
      />

    </div>
  )

  const renderStructureStep = () => (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-center mb-6">Structure narrative</h3>

      <p className="text-sm text-ink/70 text-center mb-4">
        Choisissez un modele de structure pour organiser votre recit. Vous pourrez le modifier plus tard.
      </p>

      <Select
        label="Modele de structure"
        value={formData.structure_template || ''}
        onChange={(e) => setFormData({ ...formData, structure_template: e.target.value })}
        options={STRUCTURE_OPTIONS}
      />

      {formData.structure_template && (
        <div className="mt-4 rounded-2xl border border-brand-200 bg-brand-50 p-4">
          <h4 className="font-semibold text-brand-900 mb-2">
            {STRUCTURE_OPTIONS.find((o) => o.value === formData.structure_template)?.label}
          </h4>
          <p className="text-sm text-brand-800">
            {formData.structure_template === '3-act' &&
              'Structure classique: mise en place, confrontation, resolution.'}
            {formData.structure_template === '5-act' &&
              'Structure en 5 actes popularisee par Shakespeare.'}
            {formData.structure_template === 'hero-journey' &&
              "Le monomythe de Campbell: appel, epreuves, transformation."}
            {formData.structure_template === 'save-the-cat' &&
              '15 points pour structurer votre scenario selon Blake Snyder.'}
            {formData.structure_template === 'seven-point' &&
              'Structure narrative en 7 points cles de Dan Wells.'}
          </p>
        </div>
      )}
    </div>
  )

  return (
    <Dialog open={open} onClose={handleClose} size="lg">
      <DialogHeader>
        <DialogTitle>Creer un nouveau projet</DialogTitle>
      </DialogHeader>

      <DialogContent>
        {renderStepIndicator()}

        {step === 'type' && renderTypeStep()}
        {step === 'details' && renderDetailsStep()}
        {step === 'structure' && renderStructureStep()}

        {error && step !== 'details' && (
          <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 p-3 text-sm text-red-700">
            {error}
          </div>
        )}

        <div className="mt-6 flex justify-between">
          <Button variant="ghost" onClick={step === 'type' ? handleClose : handleBack}>
            {step === 'type' ? 'Annuler' : 'Retour'}
          </Button>

          {step === 'structure' ? (
            <Button variant="primary" onClick={handleSubmit} isLoading={isLoading}>
              Creer le projet
            </Button>
          ) : (
            <Button variant="primary" onClick={handleNext}>
              Suivant
            </Button>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}
