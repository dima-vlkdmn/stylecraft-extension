import imageCompression from 'browser-image-compression'
import type {
  LargeImage,
  OptimizeSummary,
  OptimizeAuditResult
} from '@/src/services/optimize-service/types'

export async function compressImage(src: string): Promise<Blob> {
  const resp = await fetch(src)
  const blob = await resp.blob()
  const file = new File([blob], 'orig', { type: blob.type })

  const options = {
    maxSizeMB: 0.15,
    maxWidthOrHeight: 1920,
    useWebWorker: true,
    fileType: 'image/webp',
  }

  const compressedFile = await imageCompression(file, options)
  return compressedFile
}

export async function compressAll(
  largeImages: LargeImage[]
): Promise<Record<number,string>> {
  const result: Record<number,string> = {}

  await Promise.all(
    largeImages.map(async img => {
      try {
        const blob = await compressImage(img.src)
        result[img.index] = URL.createObjectURL(blob)
      } catch {
        result[img.index] = img.src
      }
    })
  )

  return result
}

export function waitForLoadComplete(): Promise<void> {
  return new Promise(res => {
    if (document.readyState === 'complete') {
      res()
    } else {
      window.addEventListener('load', () => res(), { once: true })
    }
  })
}

export async function analyzeImages(): Promise<{
  totalImages: number
  largeImages: LargeImage[]
}> {
  await waitForLoadComplete()
  const imgs = Array.from(document.querySelectorAll<HTMLImageElement>('img'))
  const largeImages: LargeImage[] = []

  imgs.forEach(img => {
  
    const perf = performance.getEntriesByName(img.src, 'resource')[0] as
      | PerformanceResourceTiming
      | undefined
    const sizeKB = perf ? Math.round(perf.encodedBodySize / 1024) : 0
    const isTooLarge = sizeKB > 150
    const isLazy =
      img.loading === 'lazy' || img.getAttribute('loading') === 'lazy'

    if (!isTooLarge) return

    let marker = img.getAttribute('data-optimize-marker')
    if (!marker) {
      marker = `optimize-marker-${largeImages.length + 1}`
      img.setAttribute('data-optimize-marker', marker)
    }
    const selector = `[data-optimize-marker="${marker}"]`

    largeImages.push({
      index: largeImages.length + 1,
      src: img.src,
      size: sizeKB,
      selector,
      isTooLarge,
      isLazy
    })
  })

  return { totalImages: imgs.length, largeImages }
}

export async function runOptimizeAudit(): Promise<OptimizeAuditResult> {
  const sec = await (async () => {
    const isHttps = location.protocol === 'https:'
    const missing: string[] = []
    if (!document.querySelector('meta[http-equiv="Content-Security-Policy"]')) {
      missing.push('Content-Security-Policy')
    }
    if (!document.querySelector('meta[http-equiv="X-Frame-Options"]')) {
      missing.push('X-Frame-Options')
    }
    return { isHttps, missingSecurityHeaders: missing }
  })()

  const imgRes = await analyzeImages()

  const summary: OptimizeSummary = {
    isHttps: sec.isHttps,
    missingSecurityHeaders: sec.missingSecurityHeaders,
    totalImages: imgRes.totalImages,
    largeImages: imgRes.largeImages.length,
    lazyLoadedLargeImages: imgRes.largeImages.filter(i => i.isLazy).length
  }

  const recommendations: string[] = []
  if (!summary.isHttps) {
    recommendations.push('Enable HTTPS for secure connections.')
  }
  if (summary.missingSecurityHeaders.length) {
    recommendations.push('Add missing security headers (CSP, X-Frame-Options).')
  }
  if (summary.largeImages) {
    recommendations.push('Compress large images or switch to WebP.')
  }
  if (imgRes.largeImages.some(i => !i.isLazy)) {
    recommendations.push("Use loading='lazy' for large images.")
  }

  return {
    summary,
    largeImages: imgRes.largeImages,
    recommendations
  }
}

export function showOptimizeOverlays(largeImages: LargeImage[]): void {
  largeImages.forEach(image => {
    const el = document.querySelector<HTMLElement>(image.selector)
    if (!el) return
    const parent = el.parentElement!
    if (getComputedStyle(parent).position === 'static') {
      parent.style.position = 'relative'
    }

    parent.querySelector(`#optimize-overlay-${image.index}`)?.remove()

    const marker = document.createElement('div')
    marker.id = `optimize-overlay-${image.index}`
    marker.textContent = String(image.index)
    Object.assign(marker.style, {
      position: 'absolute',
      width: '24px',
      height: '24px',
      backgroundColor: image.isTooLarge ? 'red' : 'orange',
      color: 'white',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      borderRadius: '4px',
      zIndex: '10000',
      top: `${el.getBoundingClientRect().top -
        parent.getBoundingClientRect().top +
        4}px`,
      left: `${el.getBoundingClientRect().left -
        parent.getBoundingClientRect().left +
        4}px`
    })
    parent.append(marker)
  })
}

export function clearOptimizeOverlays(): void {
  document
    .querySelectorAll<HTMLElement>('[id^="optimize-overlay-"]')
    .forEach(el => el.remove())
}

export function scrollToOptimizeImage(imageIndex: number): void {
  const marker = document.getElementById(`optimize-overlay-${imageIndex}`)
  if (!marker) return
  marker.scrollIntoView({ behavior: 'smooth', block: 'center' })
  marker.classList.add('optimize-highlight')
  setTimeout(() => marker.classList.remove('optimize-highlight'), 2000)
}
