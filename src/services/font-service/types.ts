export interface FontUsage {
  fontFamily: string
  primaryUsage: 'Heading' | 'Subheading' | 'Action' | 'Paragraph' | 'Regular'
}

export interface TextStyleOptions {
  fontFamily?: string
  fontSize?: string
  lineHeight?: string
  fontWeight?: string     
  letterSpacing?: string
}

export interface ElementSelectionPayload {
  selector: string
}

export interface FontState {
  usages: FontUsage[]
  googleFonts: string[]
  localFonts: string[]
}