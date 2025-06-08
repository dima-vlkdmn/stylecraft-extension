import type { MaskSettings, SelectedInfo, Point } from '@/src/services/pixel-perfect-service/types';

let cfg: MaskSettings | null = null;
let hoverEl: HTMLElement | null = null;
const overlays: HTMLElement[] = [];
const infos: SelectedInfo[] = [];
const measurements: HTMLElement[] = [];

export function startMaskMode(settings: MaskSettings): void {
  cfg = settings;
  document.body.style.cursor = 'crosshair';
  document.addEventListener('mouseover', onOver, true);
  document.addEventListener('mouseout',  onOut,  true);
  document.addEventListener('click',     onClick,true);
}

export function stopMaskMode(): void {
  document.body.style.cursor = '';
  document.removeEventListener('mouseover', onOver, true);
  document.removeEventListener('mouseout',  onOut,  true);
  document.removeEventListener('click',     onClick,true);
  clearHover();
  clearAll();
  cfg = null;
}

function onOver(e: Event) {
  if (!cfg) return;
  clearHover();
  const el = e.target as HTMLElement;
  const r  = el.getBoundingClientRect();
  hoverEl = document.createElement('div');
  Object.assign(hoverEl.style, {
    position:     'fixed',
    left:         `${r.left}px`,
    top:          `${r.top}px`,
    width:        `${r.width}px`,
    height:       `${r.height}px`,
    boxSizing:    'border-box',
    border:       `2px solid ${cfg.color}`,
    opacity:      String(cfg.opacity),
    pointerEvents:'none',
    zIndex:       '10000',
  });
  document.body.append(hoverEl);
}

function onOut() {
  clearHover();
}

function onClick(e: MouseEvent) {
  if (!cfg) return;
  e.preventDefault(); e.stopPropagation();

  const el = e.target as HTMLElement;
  const r  = el.getBoundingClientRect();

  if (!cfg.keepSelection) {
    clearAll();
  }

  const ov = document.createElement('div');
  Object.assign(ov.style, {
    position:     'fixed',
    left:         `${r.left}px`,
    top:          `${r.top}px`,
    width:        `${r.width}px`,
    height:       `${r.height}px`,
    boxSizing:    'border-box',
    border:       `2px dashed ${cfg.color}`,
    opacity:      String(cfg.opacity),
    pointerEvents:'none',
    zIndex:       '10000',
  });
  document.body.append(ov);
  overlays.push(ov);

  const cs = getComputedStyle(el);
  const info: SelectedInfo = {
    el,
    width:   el.offsetWidth,
    height:  el.offsetHeight,
    padding: {
      top:    cs.paddingTop,
      right:  cs.paddingRight,
      bottom: cs.paddingBottom,
      left:   cs.paddingLeft,
    },
    margin: {
      top:    cs.marginTop,
      right:  cs.marginRight,
      bottom: cs.marginBottom,
      left:   cs.marginLeft,
    },
    border: {
      width: cs.borderWidth,
      style: cs.borderStyle,
      color: cs.borderColor,
    },
  };
  infos.push(info);
  window.dispatchEvent(new CustomEvent('maskSelectionChanged', {
    detail: cfg.keepSelection ? infos.slice() : [info]
  }));

  if (overlays.length > 1) {
    const prevR = overlays[overlays.length - 2].getBoundingClientRect();
    const currR = r;
    drawSmartMeasure(prevR, currR);
  }
}

function drawSmartMeasure(r1: DOMRect, r2: DOMRect) {

  const xOverlap = !(r1.right < r2.left || r2.right < r1.left);
  const yOverlap = !(r1.bottom < r2.top || r2.bottom < r1.top);

  if (xOverlap) {
    const x = (Math.max(r1.left, r2.left) + Math.min(r1.right, r2.right)) / 2;
    const y1 = r1.bottom < r2.top ? r1.bottom : r1.top;
    const y2 = r1.bottom < r2.top ? r2.top    : r2.bottom;
    drawLine({ x, y: y1 }, { x, y: y2 }, `${Math.abs(y2 - y1).toFixed(1)}px`);
  } else if (yOverlap) {
    const y = (Math.max(r1.top, r2.top) + Math.min(r1.bottom, r2.bottom)) / 2;
    const x1 = r1.right < r2.left ? r1.right : r1.left;
    const x2 = r1.right < r2.left ? r2.left  : r2.right;
    drawLine({ x: x1, y }, { x: x2, y }, `${Math.abs(x2 - x1).toFixed(1)}px`);
  } else {
    const from: Point = {
      x: r1.right < r2.left ? r1.right : r1.left,
      y: r1.bottom < r2.top ? r1.bottom : r1.top,
    };
    const mid: Point = { x: r2.left < r1.left ? r2.left : r2.right, y: from.y };
    const to:  Point = {
      x: mid.x,
      y: r2.bottom < r1.bottom ? r2.bottom : r2.top,
    };

    drawLine(from, mid, `${Math.abs(mid.x - from.x).toFixed(1)}px`);
    drawLine(mid,  to,  `${Math.abs(to.y   - mid.y).toFixed(1)}px`);
  }
}

function drawLine(a: Point, b: Point, label: string) {
  const dx   = b.x - a.x;
  const dy   = b.y - a.y;
  const len  = Math.hypot(dx, dy);
  const ang  = Math.atan2(dy, dx) * 180 / Math.PI;

  // line
  const ln = document.createElement('div');
  Object.assign(ln.style, {
    position:        'fixed',
    left:            `${a.x}px`,
    top:             `${a.y}px`,
    width:           `${len}px`,
    height:          '1px',
    backgroundColor: cfg!.color,
    transform:       `rotate(${ang}deg)`,
    transformOrigin: '0 0',
    pointerEvents:   'none',
    zIndex:          '10000',
  });
  document.body.append(ln);
  measurements.push(ln);

  // text
  const lbl = document.createElement('div');
  lbl.innerText = label;
  Object.assign(lbl.style, {
    position:        'fixed',
    left:            `${(a.x + b.x) / 2}px`,
    top:             `${(a.y + b.y) / 2 - 14}px`,
    backgroundColor: 'black',
    color:           'white',
    padding:         '2px 4px',
    fontSize:        '12px',
    pointerEvents:   'none',
    zIndex:          '10000',
  });
  document.body.append(lbl);
  measurements.push(lbl);
}

function clearHover() {
  hoverEl?.remove();
  hoverEl = null;
}

function clearAll() {
  overlays.forEach(o => o.remove());
  overlays.length = 0;
  infos.length    = 0;
  measurements.forEach(m => m.remove());
  measurements.length = 0;
}
