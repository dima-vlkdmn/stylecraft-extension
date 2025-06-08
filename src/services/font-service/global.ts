import { GlobalWing } from '@/lib/chrome-wings'
import type { FontState, FontUsage, TextStyleOptions, ElementSelectionPayload } from './types'
import {
  runFontScan,
  loadGoogleFonts,
  getAvailableGoogleFonts,
  getLocalFonts,
  initCustomFontLoader,
  captureSelection,
  applyTextStyle,
  loadGoogleFontCSS,
  selectElement,
  applyElementStyle,
  annotatePageWithIcons,
} from '@/src/logic/font-logic'

export class FontGlobalService extends GlobalWing<FontState> {
  constructor() {
    super('FontService', { usages: [], googleFonts: [], localFonts: [] })
  }

  public async scanFonts(): Promise<FontUsage[]> {
    const usages = await runFontScan()
    this.setState({ usages })
    return usages
  }

  public clearFonts(): void {
    this.setState({ usages: [] })
  }

  public async loadGoogleFonts(): Promise<string[]> {
    const googleFonts = await loadGoogleFonts()
    this.setState({ googleFonts })
    return googleFonts
  }

  public getAvailableGoogleFonts(): string[] {
    return getAvailableGoogleFonts()
  }

  public initLocalFontLoader(): void {
    initCustomFontLoader()
  }

  public getLocalFonts(): string[] {
    const localFonts = getLocalFonts()
    this.setState({ localFonts })
    return localFonts
  }

  public captureSelection(): void {
    captureSelection()
  }

  public applyTextStyle(opts: TextStyleOptions): void {
    applyTextStyle(opts)
  }

  public loadGoogleFontCSS(fontFamily: string, weights?: string, display?: 'swap'|'block'|'fallback'|'optional'): void {
    loadGoogleFontCSS(fontFamily, weights, display)
  }

  public selectElement(payload: ElementSelectionPayload): void {
    const element = document.querySelector<HTMLElement>(payload.selector)
    if (element) selectElement(element)
  }

  public applyElementStyle(opts: TextStyleOptions): void {
    applyElementStyle(opts)
  }

  public annotateWithPanel(): void {
    void annotatePageWithIcons()
  }
}

export const fontGlobalService = new FontGlobalService()