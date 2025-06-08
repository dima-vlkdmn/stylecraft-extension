export function disableInteractivity(): void {
  if (!document.getElementById('disable-interactive-style')) {
    const style = document.createElement('style');
    style.id    = 'disable-interactive-style';
    style.textContent = `
      a, button, input, textarea, select {
        pointer-events: none !important;
      }
    `;
    document.head.appendChild(style);
  }
}

export function enableInteractivity(): void {
  document
    .getElementById('disable-interactive-style')
    ?.remove();
}

export function highlightElement(el: HTMLElement): void {
  el.style.outline = '2px solid blue';
}

export function removeHighlight(el: HTMLElement): void {
  el.style.outline = '';
}

export function clearAllHighlights(previous?: HTMLElement | null): void {
  if (previous) removeHighlight(previous);
}

export function getComputedStyles(el: HTMLElement): string {
  const computed = window.getComputedStyle(el);
  let cssText = '';
  for (let i = 0; i < computed.length; i++) {
    const prop = computed[i];
    cssText += `${prop}: ${computed.getPropertyValue(prop)};\n`;
  }
  return cssText;
}
