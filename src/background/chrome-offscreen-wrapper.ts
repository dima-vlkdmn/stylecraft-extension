export type OffscreenDocumentReason =
  | 'AUDIO_PLAYBACK'
  | 'BATTERY_STATUS'
  | 'BLOBS'
  | 'CLIPBOARD'
  | 'DISPLAY_MEDIA'
  | 'DOM_PARSER'
  | 'DOM_SCRAPING'
  | 'GEOLOCATION'
  | 'IFRAME_SCRIPTING'
  | 'LOCAL_STORAGE'
  | 'MATCH_MEDIA'
  | 'TESTING'
  | 'USER_MEDIA'
  | 'WEB_RTC'
  | 'WORKERS';

export interface CreateDocumentOptions {
  url: string;
  reasons: OffscreenDocumentReason[];
  justification: string;
}

export function createDocument(options: CreateDocumentOptions): Promise<void> {
  if (!chrome.offscreen || typeof chrome.offscreen.createDocument !== 'function') {
    return Promise.reject(new Error("chrome.offscreen.createDocument is not available"));
  }
  return (chrome.offscreen.createDocument as any)(options);
}

export function hasDocument(): Promise<boolean> {
  if (!chrome.offscreen || typeof chrome.offscreen.hasDocument !== 'function') {
    return Promise.reject(new Error("chrome.offscreen.hasDocument is not available"));
  }
  return (chrome.offscreen.hasDocument as any)();
}

export function closeDocument(): Promise<void> {
  if (!chrome.offscreen || typeof chrome.offscreen.closeDocument !== 'function') {
    return Promise.reject(new Error("chrome.offscreen.closeDocument is not available"));
  }
  return (chrome.offscreen.closeDocument as any)();
}
