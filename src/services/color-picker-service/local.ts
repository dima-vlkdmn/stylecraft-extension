import { LocalWing } from '@/lib/chrome-wings';
import { useWing }    from '@/lib/react-wings';
import {
  createOverlays,
  updateOverlays,
  getPixelColor,
  cleanupOverlays,
  OverlayHandles,
} from '@/src/logic/color-picker';
import type { PickedColor, ColorPickerState } from './types';

class ColorPickerLocalService extends LocalWing<ColorPickerState> {
  private handles: OverlayHandles | null = null;

  constructor() {
    super('ColorPicker', { isPicking: false, pickedColor: null });
    this.actions.pickColor      = this.pickColor.bind(this);
    this.actions.cancelPicking  = this.cancelPicking.bind(this);
  }

  public async pickColor(): Promise<PickedColor> {
    this.setState({ isPicking: true, pickedColor: null });

    const { dataUrl } = await this.messenger.sendMessage<{ dataUrl: string }>(
      'captureTab', {}
    );

    const handles = await createOverlays(dataUrl);
    this.handles = handles;

    return new Promise<PickedColor>(resolve => {
      const onMove = (e: MouseEvent) =>
        updateOverlays(handles, e.clientX, e.clientY);

      const onClick = (e: MouseEvent) => {
        const color = getPixelColor(handles.canvas, e.clientX, e.clientY);

        cleanupOverlays(handles);
        document.removeEventListener('mousemove', onMove, true);
        document.removeEventListener('click', onClick, true);
        this.handles = null;

        this.setState({ isPicking: false, pickedColor: color });
        resolve(color);
      };

      document.addEventListener('mousemove', onMove, true);
      document.addEventListener('click', onClick, true);
    });
  }

  public cancelPicking(): null {
    if (this.handles) {
      cleanupOverlays(this.handles);
      this.handles = null;
    }
    this.setState({ isPicking: false, pickedColor: null });
    return null;
  }
}

export const colorPickerLocalService = new ColorPickerLocalService();
export const useColorPicker = useWing;
