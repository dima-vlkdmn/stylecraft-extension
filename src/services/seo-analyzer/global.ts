import { GlobalWing } from '@/lib/chrome-wings';
import type { SeoState } from './types';
import { runSeoAnalysis } from '@/src/logic/seo-analyzer';

export class SeoAnalyzerGlobalService extends GlobalWing<SeoState> {
  constructor() {
    super('SeoAnalyzer', { lastResult: null });
  }

  public async analyzeSite(): Promise<void> {
    const result = await runSeoAnalysis();
    this.setState({ lastResult: result });
  }
}

export const seoAnalyzerGlobalService = new SeoAnalyzerGlobalService();
