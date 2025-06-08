import type { CategorizedPalette } from '@/src/services/palette-service/types';

export function extractColors(): CategorizedPalette {
  const colorMap: Record<keyof CategorizedPalette, string[]> = {
    backgroundColors: [],
    textColors:       [],
    borderColors:     [],
    additionalColors: [],
    actionColors:     [],
  };

  const addColor = (color: string, cat: keyof CategorizedPalette) => {
    if (color && color !== 'rgba(0, 0, 0, 0)' && !colorMap[cat].includes(color)) {
      colorMap[cat].push(color);
    }
  };

  const processElement = (el: HTMLElement) => {
    const s = window.getComputedStyle(el);
    addColor(s.backgroundColor, 'backgroundColors');
    addColor(s.color,           'textColors');
    addColor(s.borderColor,     'borderColors');
    if (el.tagName === 'BUTTON' || el.tagName === 'A') {
      addColor(s.backgroundColor, 'actionColors');
      addColor(s.color,           'actionColors');
    } else {
      addColor(s.backgroundColor, 'additionalColors');
      addColor(s.color,           'additionalColors');
    }
  };

  processElement(document.body);
  document.querySelectorAll<HTMLElement>('*').forEach(processElement);

  return colorMap as CategorizedPalette;
}
