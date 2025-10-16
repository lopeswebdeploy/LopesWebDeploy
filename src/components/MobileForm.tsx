'use client'

import { ReactNode } from 'react'

interface MobileFormProps {
  children: ReactNode
  onSubmit?: (e: React.FormEvent) => void
  className?: string
}

export default function MobileForm({ children, onSubmit, className = '' }: MobileFormProps) {
  return (
    <form 
      onSubmit={onSubmit}
      className={`mobile-space-y-md ${className}`}
    >
      {children}
    </form>
  )
}

interface MobileInputProps {
  type?: 'text' | 'email' | 'tel' | 'password' | 'number'
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  required?: boolean
  className?: string
  label?: string
  error?: string
}

export function MobileInput({ 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  required = false,
  className = '',
  label,
  error
}: MobileInputProps) {
  return (
    <div className="mobile-space-y-xs">
      {label && (
        <label className="mobile-text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-brand-coral ml-1">*</span>}
        </label>
      )}
      <input
        type={type}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        className={`mobile-input mobile-focus-ring ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
      />
      {error && (
        <p className="mobile-text-2xs text-red-500">{error}</p>
      )}
    </div>
  )
}

interface MobileTextareaProps {
  placeholder?: string
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void
  required?: boolean
  className?: string
  label?: string
  error?: string
  rows?: number
}

export function MobileTextarea({ 
  placeholder, 
  value, 
  onChange, 
  required = false,
  className = '',
  label,
  error,
  rows = 4
}: MobileTextareaProps) {
  return (
    <div className="mobile-space-y-xs">
      {label && (
        <label className="mobile-text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-brand-coral ml-1">*</span>}
        </label>
      )}
      <textarea
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        required={required}
        rows={rows}
        className={`mobile-input mobile-focus-ring resize-none ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
      />
      {error && (
        <p className="mobile-text-2xs text-red-500">{error}</p>
      )}
    </div>
  )
}

interface MobileSelectProps {
  options: { value: string; label: string }[]
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  required?: boolean
  className?: string
  label?: string
  error?: string
  placeholder?: string
}

export function MobileSelect({ 
  options, 
  value, 
  onChange, 
  required = false,
  className = '',
  label,
  error,
  placeholder
}: MobileSelectProps) {
  return (
    <div className="mobile-space-y-xs">
      {label && (
        <label className="mobile-text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-brand-coral ml-1">*</span>}
        </label>
      )}
      <select
        value={value}
        onChange={onChange}
        required={required}
        className={`mobile-input mobile-focus-ring ${error ? 'border-red-500 focus:ring-red-500' : ''} ${className}`}
      >
        {placeholder && (
          <option value="" disabled>
            {placeholder}
          </option>
        )}
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="mobile-text-2xs text-red-500">{error}</p>
      )}
    </div>
  )
}

interface MobileButtonProps {
  children: ReactNode
  type?: 'button' | 'submit' | 'reset'
  onClick?: () => void
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'xs' | 'sm' | 'md' | 'lg' | 'xl'
  disabled?: boolean
  loading?: boolean
  className?: string
}

export function MobileButton({ 
  children, 
  type = 'button', 
  onClick, 
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  className = ''
}: MobileButtonProps) {
  const baseClasses = 'mobile-touch-target mobile-focus-ring transition-all duration-300 font-medium'
  
  const variantClasses = {
    primary: 'bg-brand-coral text-white hover:bg-brand-coral-dark disabled:bg-gray-400',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700 disabled:bg-gray-400',
    outline: 'border-2 border-brand-coral text-brand-coral hover:bg-brand-coral hover:text-white disabled:border-gray-400 disabled:text-gray-400',
    ghost: 'text-brand-coral hover:bg-brand-coral/10 disabled:text-gray-400'
  }
  
  const sizeClasses = {
    xs: 'mobile-btn-xs',
    sm: 'mobile-btn-sm', 
    md: 'mobile-btn-md',
    lg: 'mobile-btn-lg',
    xl: 'mobile-btn-xl'
  }
  
  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {loading ? (
        <div className="flex items-center mobile-gap-xs">
          <div className="mobile-w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
          <span>Carregando...</span>
        </div>
      ) : (
        children
      )}
    </button>
  )
}

interface MobileCheckboxProps {
  checked?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  label?: string
  required?: boolean
  className?: string
  error?: string
}

export function MobileCheckbox({ 
  checked, 
  onChange, 
  label, 
  required = false,
  className = '',
  error
}: MobileCheckboxProps) {
  return (
    <div className={`mobile-space-y-xs ${className}`}>
      <label className="flex items-start mobile-gap-sm cursor-pointer">
        <input
          type="checkbox"
          checked={checked}
          onChange={onChange}
          required={required}
          className="mobile-w-4 h-4 text-brand-coral border-gray-300 rounded focus:ring-brand-coral mobile-focus-ring"
        />
        <span className="mobile-text-sm text-gray-700">
          {label}
          {required && <span className="text-brand-coral ml-1">*</span>}
        </span>
      </label>
      {error && (
        <p className="mobile-text-2xs text-red-500">{error}</p>
      )}
    </div>
  )
}

interface MobileRadioGroupProps {
  options: { value: string; label: string }[]
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  name: string
  required?: boolean
  className?: string
  label?: string
  error?: string
}

export function MobileRadioGroup({ 
  options, 
  value, 
  onChange, 
  name,
  required = false,
  className = '',
  label,
  error
}: MobileRadioGroupProps) {
  return (
    <div className={`mobile-space-y-sm ${className}`}>
      {label && (
        <label className="mobile-text-sm font-medium text-gray-700">
          {label}
          {required && <span className="text-brand-coral ml-1">*</span>}
        </label>
      )}
      <div className="mobile-space-y-xs">
        {options.map((option) => (
          <label key={option.value} className="flex items-center mobile-gap-sm cursor-pointer">
            <input
              type="radio"
              name={name}
              value={option.value}
              checked={value === option.value}
              onChange={onChange}
              required={required}
              className="mobile-w-4 h-4 text-brand-coral border-gray-300 focus:ring-brand-coral mobile-focus-ring"
            />
            <span className="mobile-text-sm text-gray-700">{option.label}</span>
          </label>
        ))}
      </div>
      {error && (
        <p className="mobile-text-2xs text-red-500">{error}</p>
      )}
    </div>
  )
}
