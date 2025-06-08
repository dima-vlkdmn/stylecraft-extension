export function highlightElements(selector: string): number {
  const els = document.querySelectorAll<HTMLElement>(selector);
  els.forEach(el => el.style.outline = '2px dashed red');
  return els.length;
}

export function removeAllHighlights(): void {
  document
    .querySelectorAll<HTMLElement>('[style*="outline"]')
    .forEach(el => el.style.outline = '');
}

export function disableInteractivity(): void {
  const style = document.createElement('style');
  style.id = 'css-selector-disable-interactivity';
  style.textContent = `
    a, button, input, textarea, select {
      pointer-events: none !important;
    }
  `;
  document.head.appendChild(style);
}

export function enableInteractivity(): void {
  document
    .getElementById('css-selector-disable-interactivity')
    ?.remove();
}

export function generateOptimizedSelector(el: HTMLElement): string {
  const parts: string[] = [];
  let curr: HTMLElement | null = el;

  while (curr && curr.tagName.toLowerCase() !== 'html') {
    let part = curr.tagName.toLowerCase();
    if (curr.id) {
      part += `#${curr.id}`;
      parts.unshift(part);
      break;
    }
    const cls = curr.className
      .toString()
      .trim()
      .split(/\s+/)
      .join('.');
    if (cls) part += `.${cls}`;
    const parent = curr.parentElement;
    if (parent) {
      const idx = Array.prototype
        .indexOf.call(parent.children, curr) + 1;
      if (parent.children.length > 1) {
        part += `:nth-child(${idx})`;
      }
    }
    parts.unshift(part);
    curr = curr.parentElement;
  }

  return parts.join(' > ');
}
