'use client'

import { useState } from 'react'
import { LeadFormData } from '@/lib/types'
import MobileForm, { MobileInput, MobileTextarea, MobileButton } from './MobileForm'

interface LeadFormProps {
  propertyId?: number
  propertyTitle?: string
  onSuccess?: () => void
}

export default function LeadForm({ propertyId, propertyTitle, onSuccess }: LeadFormProps) {
  const [formData, setFormData] = useState<LeadFormData>({
    name: '',
    phone: '',
    email: '',
    message: '',
    propertyId,
  })
  const [loading, setLoading] = useState(false)
  const [success, setSuccess] = useState(false)
  const [error, setError] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Erro ao enviar mensagem')
      }

      setSuccess(true)
      setFormData({
        name: '',
        phone: '',
        email: '',
        message: '',
        propertyId,
      })

      setTimeout(() => {
        setSuccess(false)
        onSuccess?.()
      }, 3000)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  if (success) {
    return (
      <div className="mobile-card-md bg-green-50 border border-green-200 text-center">
        <p className="mobile-text-sm font-semibold text-green-700">Mensagem enviada com sucesso!</p>
        <p className="mobile-text-2xs text-green-600 mobile-mt-sm">
          Entraremos em contato em breve.
        </p>
      </div>
    )
  }

  return (
    <MobileForm onSubmit={handleSubmit}>
      {propertyTitle && (
        <div className="mobile-card-sm bg-brand-coral-light border border-brand-coral">
          <p className="mobile-text-2xs text-brand-coral-dark">
            Tenho interesse em: <strong>{propertyTitle}</strong>
          </p>
        </div>
      )}

      {error && (
        <div className="mobile-card-sm bg-red-50 border border-red-200">
          <p className="mobile-text-2xs text-red-700">{error}</p>
        </div>
      )}

      <MobileInput
        type="text"
        label="Nome"
        required
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        placeholder="Seu nome completo"
      />

      <MobileInput
        type="tel"
        label="Telefone"
        required
        value={formData.phone}
        onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
        placeholder="(00) 00000-0000"
      />

      <MobileInput
        type="email"
        label="Email"
        value={formData.email}
        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
        placeholder="seu@email.com"
      />

      <MobileTextarea
        label="Mensagem"
        value={formData.message}
        onChange={(e) => setFormData({ ...formData, message: e.target.value })}
        placeholder="Gostaria de mais informações sobre este imóvel..."
        rows={4}
      />

      <MobileButton
        type="submit"
        disabled={loading}
        loading={loading}
        size="lg"
        className="w-full"
      >
        {loading ? 'Enviando...' : 'Enviar Mensagem'}
      </MobileButton>
    </MobileForm>
  )
}

