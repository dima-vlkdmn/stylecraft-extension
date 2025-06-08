import { LocalWing } from '@/lib/chrome-wings';
import { useWing }   from '@/lib/react-wings';
import type { OptimizeState } from './types';
import {
  runOptimizeAudit,
  showOptimizeOverlays,
  clearOptimizeOverlays,
  scrollToOptimizeImage,
  compressAll as doCompressAll
} from '@/src/logic/optimize';

export class OptimizeLocalService extends LocalWing<OptimizeState> {
  constructor() {
    super('Optimize', {
      summary: null,
      largeImages: [],
      recommendations: [],
      optimizedMap: {},
    });

    this.actions.audit         = this.audit.bind(this);
    this.actions.showOverlays  = this.showOverlays.bind(this);
    this.actions.clearOverlays = this.clearOverlays.bind(this);
    this.actions.scrollTo      = this.scrollTo.bind(this);
    this.actions.compressAll   = this.compressAll.bind(this);
  }

  public async audit(): Promise<void> {
    const { summary, largeImages, recommendations } = await runOptimizeAudit();
    this.setState({ summary, largeImages, recommendations, optimizedMap: {} });
  }

  public showOverlays(): void {
    clearOptimizeOverlays();
    showOptimizeOverlays(this.state.largeImages);
  }

  public clearOverlays(): void {
    clearOptimizeOverlays();
  }

  public scrollTo(index: number): void {
    scrollToOptimizeImage(index);
  }

  public async compressAll(): Promise<Record<number,string>> {
    const map = await doCompressAll(this.state.largeImages);
    this.setState({ optimizedMap: map });
    return map;
  }
}

export const optimizeLocalService = new OptimizeLocalService();
export const useOptimize = useWing;
