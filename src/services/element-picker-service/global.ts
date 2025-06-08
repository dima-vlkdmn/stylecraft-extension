import { GlobalWing } from '@/lib/chrome-wings';
import {
  disableInteractivity,
  enableInteractivity,
  highlightElement,
  clearAllHighlights,
  getComputedStyles,
  removeHighlight,
} from '@/src/logic/element-picker';
import type { ElementPickerState } from './types';

export class ElementPickerGlobalService extends GlobalWing<ElementPickerState> {
  private currentHovered: HTMLElement | null = null;

  constructor() {
    super('ElementPicker', {
      isSelecting: false,
      selectedHtml: null,
      selectedCss:  null,
    });
  }

  public startSelection(): void {
    if (this.state.isSelecting) return;
    this.setState({ isSelecting: true, selectedHtml: null, selectedCss: null });

    disableInteractivity();
    document.body.style.cursor = 'crosshair';

    document.addEventListener('mouseover', this.onOver, true);
    document.addEventListener('mouseout',  this.onOut,  true);
    document.addEventListener('click',     this.onClick, true);
    document.addEventListener('keydown',   this.onKey,   true);
  }

  public stopSelection(): void {
    if (!this.state.isSelecting) return;
    this.setState({ isSelecting: false });
    this.cleanup();
  }

  private onOver = (evt: Event): void => {
    if (!this.state.isSelecting) return;
    const el = evt.target as HTMLElement;
    clearAllHighlights(this.currentHovered);
    highlightElement(el);
    this.currentHovered = el;
  };

  private onOut = (evt: Event): void => {
    if (!this.state.isSelecting) return;
    const el = evt.target as HTMLElement;
    removeHighlight(el);
    if (this.currentHovered === el) this.currentHovered = null;
  };

  private onClick = (evt: Event): void => {
    if (!this.state.isSelecting) return;
    const e = evt as MouseEvent;
    e.preventDefault();
    e.stopPropagation();

    if (!this.currentHovered) return;
    const html = this.currentHovered.outerHTML;
    const css  = getComputedStyles(this.currentHovered);

    this.setState({
      isSelecting: false,
      selectedHtml: html,
      selectedCss:  css,
    });

    this.cleanup();
  };

  private onKey = (evt: Event): void => {
    const e = evt as KeyboardEvent;
    if (e.key === 'Escape' && this.state.isSelecting) {
      this.stopSelection();
    }
  };

  private cleanup(): void {
    document.body.style.cursor = 'default';
    clearAllHighlights(this.currentHovered);
    enableInteractivity();

    document.removeEventListener('mouseover', this.onOver, true);
    document.removeEventListener('mouseout',  this.onOut,  true);
    document.removeEventListener('click',     this.onClick, true);
    document.removeEventListener('keydown',   this.onKey,   true);

    this.currentHovered = null;
  }
}

export const elementPickerGlobalService = new ElementPickerGlobalService();
