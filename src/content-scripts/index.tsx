import React, { useEffect } from 'react'
import { createRoot } from 'react-dom/client'
import { useWing } from '@/lib/react-wings'
import { Payload } from '@/lib/chrome-pulse'

import { pixelPerfectLocalService }    from '@/src/services/pixel-perfect-service/local'
import { paletteLocalService }         from '@/src/services/palette-service/local'
import { colorPickerLocalService }     from '@/src/services/color-picker-service/local'
import { elementPickerLocalService }   from '@/src/services/element-picker-service/local'
import { cssSelectorLocalService }     from '@/src/services/css-selector-service/local'
import { fontLocalService }            from '@/src/services/font-service/local'
import { optimizeLocalService }        from '@/src/services/optimize-service/local'
import { gifRecorderLocalService }     from '@/src/services/gif-recorder/local'
import { AccessibilityLocalService }   from '@/src/services/accessibility-service/local'
import { seoAnalyzerLocalService }     from '@/src/services/seo-analyzer/local'

import { LocalPulse } from '@/lib/chrome-pulse'
import type {
  GridSettings,
  MaskSettings,
  PointsSettings,
  ShapeSettings
} from '@/src/services/pixel-perfect-service/types'
import type {
  AccessibilityIssue,
  AccessibilitySummary
} from '@/src/services/accessibility-service/types'
import {
  highlightElements,
  removeAllHighlights,
} from '@/src/logic/css-selector'
import type {
  TextStyleOptions,
  ElementSelectionPayload
} from '@/src/services/font-service/types'

console.log('[ContentScript] Initializing LocalPulse for App, Palette, PixelPerfect & Accessibility')

const appPulse = new LocalPulse('App', {
  getPixelPerfectState:  () => pixelPerfectLocalService.getState(),
  getPaletteState:       () => paletteLocalService.getState(),
  getColorPickerState:   () => colorPickerLocalService.getState(),
  getElementPickerState: () => elementPickerLocalService.getState(),
  getCssSelectorState:   () => cssSelectorLocalService.getState(),
  getFontState:          () => fontLocalService.getState(),
  getOptimizeState:      () => optimizeLocalService.getState(),
  getGifRecorderState:   () => gifRecorderLocalService.getState(),
  getAccessibilityState: () => AccessibilityLocalService.getState(),
  getSeoState:           () => seoAnalyzerLocalService.getState(),
})

export const fontPulse = new LocalPulse('FontService', {

  async scanFonts(_payload: Payload) {
    console.log('[ContentScript][FontService] scanFonts')
    return fontLocalService.scanFonts()
  },

  clearFonts(_payload: Payload) {
    console.log('[ContentScript][FontService] clearFonts')
    fontLocalService.clearFonts()
    return null
  },

  async loadGoogleFonts(_payload: Payload) {
    console.log('[ContentScript][FontService] loadGoogleFonts')
    return fontLocalService.loadGoogleFonts()
  },

  getAvailableGoogleFonts(_payload: Payload) {
    console.log('[ContentScript][FontService] getAvailableGoogleFonts')
    return fontLocalService.getAvailableGoogleFonts()
  },

  initLocalFontLoader(_payload: Payload) {
    console.log('[ContentScript][FontService] initLocalFontLoader')
    fontLocalService.initLocalFontLoader()
    return null
  },

  getLocalFonts(_payload: Payload) {
    console.log('[ContentScript][FontService] getLocalFonts')
    return fontLocalService.getLocalFonts()
  },

  async uploadLocalFonts(payload: any) {
    console.log('[ContentScript][FontService] uploadLocalFonts', payload.files)
    fontLocalService.uploadLocalFonts(payload.files)
    return null
  },

  captureSelection(_payload: Payload) {
    console.log('[ContentScript][FontService] captureSelection')
    fontLocalService.captureSelection()
    return null
  },

  applyTextStyle(payload: any) {
    console.log('[ContentScript][FontService] applyTextStyle', payload)
    fontLocalService.applyTextStyle(payload as TextStyleOptions)
    return null
  },

  selectElement(payload: any) {
    console.log('[ContentScript][FontService] selectElement', payload.selector)
    fontLocalService.selectElement(payload as ElementSelectionPayload)
    return null
  },

  applyElementStyle(payload: any) {
    console.log('[ContentScript][FontService] applyElementStyle', payload)
    fontLocalService.applyElementStyle(payload as TextStyleOptions)
    return null
  },

  applyCategoryStyles(payload: any) {
    console.log('[ContentScript][FontService] applyCategoryStyles', payload)
    fontLocalService.applyCategoryStyles(payload)
    return null
  },

  annotatePageWithIcons(_payload: Payload) {
    console.log('[ContentScript][FontService] annotatePageWithIcons')
    fontLocalService.annotateWithPanel()
    return null
  },
})

const palettePulse = new LocalPulse('Palette', {

  async scanPalette() {
    console.log('[ContentScript][Palette] scanPalette')
    return paletteLocalService.scanPalette()
  },

  clearPalette() {
    console.log('[ContentScript][Palette] clearPalette')
    paletteLocalService.clearPalette()
    return null
  },
})

const colorPickerPulse = new LocalPulse('ColorPicker', {

  async pickColor() {
    console.log('[ContentScript][ColorPicker] pickColor');
    return colorPickerLocalService.pickColor();
  },

  cancelPicking() {
    console.log('[ContentScript][ColorPicker] cancelPicking');
    return colorPickerLocalService.cancelPicking();
  },
});

const pixelPulse = new LocalPulse('PixelPerfect', {
  activateRuler:       () => pixelPerfectLocalService.activateRuler(),
  deactivateRuler:     () => pixelPerfectLocalService.deactivateRuler(),
  updateRulerSettings: payload => pixelPerfectLocalService.updateRulerSettings(payload ?? {}),
  clearMeasurements:   () => pixelPerfectLocalService.clearMeasurements(),

  activateGrid:        () => pixelPerfectLocalService.activateGrid(),
  deactivateGrid:      () => pixelPerfectLocalService.deactivateGrid(),
  updateGridSettings:  payload => pixelPerfectLocalService.updateGridSettings((payload ?? {}) as Partial<GridSettings>),

   // MASK
   startMaskMode: payload => {
    const { color, opacity, keepSelection } = payload as MaskSettings;
    return pixelPerfectLocalService.startMaskMode({ color, opacity, keepSelection });
  },
  stopMaskMode: () => pixelPerfectLocalService.stopMaskMode(),

  // POINTS
  startPointsMode: payload => {
    const { pointRadius } = payload as PointsSettings;
    return pixelPerfectLocalService.startPointsMode({ pointRadius });
  },
  stopPointsMode: () => pixelPerfectLocalService.stopPointsMode(),
  updatePointsSettings: payload => {
    const { pointRadius } = payload as PointsSettings;
    return pixelPerfectLocalService.updatePointsSettings({ pointRadius });
  },

  // SHAPE
startShapeMode: payload => {
  const {
    color,
    opacity,
    mode,
    symmetric,     
    cornerRadius   
  } = payload as ShapeSettings;
  return pixelPerfectLocalService.startShapeMode({
    color,
    opacity,
    mode,
    symmetric,
    cornerRadius
  });
},
stopShapeMode: () => pixelPerfectLocalService.stopShapeMode(),
updateShapeSettings: payload => {
  const {
    color,
    opacity,
    mode,
    symmetric,    
    cornerRadius   
  } = payload as ShapeSettings;
  return pixelPerfectLocalService.updateShapeSettings({
    color,
    opacity,
    mode,
    symmetric,
    cornerRadius
  });
},
});

const accessibilityPulse = new LocalPulse('Accessibility', {

  async audit(_payload: Payload) {
    console.log('[ContentScript][Accessibility] audit')
    return AccessibilityLocalService.audit()
  },

  highlightCurrentIssues(payload: Payload) {
    const { issues } = payload as { issues: AccessibilityIssue[] }
    console.log('[ContentScript][Accessibility] highlightCurrentIssues', issues)
    AccessibilityLocalService.highlightCurrentIssues()
    return null
  },

  clearIssueHighlights(_payload: Payload) {
    console.log('[ContentScript][Accessibility] clearIssueHighlights')
    AccessibilityLocalService.clearIssueHighlights()
    return null
  },

  scrollTo(payload: Payload) {
    const { index } = payload as { index: number }
    console.log('[ContentScript][Accessibility] scrollTo', index)
    AccessibilityLocalService.scrollTo(index)
    return null
  },
})

const cssPulse = new LocalPulse('CssSelector', {

  async startSelection() {
    console.log('[ContentScript][CssSelector] startSelection')
    return cssSelectorLocalService.startSelection()
  },

  stopSelection() {
    console.log('[ContentScript][CssSelector] stopSelection')
    return cssSelectorLocalService.stopSelection()
  },

  getSelected() {
    console.log('[ContentScript][CssSelector] getSelected')
    return cssSelectorLocalService.getState().selectedSelector
  },

  highlightElements(payload) {
    const { selector } = payload as { selector: string }
    console.log('[ContentScript][CssSelector] highlightElements', selector)
    return highlightElements(selector)
  },

  removeHighlights() {
    console.log('[ContentScript][CssSelector] removeHighlights')
    removeAllHighlights()
    return null
  },
})


const optimizePulse = new LocalPulse('Optimize', {

  async audit() {
    await optimizeLocalService.audit()
    const { summary, largeImages, recommendations } = optimizeLocalService.getState()
    return { summary: summary!, largeImages, recommendations }
  },

  showOverlays() {
    optimizeLocalService.showOverlays()
    return null
  },

  clearOverlays() {
    optimizeLocalService.clearOverlays()
    return null
  },

  scrollTo(payload) {
    const { index } = payload as { index: number }
    optimizeLocalService.scrollTo(index)
    return null
  },

  compressAll() {
    return optimizeLocalService.compressAll()
  },
})


const elementPulse = new LocalPulse('ElementPicker', {

  async startSelection() {
    console.log('[ContentScript][ElementPicker] startSelection')
    return elementPickerLocalService.startSelection()
  },

  stopSelection() {
    console.log('[ContentScript][ElementPicker] stopSelection')
    return elementPickerLocalService.stopSelection()
  },

  getSelectedElement() {
    console.log('[ContentScript][ElementPicker] getSelectedElement')
    const { selectedHtml, selectedCss } = elementPickerLocalService.getState()
    return {
      html: selectedHtml ?? '',
      css:  selectedCss  ?? '',
    }
  },
})

const seoPulse = new LocalPulse('SeoAnalyzer', {
  async analyzeSite() {
    console.log('[ContentScript][SeoAnalyzer] analyzeSite')
    return seoAnalyzerLocalService.analyzeSite()
  },
  clearResult() {
    console.log('[ContentScript][SeoAnalyzer] clearResult')
    return seoAnalyzerLocalService.clearResult()
  },
})

const ContentApp: React.FC = () => {
  void useWing(pixelPerfectLocalService)
  void useWing(paletteLocalService)
  void useWing(colorPickerLocalService)
  void useWing(elementPickerLocalService)
  void useWing(cssSelectorLocalService)
  void useWing(fontLocalService)
  void useWing(optimizeLocalService)
  void useWing(gifRecorderLocalService)
  void useWing(AccessibilityLocalService)
  void useWing(seoAnalyzerLocalService)

  useEffect(() => {
    console.log('[ContentScript] startListening all pulses')
    appPulse.startListening()
    fontPulse.startListening()
    palettePulse.startListening()
    pixelPulse.startListening()
    accessibilityPulse.startListening()
    colorPickerPulse.startListening()
    cssPulse.startListening()
    elementPulse.startListening()
    seoPulse.startListening()
    optimizePulse.startListening()
  }, [])

  return null
}

if (!window.location.href.includes('side-panel.html')) {
  document.addEventListener('DOMContentLoaded', () => {
    console.log('[ContentScript] mounting ContentApp')
    const mount = document.createElement('div')
    document.body.appendChild(mount)
    createRoot(mount).render(<ContentApp />)
  })
}
