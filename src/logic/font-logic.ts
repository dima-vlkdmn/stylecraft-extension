import type { FontUsage, TextStyleOptions } from '@/src/services/font-service/types'

export const GOOGLE_FONTS_API_KEY = 'AIzaSyBREoZoBT3dunxdA49zJ8uOezaw_0q5Qc0'

export interface CategorySettings {
  fontFamily: string
  fontSize: number
  lineHeight: number
  fontWeight: string
  letterSpacing: number
}

function determineUsage(el: HTMLElement): FontUsage['primaryUsage'] {
  const tag = el.tagName.toUpperCase()
  if (tag === 'H1') return 'Heading'
  if (tag === 'H2' || tag === 'H3') return 'Subheading'
  if (tag === 'BUTTON' || tag === 'A') return 'Action'
  if (tag === 'P') return 'Paragraph'
  return 'Regular'
}

export async function runFontScan(): Promise<FontUsage[]> {
  const usages: FontUsage[] = []
  const priority: Record<FontUsage['primaryUsage'], number> = {
    Heading: 0, Subheading: 1, Action: 2, Paragraph: 3, Regular: 4,
  }
  const elements = Array.from(document.body.querySelectorAll<HTMLElement>('body, body *'))
  for (const el of elements) {
    const fontFamily = getComputedStyle(el).fontFamily.replace(/['"]/g, '').trim()
    if (!fontFamily) continue
    const usage = determineUsage(el)
    const existing = usages.find(u => u.fontFamily === fontFamily)
    if (existing) {
      if (priority[usage] < priority[existing.primaryUsage]) existing.primaryUsage = usage
    } else {
      usages.push({ fontFamily, primaryUsage: usage })
    }
  }
  return usages
}

let _googleFonts: string[] = []
const _loadedGoogleCSS = new Set<string>()

export async function loadGoogleFonts(): Promise<string[]> {
  const response = await fetch(
    `https://www.googleapis.com/webfonts/v1/webfonts?key=${GOOGLE_FONTS_API_KEY}&sort=popularity`
  )
  if (!response.ok) throw new Error(`Google Fonts API error ${response.status}`)
  const data = (await response.json()) as { items: { family: string }[] }
  _googleFonts = data.items.map(i => i.family)
  return _googleFonts
}

export function getAvailableGoogleFonts(): string[] {
  return Array.from(_googleFonts)
}

export function loadGoogleFontCSS(
  fontFamily: string,
  weights = '400',
  display: 'swap' | 'block' | 'fallback' | 'optional' = 'swap'
): void {
  const href = `https://fonts.googleapis.com/css2?family=${fontFamily.trim().replace(/\s+/g, '+')}:wght@${weights}&display=${display}`
  if (_loadedGoogleCSS.has(href)) return
  _loadedGoogleCSS.add(href)
  const link = document.createElement('link')
  link.rel = 'stylesheet'
  link.href = href
  document.head.append(link)
}

declare global { interface Window { __savedRange?: Range } }

export function captureSelection(): void {
  const sel = window.getSelection()
  if (sel?.rangeCount) window.__savedRange = sel.getRangeAt(0)
}

export function applyTextStyle(opts: TextStyleOptions): void {
  const range = window.__savedRange
  if (!range) return
  const span = document.createElement('span')
  Object.assign(span.style, {
    ...(opts.fontFamily && { fontFamily: opts.fontFamily }),
    ...(opts.fontSize && { fontSize: opts.fontSize }),
    ...(opts.lineHeight && { lineHeight: opts.lineHeight }),
  })
  try {
    range.surroundContents(span)
    delete window.__savedRange
  } catch (e) {
    console.warn('Failed to apply text style', e)
  }
}

const _localFonts: string[] = []
let _overlay: HTMLDivElement | null = null


export function initCustomFontLoader(): void {
  document.addEventListener('dragover', e => {
    e.preventDefault();
  });

  document.addEventListener('drop', async e => {
    e.preventDefault();

    const dt = e.dataTransfer;
    if (!dt) return;

    const files = Array.from(dt.files)
      .filter(f => /\.(ttf|woff2?|otf)$/i.test(f.name))
      .map(async f => ({ name: f.name, buffer: await f.arrayBuffer() }));

    const payloadFiles = await Promise.all(files);
    uploadLocalFonts(payloadFiles);
  });
}

export function uploadLocalFonts(files: { name: string; buffer: ArrayBuffer }[]): void {
  files.forEach(({ name, buffer }) => {
    const base = name.replace(/\.[^/.]+$/, '')
    const ext = name.split('.').pop()!.toLowerCase()
    const blob = new Blob([buffer], { type: `font/${ext}` })
    const url = URL.createObjectURL(blob)
    const rule = `@font-face { font-family: '${base}'; src: url('${url}') format('${ext}'); }`
    const styleEl = document.createElement('style')
    styleEl.textContent = rule
    document.head.append(styleEl)
    _localFonts.push(base)
  })
}

export function getLocalFonts(): string[] {
  return Array.from(_localFonts)
}

let _selectedEl: HTMLElement | null = null

export function selectElement(el: HTMLElement): void {
  _selectedEl = el
}

export function applyElementStyle(opts: TextStyleOptions & {
  fontWeight?: string
  letterSpacing?: string
}): void {
  if (!_selectedEl) return
  if (opts.fontFamily)   loadGoogleFontCSS(opts.fontFamily)
  Object.assign(_selectedEl.style, {
    ...(opts.fontFamily    && { fontFamily:    opts.fontFamily   }),
    ...(opts.fontSize      && { fontSize:      opts.fontSize     }),
    ...(opts.lineHeight    && { lineHeight:    opts.lineHeight   }),
    ...(opts.fontWeight    && { fontWeight:    opts.fontWeight   }),
    ...(opts.letterSpacing && { letterSpacing: opts.letterSpacing}),
  })
}

const ICON_ONLY_SELECTORS = [
  '.material-icons',
  '.material-icons-extended',
  '[class*="MuiSvgIcon-root"]',
  'svg',
];

const ALLOWED_TAGS = new Set([
  'P','H1','H2','H3','H4','H5','H6','LI','A','BUTTON', 'SPAN'
]);

function isAnnotatable(el: HTMLElement, validFonts: Set<string>): boolean {
  const tag = el.tagName.toUpperCase();
  if (!ALLOWED_TAGS.has(tag)) return false;

  if (el.getAttribute('aria-hidden') === 'true') return false;

  for (const sel of ICON_ONLY_SELECTORS) {
    if (el.querySelector(sel)) return false;
  }

  const text = el.innerText.trim();
  if (!text) return false;

  const style = getComputedStyle(el);
  if (style.display === 'none' || style.visibility === 'hidden') return false;
  const rect = el.getBoundingClientRect();
  if (rect.width === 0 || rect.height === 0) return false;

  const ff = style.fontFamily.replace(/['"]/g, '').trim();
  if (!validFonts.has(ff)) return false;

  return true;
}

export function uniqueSelectorFor(el: Element): string {
  if (el.id) return `#${el.id}`
  const path: string[] = []
  let curr: Element | null = el
  while (curr) {
    let sel = curr.nodeName.toLowerCase()
    const classes = Array.from(curr.classList)
    if (classes.length) sel += '.' + classes.join('.')
    const parent = curr.parentElement
    if (parent) {
      const siblings = Array.from(parent.children).filter(
        (c): c is Element => c.nodeName === curr!.nodeName
      )
      if (siblings.length > 1) sel += `:nth-of-type(${siblings.indexOf(curr) + 1})`
    }
    path.unshift(sel)
    curr = curr.parentElement
  }
  return path.join(' > ')
}

function attachIcon(el: HTMLElement): void {
  const icon = document.createElement('span')
  icon.textContent = '⚙️'
  Object.assign(icon.style, {
    position: 'absolute',
    right: '0.25em',
    top: 'calc(100% + 5px)',

    width: '15px',
    height: '15px',
    lineHeight: '10px',
    textAlign: 'center',

    fontSize: '10px',

    background: 'white',
    borderRadius: '2px',    
    boxShadow: '0 1px 2px rgba(0,0,0,0.2)',
    opacity: '0.7',
    transition: 'opacity 0.15s',
    zIndex: '99999',
    pointerEvents: 'auto',
    cursor: 'pointer',
  })

  icon.addEventListener('mouseenter', () => { icon.style.opacity = '1' })
  icon.addEventListener('mouseleave', () => { icon.style.opacity = '0.7' })
  icon.addEventListener('click', e => {
    e.stopPropagation()
    const selector = uniqueSelectorFor(el)
    chrome.runtime.sendMessage({
      category: 'FontService',
      action: 'selectElementFromPage',
      payload: { selector }
    })
  })

  const cs = getComputedStyle(el)
  if (cs.position === 'static') el.style.position = 'relative'
  el.append(icon)
}

export async function annotatePageWithIcons(): Promise<void> {
  const usages = await runFontScan().catch(() => []);
  const validFonts = new Set(usages.map(u => u.fontFamily));

  document.body.querySelectorAll<HTMLElement>('*').forEach(el => {
    if (!el.dataset.fontIconAttached && isAnnotatable(el, validFonts)) {
      el.dataset.fontIconAttached = 'true';
      attachIcon(el);
    }
  });
}

export function applyCategoryStyles(
  settings: Record<FontUsage['primaryUsage'], CategorySettings>
): void {
  Object.values(settings).forEach(opts => {
    if (opts.fontFamily && !opts.fontFamily.startsWith('[Local]')) {
      loadGoogleFontCSS(opts.fontFamily)
    }
  })

  document.body.querySelectorAll<HTMLElement>('*').forEach(el => {
    const usage = determineUsage(el)
    const opts = settings[usage]
    if (!opts) return

    if (!opts.fontFamily) return

    el.style.fontFamily    = opts.fontFamily
    el.style.fontSize      = `${opts.fontSize}px`
    el.style.lineHeight    = `${opts.lineHeight}`
    el.style.fontWeight    = opts.fontWeight
    el.style.letterSpacing = `${opts.letterSpacing}px`
  })
}