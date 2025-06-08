import { GlobalWing } from '@/lib/chrome-wings';
import {
  highlightElements,
  removeAllHighlights,
  disableInteractivity,
  enableInteractivity,
  generateOptimizedSelector,
} from '@/src/logic/css-selector';
import type { CssSelectorState } from './types';

export class CssSelectorGlobalService extends GlobalWing<CssSelectorState> {
  private currentHovered: HTMLElement | null = null;

  constructor() {
    super('CssSelector', { isSelecting: false, selectedSelector: null });
  }

  public startSelection(): void {
    if (this.state.isSelecting) return;

    this.setState({ isSelecting: true, selectedSelector: null });
    disableInteractivity();
    document.body.style.cursor = 'crosshair';

    document.addEventListener('mouseover', this.handleOver, true);
    document.addEventListener('mouseout', this.handleOut, true);
    document.addEventListener('click', this.handleClick, true);
    document.addEventListener('keydown', this.handleKey, true);
  }

  public stopSelection(): void {
    if (!this.state.isSelecting) return;
    this.setState({ isSelecting: false });
    this.removeListeners();
  }

  private handleOver = (e: Event) => {
    if (!this.state.isSelecting) return;
    const el = e.target as HTMLElement;
    if (this.currentHovered) this.currentHovered.style.outline = '';
    el.style.outline = '2px solid blue';
    this.currentHovered = el;
  };

  private handleOut = (e: Event) => {
    if (!this.state.isSelecting) return;
    (e.target as HTMLElement).style.outline = '';
  };

  private handleClick = (e: Event) => {
    if (!this.state.isSelecting) return;
    e.preventDefault(); e.stopPropagation();
    removeAllHighlights();

    const el = e.target as HTMLElement;
    const selector = generateOptimizedSelector(el);
    this.setState({ isSelecting: false, selectedSelector: selector });
    this.removeListeners();
  };

  private handleKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape' && this.state.isSelecting) {
      this.stopSelection();
    }
  };

  private removeListeners(): void {
    document.body.style.cursor = 'default';
    enableInteractivity();
    removeAllHighlights();

    document.removeEventListener('mouseover', this.handleOver, true);
    document.removeEventListener('mouseout',  this.handleOut,  true);
    document.removeEventListener('click',     this.handleClick, true);
    document.removeEventListener('keydown',   this.handleKey,   true);

    this.currentHovered = null;
  }
}

export const cssSelectorGlobalService = new CssSelectorGlobalService();
