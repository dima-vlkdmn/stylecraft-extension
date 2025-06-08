import { GlobalWing } from '@/lib/chrome-wings';
import type { PaletteState } from './types';
import { extractColors }      from '@/src/logic/palette';

export class PaletteGlobalService extends GlobalWing<PaletteState> {
  constructor() {
    super('Palette', { palette: null });
  }

  public scanPalette(): void {
    const palette = extractColors();
    this.setState({ palette });
  }

  public clearPalette(): void {
    this.setState({ palette: null });
  }
}

export const paletteGlobalService = new PaletteGlobalService();
