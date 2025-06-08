import { LocalWing } from '@/lib/chrome-wings'
import { useWing } from '@/lib/react-wings'
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
  uploadLocalFonts,
  applyCategoryStyles 
} from '@/src/logic/font-logic'

export class FontLocalService extends LocalWing<FontState> {
  constructor() {
    super('FontService', { usages: [], googleFonts: [], localFonts: [] })
    this.actions = {
      scanFonts:               this.scanFonts.bind(this),
      clearFonts:              this.clearFonts.bind(this),
      loadGoogleFonts:         this.loadGoogleFonts.bind(this),
      getAvailableGoogleFonts: this.getAvailableGoogleFonts.bind(this),
      initLocalFontLoader:     this.initLocalFontLoader.bind(this),
      getLocalFonts:           this.getLocalFonts.bind(this),
      uploadLocalFonts:        this.uploadLocalFonts.bind(this),
      captureSelection:        this.captureSelection.bind(this),
      applyTextStyle:          this.applyTextStyle.bind(this),
      loadGoogleFontCSS:       this.loadGoogleFontCSS.bind(this),
      selectElement:           this.selectElement.bind(this),
      applyElementStyle:       this.applyElementStyle.bind(this),
      annotateWithPanel:       this.annotateWithPanel.bind(this),
      applyCategoryStyles:     this.applyCategoryStyles.bind(this)
    }
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

  public uploadLocalFonts(files: { name: string; buffer: ArrayBuffer }[]): void {
    uploadLocalFonts(files)
  }
  public applyCategoryStyles(
    settings: Record<FontUsage['primaryUsage'], {
      fontFamily: string
      fontSize: number
      lineHeight: number
      fontWeight: string
      letterSpacing: number
    }>
  ): void {
    applyCategoryStyles(settings)
  }
}

export const fontLocalService = new FontLocalService()
export const useFontService = useWing
