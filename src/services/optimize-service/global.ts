import { GlobalWing } from '@/lib/chrome-wings';
import {
  runOptimizeAudit,
  showOptimizeOverlays,
  clearOptimizeOverlays,
  scrollToOptimizeImage,
} from '@/src/logic/optimize';
import type { LargeImage, OptimizeSummary, OptimizeAuditResult } from '@/src/services/optimize-service/types';

export interface OptimizeState {
  summary: OptimizeSummary | null;
  largeImages: LargeImage[];
  recommendations: string[];
}

export class OptimizeGlobalService extends GlobalWing<OptimizeState> {
  constructor() {
    super('Optimize', {
      summary: null,
      largeImages: [],
      recommendations: [],
    });
  }

  public async audit(): Promise<void> {
    const result: OptimizeAuditResult = await runOptimizeAudit();
    this.setState({
      summary: result.summary,
      largeImages: result.largeImages,
      recommendations: result.recommendations,
    });
    showOptimizeOverlays(result.largeImages);
  }

  public clearOverlays(): void {
    clearOptimizeOverlays();
  }

  public scrollToImage(index: number): void {
    scrollToOptimizeImage(index);
  }
}

export const optimizeGlobalService = new OptimizeGlobalService();
