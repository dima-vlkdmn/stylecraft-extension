import { Tabs }                         from '@lib/chrome-api/tabs'
import { GlobalPulse }                  from '@/lib/chrome-pulse'
import type { Payload }                 from '@/lib/chrome-pulse'
import { BaseBackgroundPage }           from '@/src/pages/base-background-page'
import { ContextMenu }                  from '@/lib/chrome-api/context-menu'
import { SidePanel }                    from '@/lib/chrome-api/side-panel'
import { MenuId, MenuName }             from '@/src/data/context-menu'
import { createDocument, hasDocument }  from './chrome-offscreen-wrapper'
import type {
  AccessibilityIssue,
  AccessibilitySummary
} from '@/src/services/accessibility-service/types'
import type { PickedColor } from '@/src/services/color-picker-service/types'
import { SeoAnalysisResult } from '@/src/services/seo-analyzer/types'
import type {
  FontUsage,
  TextStyleOptions,
  ElementSelectionPayload
} from '@/src/services/font-service/types'
import type { OptimizeSummary, LargeImage } from '@/src/services/optimize-service/types'

export async function ensureOffscreenDocument() {
  if (!(await hasDocument())) {
    await createDocument({
      url: 'offscreen/offscreen.html',
      reasons: ['DISPLAY_MEDIA'],
      justification: 'GIF recording',
    })
  }
}

async function forward<T>(
  tabId: number,
  category: string,
  action: string,
  payload: any
): Promise<T> {
  console.log(`[Background] forward ${category}.${action} → tab ${tabId}`, payload)
  return Tabs.sendMessageToTab<T>(tabId, { category, action, payload })
}

new GlobalPulse('FontService', {

  async scanFonts(payload: any, _sender: any, _sendResponse: any) {
    const { tabId } = payload as { tabId?: number }
    if (!tabId) throw new Error('Missing tabId')
    console.log('[Background][FontService] scanFonts for tab', tabId)
    return forward<FontUsage[]>(tabId, 'FontService', 'scanFonts', {})
  },

  clearFonts(payload: any, _sender: any, _sendResponse: any) {
    const { tabId } = payload as { tabId?: number }
    if (!tabId) throw new Error('Missing tabId')
    console.log('[Background][FontService] clearFonts for tab', tabId)
    void forward<void>(tabId, 'FontService', 'clearFonts', {})
    return null
  },

  async loadGoogleFonts(payload: any, _sender: any, _sendResponse: any) {
    const { tabId } = payload as { tabId?: number }
    if (!tabId) throw new Error('Missing tabId')
    console.log('[Background][FontService] loadGoogleFonts for tab', tabId)
    return forward<string[]>(tabId, 'FontService', 'loadGoogleFonts', {})
  },

  async getAvailableGoogleFonts(payload: any, _sender: any, _sendResponse: any) {
    const { tabId } = payload as { tabId?: number }
    if (!tabId) throw new Error('Missing tabId')
    console.log('[Background][FontService] getAvailableGoogleFonts for tab', tabId)
    return forward<string[]>(tabId, 'FontService', 'getAvailableGoogleFonts', {})
  },

  initLocalFontLoader(payload: any, _sender: any, _sendResponse: any) {
    const { tabId } = payload as { tabId?: number }
    if (!tabId) throw new Error('Missing tabId')
    console.log('[Background][FontService] initLocalFontLoader for tab', tabId)
    void forward<void>(tabId, 'FontService', 'initLocalFontLoader', {})
    return null
  },

  async getLocalFonts(payload: any, _sender: any, _sendResponse: any) {
    const { tabId } = payload as { tabId?: number }
    if (!tabId) throw new Error('Missing tabId')
    console.log('[Background][FontService] getLocalFonts for tab', tabId)
    return forward<string[]>(tabId, 'FontService', 'getLocalFonts', {})
  },

  async uploadLocalFonts(payload: any, _sender: any, _sendResponse: any) {
    const { tabId, files } = payload as { tabId?: number; files: Array<{ name: string; buffer: ArrayBuffer }> }
    if (!tabId) throw new Error('Missing tabId')
    console.log('[Background][FontService] uploadLocalFonts for tab', tabId, files)
    return forward<void>(tabId, 'FontService', 'uploadLocalFonts', { files })
  },

  captureSelection(payload: any, _sender: any, _sendResponse: any) {
    const { tabId } = payload as { tabId?: number }
    if (!tabId) throw new Error('Missing tabId')
    console.log('[Background][FontService] captureSelection for tab', tabId)
    void forward<void>(tabId, 'FontService', 'captureSelection', {})
    return null
  },

  applyTextStyle(payload: any, _sender: any, _sendResponse: any) {
    const { tabId, ...opts } = payload as { tabId?: number } & TextStyleOptions
    if (!tabId) throw new Error('Missing tabId')
    console.log('[Background][FontService] applyTextStyle for tab', tabId, opts)
    void forward<void>(tabId, 'FontService', 'applyTextStyle', opts)
    return null
  },

  selectElement(payload: any) {
    const { tabId, selector } = payload as { tabId: number; selector: string }
    console.log('[Background][FontService] selectElement →', selector)
    return forward<void>(tabId, 'FontService', 'selectElement', { selector })
  },
  
  applyElementStyle(payload: any, _sender: any, _sendResponse: any) {
    const { tabId, ...opts } = payload as { tabId?: number } & TextStyleOptions
    if (!tabId) throw new Error('Missing tabId')
    console.log('[Background][FontService] applyElementStyle for tab', tabId, opts)
    return forward<void>(tabId, 'FontService', 'applyElementStyle', opts)
  },

  async applyCategoryStyles(payload: any, _sender: any, _sendResponse: any) {
    const { tabId, settings } = payload as { tabId: number; settings: Record<string, any> }
    if (!tabId) throw new Error('Missing tabId')
    console.log('[Background][FontService] applyCategoryStyles for tab', tabId, settings)
    return forward<void>(tabId, 'FontService', 'applyCategoryStyles', settings)
  },

  annotatePageWithIcons(payload: any, _sender: any, _sendResponse: any) {
    const { tabId } = payload as { tabId: number }
    if (!tabId) throw new Error('Missing tabId')
    console.log('[Background][FontService] annotatePageWithIcons for tab', tabId)
    void forward<void>(tabId, 'FontService', 'annotatePageWithIcons', {})
    return null
  },
})

new GlobalPulse('Palette', {
  async scanPalette(payload: Payload) {
    const { tabId } = payload as { tabId?: number }
    if (!tabId) throw new Error('Missing tabId')
    console.log('[Background][Palette] scanPalette for tab', tabId)
    const colors = await forward<string[]>(tabId, 'Palette', 'scanPalette', {})
    console.log('[Background][Palette] got palette:', colors)
    return colors
  },

  clearPalette(payload: Payload) {
    const { tabId } = payload as { tabId?: number }
    if (!tabId) throw new Error('Missing tabId')
    console.log('[Background][Palette] clearPalette for tab', tabId)
    void forward<void>(tabId, 'Palette', 'clearPalette', {})
    return null
  },
})

new GlobalPulse('ColorPicker', {

  async captureTab(_payload: Payload): Promise<{ dataUrl: string }> {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      chrome.tabs.captureVisibleTab({ format: 'png' }, url => {
        if (chrome.runtime.lastError || !url) reject(chrome.runtime.lastError);
        else resolve(url);
      });
    });
    return { dataUrl };
  },

  async pickColor(payload: Payload): Promise<PickedColor> {
    const tabId = (payload as any).tabId as number | undefined;
    if (!tabId) throw new Error('Missing tabId');
    console.log('[Background][ColorPicker] pickColor → tab', tabId);
    return forward<PickedColor>(tabId, 'ColorPicker', 'pickColor', {});
  },

  cancelPicking(payload: Payload): null {
    const tabId = (payload as any).tabId as number | undefined;
    if (!tabId) throw new Error('Missing tabId');
    console.log('[Background][ColorPicker] cancelPicking → tab', tabId);
    void forward<void>(tabId, 'ColorPicker', 'cancelPicking', {});
    return null;
  },
});

new GlobalPulse('PixelPerfect', {
  // RULER
  async activateRuler(payload: Payload) {
    const { tabId } = payload as { tabId?: number }
    if (!tabId) throw new Error('Missing tabId')
    await forward<void>(tabId, 'PixelPerfect', 'activateRuler', {})
    return null
  },
  async deactivateRuler(payload: Payload) {
    const { tabId } = payload as { tabId?: number }
    if (!tabId) throw new Error('Missing tabId')
    await forward<void>(tabId, 'PixelPerfect', 'deactivateRuler', {})
    return null
  },
  async updateRulerSettings(payload: Payload) {
    const { tabId, ...settings } = payload as any
    if (!tabId) throw new Error('Missing tabId')
    await forward<void>(tabId, 'PixelPerfect', 'updateRulerSettings', settings)
    return null
  },
  async clearMeasurements(payload: Payload) {
    const { tabId } = payload as { tabId?: number }
    if (!tabId) throw new Error('Missing tabId')
    await forward<void>(tabId, 'PixelPerfect', 'clearMeasurements', {})
    return null
  },

  // GRID
  async activateGrid(payload: Payload) {
    const { tabId } = payload as { tabId?: number }
    if (!tabId) throw new Error('Missing tabId')
    await forward<void>(tabId, 'PixelPerfect', 'activateGrid', {})
    return null
  },
  async deactivateGrid(payload: Payload) {
    const { tabId } = payload as { tabId?: number }
    if (!tabId) throw new Error('Missing tabId')
    await forward<void>(tabId, 'PixelPerfect', 'deactivateGrid', {})
    return null
  },
  async updateGridSettings(payload: Payload) {
    const { tabId, ...settings } = payload as any
    if (!tabId) throw new Error('Missing tabId')
    await forward<void>(tabId, 'PixelPerfect', 'updateGridSettings', settings)
    return null
  },

   // MASK
   async startMaskMode(payload: Payload) {
    const { tabId, ...opts } = payload as any;
    if (!tabId) throw new Error('Missing tabId');
    await forward<void>(tabId, 'PixelPerfect', 'startMaskMode', opts);
    return null;
  },
  async stopMaskMode(payload: Payload) {
    const { tabId } = payload as { tabId?: number };
    if (!tabId) throw new Error('Missing tabId');
    await forward<void>(tabId, 'PixelPerfect', 'stopMaskMode', {});
    return null;
  },

  // POINTS
  async startPointsMode(payload: Payload) {
    const { tabId, pointRadius } = payload as {
      tabId?: number;
      pointRadius?: number;
    };
    if (!tabId) throw new Error('Missing tabId');
    await forward<void>(
      tabId,
      'PixelPerfect',
      'startPointsMode',
      { pointRadius: pointRadius ?? 4 }
    );
    return null;
  },
  async stopPointsMode(payload: Payload) {
    const { tabId } = payload as { tabId?: number };
    if (!tabId) throw new Error('Missing tabId');
    await forward<void>(tabId, 'PixelPerfect', 'stopPointsMode', {});
    return null;
  },
  async updatePointsSettings(payload: Payload) {
    const { tabId, pointRadius } = payload as {
      tabId?: number;
      pointRadius?: number;
    };
    if (!tabId) throw new Error('Missing tabId');
    await forward<void>(
      tabId,
      'PixelPerfect',
      'updatePointsSettings',
      { pointRadius: pointRadius ?? 4 }
    );
    return null;
  },

  // SHAPE
  async startShapeMode({ tabId, color, opacity, mode, symmetric, cornerRadius }: any) {
    await forward(tabId, 'PixelPerfect','startShapeMode',{ color, opacity, mode, symmetric, cornerRadius });
    return null;
  },
  async updateShapeSettings({ tabId, color, opacity, mode, symmetric, cornerRadius }: any) {
    await forward(tabId,'PixelPerfect','updateShapeSettings',{ color,opacity,mode,symmetric,cornerRadius });
    return null;
  }
});

new GlobalPulse('Accessibility', {

  async audit(payload: Payload) {
    const { tabId } = payload as { tabId?: number }
    if (!tabId) throw new Error('Missing tabId')
    const result = await forward<{
      issues: AccessibilityIssue[]
      summary: AccessibilitySummary
    }>(tabId, 'Accessibility', 'audit', {})
    return result
  },

  highlightCurrentIssues(payload: Payload) {
    const { tabId, issues } = payload as { tabId?: number, issues: AccessibilityIssue[] }
    if (!tabId) throw new Error('Missing tabId')
    void forward<void>(tabId, 'Accessibility', 'highlightCurrentIssues', { issues })
    return null
  },

  clearIssueHighlights(payload: Payload) {
    const { tabId } = payload as { tabId?: number }
    if (!tabId) throw new Error('Missing tabId')
    void forward<void>(tabId, 'Accessibility', 'clearIssueHighlights', {})
    return null
  },

  scrollTo(payload: Payload) {
    const { tabId, index } = payload as { tabId?: number, index: number }
    if (!tabId) throw new Error('Missing tabId')
    void forward<void>(tabId, 'Accessibility', 'scrollTo', { index })
    return null
  },
})

new GlobalPulse('CssSelector', {

  async startSelection(payload: Payload) {
    const { tabId } = payload as { tabId?: number }
    if (!tabId) throw new Error('Missing tabId')
    console.log('[Background][CssSelector] startSelection for tab', tabId)
    const selector = await forward<string>(
      tabId,
      'CssSelector',
      'startSelection',
      {}
    )
    console.log('[Background][CssSelector] got selector:', selector)
    return { selector }
  },

  stopSelection(payload: Payload) {
    const { tabId } = payload as { tabId?: number }
    if (!tabId) throw new Error('Missing tabId')
    console.log('[Background][CssSelector] stopSelection for tab', tabId)
    void forward<void>(
      tabId,
      'CssSelector',
      'stopSelection',
      {}
    )
    return null
  },

  async generateSelector(payload: Payload) {
    const { tabId } = payload as { tabId?: number }
    if (!tabId) throw new Error('Missing tabId')
    console.log('[Background][CssSelector] generateSelector for tab', tabId)
    const selector = await forward<string>(
      tabId,
      'CssSelector',
      'getSelected',
      {}
    )
    console.log('[Background][CssSelector] got selector:', selector)
    return { selector }
  },

  async highlightElements(payload: Payload) {
    const { tabId, selector } = payload as {
      tabId?: number
      selector: string
    }
    if (!tabId) throw new Error('Missing tabId')
    console.log('[Background][CssSelector] highlightElements →', selector)
    const count = await forward<number>(
      tabId,
      'CssSelector',
      'highlightElements',
      { selector }
    )
    console.log('[Background][CssSelector] highlighted count:', count)
    return count
  },

  clearHighlights(payload: Payload) {
    const { tabId } = payload as { tabId?: number }
    if (!tabId) throw new Error('Missing tabId')
    console.log('[Background][CssSelector] clearHighlights for tab', tabId)
    void forward<void>(
      tabId,
      'CssSelector',
      'removeHighlights',
      {}
    )
    return null
  },
})

new GlobalPulse('SeoAnalyzer', {
  async analyzeSite(payload: Payload) {
    const { tabId } = payload as { tabId?: number }
    if (!tabId) throw new Error('Missing tabId')
    console.log('[Background][SeoAnalyzer] analyzeSite → tab', tabId)
    const result = await forward<SeoAnalysisResult>(
      tabId,
      'SeoAnalyzer',
      'analyzeSite',
      {}
    )
    console.log('[Background][SeoAnalyzer] got result:', result)
    return result
  },

  clearResult(payload: Payload) {
    const { tabId } = payload as { tabId?: number }
    if (!tabId) throw new Error('Missing tabId')
    console.log('[Background][SeoAnalyzer] clearResult → tab', tabId)
    void forward<void>(
      tabId,
      'SeoAnalyzer',
      'clearResult',
      {}
    )
    return null
  },
})

new GlobalPulse('ElementPicker', {

  async startElementSelection(payload: Payload) {
    const { tabId } = payload as { tabId?: number }
    if (!tabId) throw new Error('Missing tabId')
    console.log('[Background][ElementPicker] startElementSelection → tab', tabId)
    const result = await forward<{ html: string; css: string }>(
      tabId,
      'ElementPicker',
      'startSelection',
      {}
    )
    console.log('[Background][ElementPicker] got selection', result)
    return result
  },

  stopElementSelection(payload: Payload) {
    const { tabId } = payload as { tabId?: number }
    if (!tabId) throw new Error('Missing tabId')
    console.log('[Background][ElementPicker] stopElementSelection → tab', tabId)
    void forward<void>(tabId, 'ElementPicker', 'stopSelection', {})
    return null
  },

  async getSelectedElement(payload: Payload) {
    const { tabId } = payload as { tabId?: number }
    if (!tabId) throw new Error('Missing tabId')
    console.log('[Background][ElementPicker] getSelectedElement → tab', tabId)
    const result = await forward<{ html: string; css: string }>(
      tabId,
      'ElementPicker',
      'getSelectedElement',
      {}
    )
    console.log('[Background][ElementPicker] returning selected element', result)
    return result
  },
})

new GlobalPulse('Optimize', {

  async audit(payload: Payload) {
    const { tabId } = payload as { tabId?: number }
    if (!tabId) throw new Error('Missing tabId')
    return forward(tabId, 'Optimize', 'audit', {})
  },

  showOverlays(payload: Payload) {
    const { tabId } = payload as { tabId?: number }
    if (!tabId) throw new Error('Missing tabId')
    void forward<void>(tabId, 'Optimize', 'showOverlays', {})
    return null
  },

  clearOverlays(payload: Payload) {
    const { tabId } = payload as { tabId?: number }
    if (!tabId) throw new Error('Missing tabId')
    void forward<void>(tabId, 'Optimize', 'clearOverlays', {})
    return null
  },

  scrollTo(payload: Payload) {
    const { tabId, index } = payload as { tabId?: number; index: number }
    if (!tabId) throw new Error('Missing tabId')
    void forward<void>(tabId, 'Optimize', 'scrollTo', { index })
    return null
  },

  async compressAll(payload: Payload): Promise<Record<number,string>> {
    const { tabId } = payload as { tabId?: number };
    if (!tabId) throw new Error('Missing tabId');
    return forward<Record<number,string>>(tabId, 'Optimize', 'compressAll', {});
  },
})

new GlobalPulse('GifRecorder', {

  async start(payload: Payload): Promise<RecordingResponse> {
    const { tabId, fps } = payload as any;
    if (!tabId) throw new Error('Missing tabId');
    await ensureOffscreenDocument();
    return new Promise((res, rej) => {
      chrome.runtime.sendMessage(
        { target: 'offscreen', action: 'startRecording', data: { fps } },
        (resp: RecordingResponse) => {
          if (chrome.runtime.lastError) return rej(new Error(chrome.runtime.lastError.message));
          res(resp);
        }
      );
    });
  },

  async pause(payload: Payload) {
    const { tabId } = payload as any;
    if (!tabId) throw new Error('Missing tabId');
    chrome.runtime.sendMessage({ target: 'offscreen', action: 'pauseRecording' });
    return null;
  },

  async resume(payload: Payload) {
    const { tabId } = payload as any;
    if (!tabId) throw new Error('Missing tabId');
    chrome.runtime.sendMessage({ target: 'offscreen', action: 'resumeRecording' });
    return null;
  },

  async stop(payload: Payload): Promise<RecordingResponse> {
    const { tabId } = payload as any;
    if (!tabId) throw new Error('Missing tabId');
    return new Promise((res, rej) => {
      chrome.runtime.sendMessage(
        { target: 'offscreen', action: 'stopRecording' },
        (resp: RecordingResponse) => {
          if (chrome.runtime.lastError) return rej(new Error(chrome.runtime.lastError.message));
          res(resp);
        }
      );
    });
  }
});

export class BackgroundPage extends BaseBackgroundPage {
  static async init() {
    super.init()
    await ensureOffscreenDocument()

    ContextMenu.create(MenuId.OpenToolsPanel, MenuName.OpenToolsPanel)

    chrome.action.onClicked.addListener(tab => {
      if (!tab?.id) return
      SidePanel.open(tab.id)
      SidePanel.setOptions({
        path: `side-panel.html?tabId=${tab.id}`,
        enabled: true,
      })
    })

    ContextMenu.onClick(MenuId.OpenToolsPanel, (_, tab) => {
      if (!tab?.id) return
      SidePanel.open(tab.id)
      SidePanel.setOptions({
        path: `side-panel.html?tabId=${tab.id}`,
        enabled: true,
      })
    })
  }
}

;(async () => {
  await BackgroundPage.init()
})()
