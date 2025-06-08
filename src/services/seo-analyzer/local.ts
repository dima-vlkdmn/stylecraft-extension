import { LocalWing } from '@/lib/chrome-wings'
import { runSeoAnalysis } from '@/src/logic/seo-analyzer'
import type { SeoAnalysisResult } from '@/src/services/seo-analyzer/types'
import type { SeoState } from './types'

export class SeoAnalyzerLocalService extends LocalWing<SeoState> {
  constructor() {
    super('SeoAnalyzer', { lastResult: null })
    this.actions.analyzeSite = this.analyzeSite.bind(this)
    this.actions.clearResult = this.clearResult.bind(this)
  }

  public async analyzeSite(): Promise<SeoAnalysisResult> {
    const result = await runSeoAnalysis()
    this.setState({ lastResult: result })
    return result
  }

  public clearResult(): null {
    this.setState({ lastResult: null })
    return null
  }
}

export const seoAnalyzerLocalService = new SeoAnalyzerLocalService()
