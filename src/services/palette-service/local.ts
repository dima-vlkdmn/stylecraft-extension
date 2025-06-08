import { LocalWing } from '@/lib/chrome-wings';
import { extractColors } from '@/src/logic/palette';
import { useWing }        from '@/lib/react-wings';
import type { CategorizedPalette } from './types';

interface PaletteState {
  palette: CategorizedPalette | null;
}

export class PaletteLocalService extends LocalWing<PaletteState> {
  constructor() {
    super('Palette', { palette: null });

    this.actions.scanPalette  = this.scanPalette.bind(this);
    this.actions.clearPalette = this.clearPalette.bind(this);
  }

  public async scanPalette(): Promise<CategorizedPalette> {
    const palette = extractColors();
    this.setState({ palette });
    return palette;
  }

  public clearPalette(): void {
    this.setState({ palette: null });
  }
}

export const paletteLocalService = new PaletteLocalService();
export const usePalette = useWing;
