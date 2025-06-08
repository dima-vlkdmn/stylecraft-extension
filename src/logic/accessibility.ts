import axe from 'axe-core'
import type {
  AccessibilityIssue,
  AccessibilitySummary
} from '@/src/services/accessibility-service/types'

let isHighlighting = false

export function getColorForCategory(cat: AccessibilityIssue['category']): string {
  switch (cat) {
    case 'contrast':  return 'orange'
    case 'critical':  return 'red'
    case 'alert':     return 'yellow'
    case 'structure': return 'blue'
    case 'aria':      return 'purple'
    default:          return 'gray'
  }
}

function getInlineTextColor(cat: AccessibilityIssue['category']): string {
  return cat === 'alert' ? '#000' : '#fff'
}

export async function runAudit(
  root: Document | HTMLElement = document
): Promise<axe.AxeResults> {
  return new Promise((resolve, reject) => {
    axe.run(root, {}, (err, results) => {
      if (err) reject(err)
      else resolve(results)
    })
  })
}

export function extractIssues(results: axe.AxeResults): AccessibilityIssue[] {
  const issues: AccessibilityIssue[] = []
  let idx = 1

  for (const v of results.violations) {

    let category: AccessibilityIssue['category'] = 'other'
    if (v.id === 'color-contrast' || v.tags.includes('color-contrast')) category = 'contrast'
    else if (v.impact === 'critical' || v.impact === 'serious') category = 'critical'
    else if (v.impact === 'moderate' || v.impact === 'minor') category = 'alert'
    else if (v.id.includes('landmark') || v.id.includes('document-structure')) category = 'structure'
    else if (v.id.toLowerCase().includes('aria')) category = 'aria'

    for (const node of v.nodes) {
      const targets = node.target.map(t => typeof t === 'string' ? t : String(t))
      const issue: AccessibilityIssue = {
        index:       idx++,
        id:          v.id,
        impact:      v.impact,
        description: v.description,
        help:        v.help,
        helpUrl:     v.helpUrl,
        tags:        v.tags,
        targets,
        category,
        failColors: undefined
      }

      if (category === 'contrast' && node.any?.[0]?.data) {
        const data = node.any[0].data as any
        if (data.foreground && data.background && data.contrast) {
          issue.failColors = {
            fg: data.foreground as string,
            bg: data.background as string,
            ratio: (data.contrast as number).toFixed(2)
          }
        }
      }

      issues.push(issue)
    }
  }

  return issues
}

export function summarizeResults(results: axe.AxeResults): AccessibilitySummary {
  const summary: AccessibilitySummary = {
    totalViolations:  results.violations.length,
    totalIssues:      0,
    contrastIssues:   0,
    criticalIssues:   0,
    alertIssues:      0,
    structuralIssues: 0,
    ariaIssues:       0,
    otherIssues:      0,
  }

  for (const v of results.violations) {
    const count = v.nodes.length
    summary.totalIssues += count

    if (v.id === 'color-contrast' || v.tags.includes('color-contrast')) {
      summary.contrastIssues += count
    } else if (v.impact === 'critical' || v.impact === 'serious') {
      summary.criticalIssues += count
    } else if (v.impact === 'moderate' || v.impact === 'minor') {
      summary.alertIssues += count
    } else if (v.id.includes('landmark') || v.id.includes('document-structure')) {
      summary.structuralIssues += count
    } else if (v.id.toLowerCase().includes('aria')) {
      summary.ariaIssues += count
    } else {
      summary.otherIssues += count
    }
  }

  return summary
}

export function highlightIssues(issues: AccessibilityIssue[]): void {
  if (isHighlighting) return
  isHighlighting = true
  try {
    clearHighlights()

    for (const issue of issues) {
      const uniqueEls = new Set<Element>()
      issue.targets.forEach(sel =>
        document.querySelectorAll(sel).forEach(el => uniqueEls.add(el))
      )
      if (!uniqueEls.size) continue

      const first = uniqueEls.values().next().value as HTMLElement
      const r     = first.getBoundingClientRect()
      const marker = document.createElement('div')
      marker.className = 'axe-marker'
      marker.innerText = String(issue.index)
      Object.assign(marker.style, {
        position:       'absolute',
        left:           `${r.left + window.scrollX}px`,
        top:            `${r.top  + window.scrollY}px`,
        width:          '20px',
        height:         '20px',
        lineHeight:     '20px',
        textAlign:      'center',
        borderRadius:   '50%',
        backgroundColor:getColorForCategory(issue.category),
        color:          issue.category === 'alert' ? '#000' : '#fff',
        cursor:         'pointer',
        zIndex:         '9999',
      })
      marker.title = `${issue.id} (#${issue.index}): ${issue.description}`
      marker.onclick = () => scrollToIssue(issue)
      document.body.append(marker)

      uniqueEls.forEach(el => {
        if ((el as HTMLElement).querySelector('.axe-inline-marker')) return
        const inline = document.createElement('div')
        inline.className = 'axe-inline-marker'
        inline.innerText = String(issue.index)
        Object.assign(inline.style, {
          position:       'absolute',
          left:           '4px',
          top:            '4px',
          width:          '16px',
          height:         '16px',
          lineHeight:     '16px',
          textAlign:      'center',
          borderRadius:   '50%',
          backgroundColor:getColorForCategory(issue.category),
          color:          getInlineTextColor(issue.category),
          cursor:         'pointer',
          zIndex:         '10',
        })
        const cs = window.getComputedStyle(el as HTMLElement)
        if (cs.position === 'static') (el as HTMLElement).style.position = 'relative'
        ;(el as HTMLElement).append(inline)
        inline.onmouseover = () => (el as HTMLElement).classList.add('axe-highlight')
        inline.onmouseout  = () => (el as HTMLElement).classList.remove('axe-highlight')
        inline.onclick     = () => scrollToIssue(issue)
      })
    }
  } finally {
    isHighlighting = false
  }
}

export function annotateStructure(): void {
  document.querySelectorAll('.axe-struct-icon').forEach(el => el.remove())

  document.querySelectorAll<HTMLElement>('h1,h2,h3,h4,h5,h6').forEach(h => {
    const icon = document.createElement('div')
    icon.className = 'axe-struct-icon'
    icon.innerText = 'ⓘ'
    const r = h.getBoundingClientRect()
    Object.assign(icon.style, {
      position:  'absolute',
      left:      `${r.left}px`,
      top:       `${r.top - 20}px`,
      color:     'blue',
      fontSize:  '12px',
      zIndex:    '9998',
    })
    document.body.append(icon)
  })

  ;(['ul','ol','table','[role]'] as const).forEach(sel => {
    document.querySelectorAll<HTMLElement>(sel).forEach(el => {
      const icon = document.createElement('div')
      icon.className = 'axe-struct-icon'
      icon.innerText = 'ⓘ'
      const r = el.getBoundingClientRect()
      Object.assign(icon.style, {
        position: 'absolute',
        left:     `${r.right - 16}px`,
        top:      `${r.top}px`,
        color:    'blue',
        fontSize: '12px',
        zIndex:   '9998',
      })
      document.body.append(icon)
    })
  })
}

export function overlayContrastIssues(results: axe.AxeResults): void {
  results.violations
    .filter(v => v.id === 'color-contrast' || v.tags.includes('color-contrast'))
    .forEach(v => {
      v.nodes.forEach(node => {
        node.target.forEach(rawSel => {
          document.querySelectorAll<HTMLElement>(String(rawSel)).forEach(el => {
            const r = el.getBoundingClientRect()
            const overlay = document.createElement('div')
            overlay.className = 'axe-contrast-overlay'
            Object.assign(overlay.style, {
              position:      'absolute',
              left:          `${r.left + window.scrollX}px`,
              top:           `${r.top  + window.scrollY}px`,
              width:         `${r.width}px`,
              height:        `${r.height}px`,
              backgroundColor:'rgba(255,0,0,0.3)',
              pointerEvents: 'none',
              zIndex:        '9997',
            })
            document.body.append(overlay)

            const ratio = node.any?.[0]?.data?.contrast?.toFixed(2) ?? 'n/a'
            const badge = document.createElement('div')
            badge.className = 'axe-contrast-badge'
            badge.innerText = ratio
            Object.assign(badge.style, {
              position:      'absolute',
              left:          `${r.left + window.scrollX}px`,
              top:           `${r.top - 20 + window.scrollY}px`,  
              backgroundColor:'rgba(255,0,0,0.7)',
              color:         '#fff',
              padding:       '2px 4px',
              fontSize:      '10px',
              zIndex:        '9998',
            })
            document.body.append(badge)
          })
        })
      })
    })
}

export function exportReport(
  issues: AccessibilityIssue[],
  summary: AccessibilitySummary
): void {
  const data = { summary, issues }
  const blob = new Blob([JSON.stringify(data, null, 2)], {
    type: 'application/json'
  })
  const url  = URL.createObjectURL(blob)
  const a    = document.createElement('a')
  a.href = url
  a.download = 'accessibility-report.json'
  a.click()
  URL.revokeObjectURL(url)
}

export function collectTabOrder(): string[] {
  const sel = [
    'a[href]', 'button', 'input', 'select', 'textarea',
    '[tabindex]:not([tabindex="-1"])'
  ].join(',')
  return Array.from(document.querySelectorAll<HTMLElement>(sel))
    .filter(el => !el.hasAttribute('disabled') && !!(el.offsetWidth || el.offsetHeight))
    .map(el => el.tagName.toLowerCase() + (el.id ? `#${el.id}` : ''))
}

export function clearHighlights(): void {
  document
    .querySelectorAll(
      '.axe-marker,' +
      '.axe-inline-marker,' +
      '.axe-struct-icon,' +
      '.axe-contrast-overlay,' +
      '.axe-contrast-badge'
    )
    .forEach(el => el.remove())
}

export function scrollToIssue(issue: AccessibilityIssue): void {
  if (!issue.targets.length) return
  const el = document.querySelector(issue.targets[0]) as HTMLElement | null
  if (!el) return
  el.scrollIntoView({ behavior: 'smooth', block: 'center' })
  el.classList.add('axe-highlight')
  setTimeout(() => el.classList.remove('axe-highlight'), 2000)
}
