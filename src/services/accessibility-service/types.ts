import type { ImpactValue as AxeImpact } from 'axe-core'

export type ImpactValue = AxeImpact

export interface ContrastFailColors {
  fg: string
  bg: string
  ratio: string
}

export interface AccessibilityIssue {
  index: number
  id: string
  impact?: ImpactValue
  description: string
  help: string
  helpUrl: string
  tags: string[]
  targets: string[]
  category: 'contrast' | 'critical' | 'alert' | 'structure' | 'aria' | 'other'
  failColors?: ContrastFailColors
}

export interface AccessibilitySummary {
  totalViolations: number
  totalIssues: number
  contrastIssues: number
  criticalIssues: number
  alertIssues: number
  structuralIssues: number
  ariaIssues: number
  otherIssues: number
}

export interface AccessibilityState {
  issues: AccessibilityIssue[]
  summary: AccessibilitySummary | null
}
