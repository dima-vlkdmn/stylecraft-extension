import { LocalWing } from '@/lib/chrome-wings';
import { useWing }    from '@/lib/react-wings';
import {
  disableInteractivity,
  enableInteractivity,
  generateOptimizedSelector,
  highlightElements,
  removeAllHighlights,
} from '@/src/logic/css-selector';
import type { CssSelectorState } from './types';

export class CssSelectorLocalService extends LocalWing<CssSelectorState> {
  constructor() {
    super('CssSelector', { isSelecting: false, selectedSelector: null });

    this.actions.startSelection = this.startSelection.bind(this);
    this.actions.stopSelection  = this.stopSelection.bind(this);
  }

  public startSelection(): Promise<string | null> {
    if (this.state.isSelecting) {
      return Promise.resolve(null);
    }

    this.setState({ isSelecting: true, selectedSelector: null });
    disableInteractivity();
    document.body.style.cursor = 'crosshair';

    return new Promise((resolve) => {
      let currentHovered: HTMLElement | null = null;

      const onMouseOver = (e: MouseEvent) => {
        const el = e.target as HTMLElement;
        if (currentHovered) {
          currentHovered.style.outline = '';
        }
        el.style.outline = '2px solid blue';
        currentHovered = el;
      };

      const onMouseOut = (e: MouseEvent) => {
        const el = e.target as HTMLElement;
        el.style.outline = '';
      };

      const onClick = (e: MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();

        removeAllHighlights();

        const el = e.target as HTMLElement;
        const selector = generateOptimizedSelector(el);
        this.setState({ isSelecting: false, selectedSelector: selector });
        cleanup();
        resolve(selector);
      };

      const onKeyDown = (e: KeyboardEvent) => {
        if (e.key === 'Escape') {
          this.setState({ isSelecting: false });
          cleanup();
          resolve(null);
        }
      };

      const cleanup = () => {
        document.body.style.cursor = 'default';
        removeAllHighlights();
        enableInteractivity();

        document.removeEventListener('mouseover', onMouseOver, true);
        document.removeEventListener('mouseout',  onMouseOut,  true);
        document.removeEventListener('click',     onClick,     true);
        document.removeEventListener('keydown',   onKeyDown,   true);

        if (currentHovered) {
          currentHovered.style.outline = '';
          currentHovered = null;
        }
      };

      document.addEventListener('mouseover', onMouseOver, true);
      document.addEventListener('mouseout',  onMouseOut,  true);
      document.addEventListener('click',     onClick,     true);
      document.addEventListener('keydown',   onKeyDown,   true);
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

export const cssSelectorLocalService = new CssSelectorLocalService();
export const useCssSelector = useWing;
