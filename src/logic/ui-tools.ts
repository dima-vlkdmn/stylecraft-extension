const handlers: { cleanup: () => void }[] = []

export function toggleOutlineBlocks(enabled: boolean): void {
  if (enabled) {
    const els = Array.from(document.querySelectorAll<HTMLElement>('*'))
      .filter(el => {
        const cs = getComputedStyle(el)
        return cs.display === 'block' || cs.position === 'fixed' || cs.position === 'absolute'
      })
    els.forEach(el => el.style.outline = '1px dashed magenta')
    handlers.push({
      cleanup: () => els.forEach(el => (el.style.outline = ''))
    })
  } else {
    cleanupLast()
  }
}

const popupSelectors = [
  '[role="dialog"]',
  '.modal, .popup, .cookie-banner, .notification',
  '[aria-live]'
].join(',')
export function toggleDisablePopups(enabled: boolean): void {
  if (enabled) {
    const els = document.querySelectorAll<HTMLElement>(popupSelectors)
    els.forEach(el => el.style.display = 'none')
    handlers.push({ cleanup: () => els.forEach(el => (el.style.display = '')) })
  } else {
    cleanupLast()
  }
}

export function toggleImageTools(enabled: boolean): void {
  if (enabled) {
    const imgs = Array.from(document.images) as HTMLImageElement[]
    imgs.forEach(img => img.style.visibility = 'hidden')
    const overlays: HTMLElement[] = imgs.map(img => {
      const o = document.createElement('div')
      o.innerText = img.alt || '—'
      Object.assign(o.style, {
        position: 'fixed',
        left:     `${img.getBoundingClientRect().left}px`,
        top:      `${img.getBoundingClientRect().top}px`,
        background: 'rgba(0,0,0,0.7)',
        color: '#fff',
        padding: '2px 4px',
        fontSize: '10px',
        pointerEvents: 'none',
        zIndex:        '9999'
      })
      document.body.append(o)
      return o
    })
    const onClick = (e: MouseEvent) => {
      const img = e.target as HTMLImageElement
      if (img.tagName === 'IMG') img.src = img.src + ''
    }
    document.addEventListener('click', onClick, true)
    handlers.push({
      cleanup: () => {
        imgs.forEach(img => img.style.visibility = '')
        overlays.forEach(o => o.remove())
        document.removeEventListener('click', onClick, true)
      }
    })
  } else {
    cleanupLast()
  }
}

export function toggleLinkAnnotations(enabled: boolean): void {
  if (enabled) {
    const els = Array.from(document.querySelectorAll<HTMLElement>('a, [role]'))
    const overlays: HTMLElement[] = els.map(el => {
      const info = el.tagName === 'A'
        ? `href=${(el as HTMLAnchorElement).href}`
        : `role=${el.getAttribute('role')}`
      const o = document.createElement('div')
      o.innerText = info
      Object.assign(o.style, {
        position: 'absolute',
        left:     `${el.getBoundingClientRect().left}px`,
        top:      `${el.getBoundingClientRect().bottom}px`,
        background: 'rgba(0,128,0,0.7)',
        color: '#fff',
        padding: '1px 3px',
        fontSize: '10px',
        pointerEvents: 'none',
        zIndex: 9999
      })
      document.body.append(o)
      return o
    })
    handlers.push({
      cleanup: () => overlays.forEach(o => o.remove())
    })
  } else {
    cleanupLast()
  }
}

function cleanupLast() {
  const h = handlers.pop()
  if (h) h.cleanup()
}

export function resetAllEnhancements() {
  while (handlers.length) cleanupLast()
}
