import { GlobalWing } from '@/lib/chrome-wings';
import {
  createOverlays,
  updateOverlays,
  getPixelColor,
  cleanupOverlays,
  OverlayHandles,
} from '@/src/logic/color-picker';
import type { PickedColor, ColorPickerState } from './types';

class ColorPickerGlobalService extends GlobalWing<ColorPickerState> {
  private handles: OverlayHandles | null = null;

  constructor() {
    super('ColorPicker', { isPicking: false, pickedColor: null });
  }

  public async pickColor(): Promise<void> {
    this.setState({ isPicking: true, pickedColor: null });

    const dataUrl: string = await new Promise((resolve, reject) => {
      chrome.tabs.captureVisibleTab((url) => {
        if (chrome.runtime.lastError || !url) {
          return reject(chrome.runtime.lastError || new Error('No URL'));
        }
        resolve(url);
      });
    });

    this.handles = await createOverlays(dataUrl);

    const onMove = (e: MouseEvent) =>
      updateOverlays(this.handles!, e.clientX, e.clientY);

    const onClick = (e: MouseEvent) => {
      const color: PickedColor = getPixelColor(
        this.handles!.canvas,
        e.clientX,
        e.clientY
      );
      cleanupOverlays(this.handles!);
      document.removeEventListener('mousemove', onMove);
      document.removeEventListener('click', onClick);

      this.setState({ isPicking: false, pickedColor: color });
    };

    document.addEventListener('mousemove', onMove);
    document.addEventListener('click', onClick);
  }

  public cancelPicking(): void {
    if (this.handles) {
      cleanupOverlays(this.handles);
      this.handles = null;
    }
    this.setState({ isPicking: false });
  }
}

export const colorPickerGlobalService = new ColorPickerGlobalService();
