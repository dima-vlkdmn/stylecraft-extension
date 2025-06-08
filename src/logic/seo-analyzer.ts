import {
  PerformanceData,
  RobotsResult,
  SitemapResult,
  MetaDataAnalysis,
  ContentAnalysis,
  LinkAnalysis,
  StructuredDataAnalysis,
  SeoAnalysisResult,
  BlockAnalysisResult,
} from '@/src/services/seo-analyzer/types'
import {
  runAudit,
  extractIssues,
  summarizeResults,
} from '@/src/logic/accessibility'

import { AccessibilitySummary, AccessibilityIssue } from '../services/accessibility-service/types'

/** 1. PERFORMANCE **/
export async function checkPerformance(): Promise<PerformanceData> {
  return new Promise(res => {
    setTimeout(() => {
      res({ lcp: 2.5, fid: 0.1, cls: 0.05, overallPerformance: 80 })
    }, 500)
  })
}

/** 2. MOBILE FRIENDLY **/
export async function checkMobileFriendly(): Promise<boolean> {
  return document.querySelector('meta[name="viewport"]') !== null
}

/** 3. HTTPS **/
export function checkHTTPS(): boolean {
  return location.protocol === 'https:'
}

/** 4. ROBOTS.TXT **/
export async function checkRobotsTxt(): Promise<RobotsResult> {
  try {
    const resp = await fetch(`${location.origin}/robots.txt`)
    if (!resp.ok) return { exists: false }
    const content = await resp.text()
    return { exists: true, content }
  } catch {
    return { exists: false }
  }
}

/** 5. SITEMAP.XML **/
export async function checkSitemapXml(): Promise<SitemapResult> {
  try {
    const resp = await fetch(`${location.origin}/sitemap.xml`)
    if (!resp.ok) return { exists: false }
    const content = await resp.text()
    return { exists: true, content }
  } catch {
    return { exists: false }
  }
}

/** 6. META TAGS **/
function isValidURL(url: string): boolean {
  try { new URL(url); return true } catch { return false }
}
function isOptimizedTag(metaTag: { tag: string; content: string | null }): boolean {
  const content = metaTag.content || ''
  switch (metaTag.tag) {
    case 'title':
    case 'og:title':
    case 'twitter:title':
      return content.length >= 50 && content.length <= 60
    case 'description':
    case 'og:description':
    case 'twitter:description':
      return content.length >= 50 && content.length <= 160
    case 'viewport':
      return content.includes('width=device-width')
    case 'robots':
      return content.includes('index') || content.includes('follow')
    case 'author':
    case 'keywords':
      return content.trim().length > 0
    case 'canonical':
    case 'og:image':
    case 'og:url':
    case 'twitter:image':
      return content.startsWith('http') && isValidURL(content)
    case 'twitter:card':
      return content === 'summary' || content === 'summary_large_image'
    default:
      return false
  }
}
export function analyzeMetaTags(): MetaDataAnalysis {
  const requiredMetaTags = [
    'title','description','keywords','viewport','robots','author','canonical',
    'og:title','og:description','og:image','og:url',
    'twitter:card','twitter:title','twitter:description','twitter:image',
  ]
  const metaTags: MetaDataAnalysis['metaTags'] = []

  const headTitle = document.querySelector('title')
  const canonicalLink = document.querySelector('link[rel="canonical"]')
  const allMeta = Array.from(document.getElementsByTagName('meta'))

  for (const tag of requiredMetaTags) {
    let content: string | null = null
    if (tag === 'title' && headTitle) content = headTitle.textContent
    else if (tag === 'canonical' && canonicalLink) content = canonicalLink.getAttribute('href')
    else {
      const match = allMeta.find(el =>
        el.getAttribute('name') === tag || el.getAttribute('property') === tag
      )
      content = match?.getAttribute('content') || null
    }
    const isOptimized = isOptimizedTag({ tag, content })
    metaTags.push({ tag, content, isOptimized })
  }

  const isAllOptimized = metaTags.every(t => t.isOptimized)
  return { metaTags, isAllOptimized }
}

/** 7. CONTENT **/
export function analyzeContent(): ContentAnalysis {
  const bodyText = document.body.innerText || ''
  const words = bodyText.split(/\s+/).filter(w => w)
  const total = words.length
  const keywords = ['seo','optimization','website']
  let keywordCount = 0
  for (const kw of keywords) {
    const matches = bodyText.match(new RegExp(kw, 'gi'))
    if (matches) keywordCount += matches.length
  }
  const density = total ? (keywordCount / total) * 100 : 0
  const uniqueContent = total > 300
  return { keywordDensity: density, uniqueContent }
}

/** 8. LINKS **/
export function analyzeLinks(): LinkAnalysis {
  const allLinks = Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href]'))
  const internal = allLinks.filter(l => l.href.startsWith(location.origin))
  const external = allLinks.filter(l => !l.href.startsWith(location.origin))
  return {
    internalLinksCount: internal.length,
    externalLinksCount: external.length,
    brokenLinks: [],
  }
}

/** 9. STRUCTURED DATA **/
export function checkStructuredData(): StructuredDataAnalysis {
  const scripts = Array.from(
    document.querySelectorAll<HTMLScriptElement>('script[type="application/ld+json"]')
  )
  let hasSchema = false
  const schemas: string[] = []
  for (const script of scripts) {
    try {
      const json = JSON.parse(script.textContent || '{}')
      if (Array.isArray(json)) json.forEach(item => item['@type'] && schemas.push(item['@type']) && (hasSchema = true))
      else if (json['@type']) { schemas.push(json['@type']); hasSchema = true }
    } catch {}
  }
  return { hasSchemaOrg: hasSchema, schemas }
}

/** Calculate SEO score with weighted accessibility **/
export function calculateSeoScore(data: {
  performanceData: PerformanceData
  mobileFriendly: boolean
  httpsCheck: boolean
  robotsResult: RobotsResult
  sitemapResult: SitemapResult
  metaData: MetaDataAnalysis
  content: ContentAnalysis
  links: LinkAnalysis
  structuredData: StructuredDataAnalysis
  accessibilitySummary: AccessibilitySummary
}): number {
  let score = 0
  if (data.httpsCheck) score += 10
  if (data.robotsResult.exists) score += 5
  if (data.sitemapResult.exists) score += 5
  score += Math.round(data.performanceData.overallPerformance * 0.3)
  score += data.metaData.isAllOptimized ? 10 : 5
  if (data.mobileFriendly) score += 10
  if (data.content.uniqueContent) score += 10
  if (data.links.brokenLinks.length === 0) score += 5
  if (data.structuredData.hasSchemaOrg) score += 10
  // weighted accessibility by issue count
  const issuesCount = data.accessibilitySummary.totalIssues
  if (issuesCount === 0) score += 10
  else if (issuesCount <= 5) score += 7
  else score += 5
  return Math.min(score, 100)
}

/** Block builders **/
export function buildTechnicalBlock(
  perf: PerformanceData,
  mobile: boolean,
  httpsCheck: boolean,
  robots: RobotsResult,
  sitemap: SitemapResult
): BlockAnalysisResult {
  const issues: string[] = []
  const recommendations: string[] = []
  let correct = 0, incorrect = 0

  if (!httpsCheck) { issues.push('Enable HTTPS.'); incorrect++ } else correct++
  if (!robots.exists) { issues.push('Create robots.txt.'); incorrect++ } else correct++
  if (!sitemap.exists) { issues.push('Create sitemap.xml.'); incorrect++ } else correct++
  if (!mobile) { issues.push('Add viewport meta.'); incorrect++ } else correct++
  if (perf.overallPerformance < 75) { issues.push('Improve performance.'); incorrect++ } else correct++

  const score = Math.max(0, 100 - incorrect * 10)
  return { score, issues, recommendations, correctCount: correct, incorrectCount: incorrect }
}

export function buildMetaBlock(meta: MetaDataAnalysis): BlockAnalysisResult {
  const issues: string[] = []
  const recommendations: string[] = []
  let correct = 0, incorrect = 0

  for (const tag of meta.metaTags) {
    if (!tag.isOptimized) { issues.push(`Review <${tag.tag}>`); incorrect++ }
    else correct++
  }
  const score = meta.isAllOptimized ? 100 : Math.max(0, 100 - incorrect * 5)
  return { score, issues, recommendations, correctCount: correct, incorrectCount: incorrect }
}

export function buildContentBlock(content: ContentAnalysis): BlockAnalysisResult {
  const issues: string[] = []
  const recommendations: string[] = []
  let correct = 0, incorrect = 0

  if (!content.uniqueContent) { issues.push('Add unique content.'); incorrect++ } else correct++
  if (content.keywordDensity < 0.5 || content.keywordDensity > 5) {
    issues.push('Adjust keyword density.'); incorrect++
  } else correct++

  const score = Math.max(0, 100 - incorrect * 10)
  return { score, issues, recommendations, correctCount: correct, incorrectCount: incorrect }
}

export function buildLinkBlock(links: LinkAnalysis): BlockAnalysisResult {
  const issues: string[] = []
  const recommendations: string[] = []
  let correct = 0, incorrect = 0

  if (links.brokenLinks.length) {
    issues.push(...links.brokenLinks.map(u => `Broken link: ${u}`))
    incorrect += links.brokenLinks.length
  }
  const total = links.internalLinksCount + links.externalLinksCount
  correct = total - incorrect
  if (total === 0) { issues.push('No links.'); incorrect++ }

  const score = Math.max(0, 100 - incorrect * 5)
  return { score, issues, recommendations, correctCount: correct, incorrectCount: incorrect }
}

export function buildAccessibilityBlock(
  summary: AccessibilitySummary,
  issues: AccessibilityIssue[]
): BlockAnalysisResult {
  const issuesMsgs = issues.map(i => `${i.index}. ${i.id}`)
  const recommendations = issuesMsgs.length
    ? ['Fix accessibility issues according to axe-core']
    : ['Accessibility is good']
  // compute score inversely proportional to issue count
  const score = Math.max(0, 100 - summary.totalIssues * 5)
  return { score, issues: issuesMsgs, recommendations, correctCount: Math.max(0, 0), incorrectCount: issuesMsgs.length }
}

/** 13. FULL SITE ANALYSIS **/
export interface DeepSeoAnalysisResult extends Omit<SeoAnalysisResult, 'details'> {
  details: SeoAnalysisResult['details'] & { accessibilityBlock: BlockAnalysisResult }
  accessibilitySummary: AccessibilitySummary
  accessibilityIssues:  AccessibilityIssue[]
}

export async function runSeoAnalysis(): Promise<DeepSeoAnalysisResult> {
  const perf      = await checkPerformance()
  const mobile    = await checkMobileFriendly()
  const https     = checkHTTPS()
  const robots    = await checkRobotsTxt()
  const sitemap   = await checkSitemapXml()
  const metaData  = analyzeMetaTags()
  const content   = analyzeContent()
  const links     = analyzeLinks()
  const structured= checkStructuredData()

  // Accessibility analysis directly in SEO flow
  const axeResults            = await runAudit()
  const accessibilityIssues   = extractIssues(axeResults)
  const accessibilitySummary  = summarizeResults(axeResults)

  const seoScore = calculateSeoScore({
    performanceData: perf,
    mobileFriendly: mobile,
    httpsCheck: https,
    robotsResult: robots,
    sitemapResult: sitemap,
    metaData,
    content,
    links,
    structuredData: structured,
    accessibilitySummary,
  })

  return {
    // base SEO properties
    metaTags: metaData.metaTags,
    seoScore,
    overallScore: seoScore,
    details: {
      technicalBlock: buildTechnicalBlock(perf, mobile, https, robots, sitemap),
      metaBlock:      buildMetaBlock(metaData),
      contentBlock:   buildContentBlock(content),
      linkBlock:      buildLinkBlock(links),
      accessibilityBlock: buildAccessibilityBlock(accessibilitySummary, accessibilityIssues),
    },
    accessibilitySummary,
    accessibilityIssues,
  }
}
