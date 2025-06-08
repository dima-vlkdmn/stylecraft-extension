import { LocalWing } from '@/lib/chrome-wings';
import { useWing }    from '@/lib/react-wings';
import {
  disableInteractivity,
  enableInteractivity,
  highlightElement,
  clearAllHighlights,
  getComputedStyles,
  removeHighlight,
} from '@/src/logic/element-picker';
import type { ElementPickerState } from './types';

export class ElementPickerLocalService extends LocalWing<ElementPickerState> {
  constructor() {
    super('ElementPicker', {
      isSelecting: false,
      selectedHtml: null,
      selectedCss: null,
    });

    this.actions.startSelection = this.startSelection.bind(this);
    this.actions.stopSelection  = this.stopSelection.bind(this);
  }

  public startSelection(): Promise<{ html: string; css: string } | null> {
    if (this.state.isSelecting) {
      return Promise.resolve(null);
    }

    this.setState({ isSelecting: true, selectedHtml: null, selectedCss: null });
    disableInteractivity();
    document.body.style.cursor = 'crosshair';

    return new Promise((resolve) => {
      let currentHovered: HTMLElement | null = null;

      const onOver = (evt: MouseEvent) => {
        const el = evt.target as HTMLElement;
        if (currentHovered) {
          clearAllHighlights(currentHovered);
        }
        highlightElement(el);
        currentHovered = el;
      };

      const onOut = (evt: MouseEvent) => {
        const el = evt.target as HTMLElement;
        removeHighlight(el);
        if (currentHovered === el) currentHovered = null;
      };

      const onClick = (evt: MouseEvent) => {
        evt.preventDefault();
        evt.stopPropagation();
        if (!currentHovered) return;

        const html = currentHovered.outerHTML;
        const css = getComputedStyles(currentHovered);

        this.setState({
          isSelecting: false,
          selectedHtml: html,
          selectedCss: css,
        });

        cleanup();
        resolve({ html, css });
      };

      const onKey = (evt: KeyboardEvent) => {
        if (evt.key === 'Escape') {
          this.setState({ isSelecting: false });
          cleanup();
          resolve(null);
        }
      };

      const cleanup = () => {
        document.body.style.cursor = 'default';
        if (currentHovered) clearAllHighlights(currentHovered);
        enableInteractivity();

        document.removeEventListener('mouseover', onOver, true);
        document.removeEventListener('mouseout',  onOut,  true);
        document.removeEventListener('click',     onClick, true);
        document.removeEventListener('keydown',   onKey,   true);

        currentHovered = null;
      };

      document.addEventListener('mouseover', onOver, true);
      document.addEventListener('mouseout',  onOut,  true);
      document.addEventListener('click',     onClick, true);
      document.addEventListener('keydown',   onKey,   true);
    });
  }

  public stopSelection(): Promise<null> {
    if (!this.state.isSelecting) {
      return Promise.resolve(null);
    }
    this.setState({ isSelecting: false });
    return Promise.resolve(null);
  }
}

export const elementPickerLocalService = new ElementPickerLocalService();
export const useElementPicker = useWing;
