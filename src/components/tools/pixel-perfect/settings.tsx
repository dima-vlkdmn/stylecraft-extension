import React, { useCallback } from 'react'
import styled from 'styled-components'
import { PrimaryButton } from '../../ui/buttons/primary-button'

export type SettingField = {
  key: string
  type: 'color' | 'range' | 'checkbox' | 'number' | 'select'
  label: string
  value: any
  props?: Record<string, any>
  onChange: (value: any) => void
}

interface ToolSettingsPanelProps {
  title: string
  status: boolean
  fields: SettingField[]
  toggleLabel?: { on: string; off: string }
  onToggle?: () => void
}

export const ToolSettingsPanel: React.FC<ToolSettingsPanelProps> = React.memo(({
  title,
  status,
  toggleLabel,
  onToggle,
  fields,
}) => {
  const renderField = useCallback((field: SettingField) => {
    switch (field.type) {
      case 'color':
        return (
          <InputGroup>
            <Label htmlFor={field.key}>{field.label}:</Label>
            <input
              id={field.key}
              type="color"
              value={field.value}
              onChange={e => field.onChange(e.target.value)}
            />
          </InputGroup>
        )

      case 'range':
        return (
          <InputGroup>
            <Label htmlFor={field.key}>{field.label}:</Label>
            <input
              id={field.key}
              type="range"
              value={field.value}
              onChange={e => field.onChange(e.target.value)}
              {...field.props}
            />
            <ValueDisplay>
              {typeof field.value === 'number'
                ? Math.round(field.value * 100) + '%'
                : field.value}
            </ValueDisplay>
          </InputGroup>
        )

      case 'checkbox':
        return (
          <CheckboxGroup>
            <input
              id={field.key}
              type="checkbox"
              checked={field.value}
              onChange={e => field.onChange(e.target.checked)}
            />
            <Label htmlFor={field.key}>{field.label}</Label>
          </CheckboxGroup>
        )

      case 'number':
        return (
          <InputGroup>
            <Label htmlFor={field.key}>{field.label}:</Label>
            <input
              id={field.key}
              type="number"
              value={field.value}
              onChange={e => field.onChange(+e.target.value)}
              {...field.props}
            />
          </InputGroup>
        )

      case 'select':
        return (
          <InputGroup>
            <Label htmlFor={field.key}>{field.label}:</Label>
            <select
              id={field.key}
              value={field.value}
              onChange={e => field.onChange(e.target.value)}
              {...field.props}
            >
              {field.props?.options?.map((opt: any) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </InputGroup>
        )

      default:
        return null
    }
  }, [])

  return (
    <Container>
      <SectionTitle>{title}</SectionTitle>
      <StatusRow>Status: <StatusDot active={status} /> {status ? 'Active' : 'Inactive'}</StatusRow>

      {toggleLabel && onToggle && (
        <PrimaryButton onClick={onToggle}>
          {status ? toggleLabel.on : toggleLabel.off}
        </PrimaryButton>
      )}

      {fields.map(field => (
        <FieldWrapper key={field.key}>
          {renderField(field)}
        </FieldWrapper>
      ))}
    </Container>
  )
})

const Container = styled.div`
  padding: 0.5rem 0;
`

const SectionTitle = styled.h3`
  font-size: 1rem;
  margin-bottom: 0.5rem;
`

const StatusRow = styled.div`
  display: flex;
  align-items: center;
  margin-bottom: 0.75rem;
  font-weight: 500;
`

const StatusDot = styled.span<{ active: boolean }>`
  width: 0.6rem;
  height: 0.6rem;
  background: ${({ active }) => (active ? '#28a745' : '#dc3545')};
  border-radius: 50%;
  display: inline-block;
  margin: 0 0.5rem 0 0.25rem;
`

const FieldWrapper = styled.div`
  margin-bottom: 0.75rem;
`

const InputGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;

  input[type='color'],
  input[type='range'],
  input[type='number'],
  select {
    flex-shrink: 0;
  }
`

const CheckboxGroup = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
`

const Label = styled.label`
  font-size: 0.875rem;
`

const ValueDisplay = styled.span`
  font-size: 0.875rem;
  min-width: 2.5rem;
  text-align: right;
`
