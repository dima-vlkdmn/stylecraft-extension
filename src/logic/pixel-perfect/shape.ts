import type { Point, ShapeSettings } from '@/src/services/pixel-perfect-service/types';

let settings: ShapeSettings;
let active = false;
let startPt: Point | null = null;
const els: HTMLElement[] = [];
const lbls: HTMLElement[] = [];

export function startShapeMode(opts: ShapeSettings) {
  settings = opts;
  if (active) return;
  active = true;
  document.body.style.cursor = 'crosshair';
  document.addEventListener('mousedown', onDown);
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onUp);
}

export function stopShapeMode() {
  if (!active) return;
  active = false;
  document.body.style.cursor = '';
  document.removeEventListener('mousedown', onDown);
  document.removeEventListener('mousemove', onMove);
  document.removeEventListener('mouseup', onUp);
  clearCurrent();
}

export function updateShapeSettings(opts: ShapeSettings) {
  settings = opts;
}

function onDown(e: MouseEvent) {
  e.preventDefault();
  startPt = { x: e.clientX, y: e.clientY };
  clearCurrent();
}

function onMove(e: MouseEvent) {
  if (!startPt) return;
  const x1 = startPt.x, y1 = startPt.y;
  let dx = e.clientX - x1, dy = e.clientY - y1;

  if (settings.symmetric && e.shiftKey) {
    const s = Math.max(Math.abs(dx), Math.abs(dy));
    dx = s * Math.sign(dx);
    dy = s * Math.sign(dy);
  }

  const x2 = x1 + dx, y2 = y1 + dy;
  clearCurrent();

  const left   = Math.min(x1, x2),
        right  = Math.max(x1, x2),
        top    = Math.min(y1, y2),
        bottom = Math.max(y1, y2);
  const w = right - left, h = bottom - top;

  // RECTANGLE
  if (settings.mode === 'rect') {
    const div = document.createElement('div');
    Object.assign(div.style, {
      position:     'fixed',
      left:         `${left}px`,
      top:          `${top}px`,
      width:        `${w}px`,
      height:       `${h}px`,
      border:       `2px solid ${settings.color}`,
      borderRadius: `${settings.cornerRadius}px`,
      opacity:      `${settings.opacity}`,
      pointerEvents:'none',
      zIndex:       '10000',
    });
    document.body.append(div);
    els.push(div);

    const lbl = document.createElement('div');
    lbl.innerText = `${Math.round(w)}×${Math.round(h)}px`;
    Object.assign(lbl.style, {
      position:     'fixed',
      left:         `${left + w/2}px`,
      top:          `${top - 20}px`,
      background:   'black',
      color:        'white',
      padding:      '2px 4px',
      fontSize:     '12px',
      pointerEvents:'none',
      transform:    'translateX(-50%)',
      zIndex:       '10000',
    });
    document.body.append(lbl);
    lbls.push(lbl);
  }

  // OVAL or CIRCLE
  if (settings.mode === 'oval' || settings.mode === 'circle') {
    const div = document.createElement('div');
    Object.assign(div.style, {
      position:     'fixed',
      left:         `${left}px`,
      top:          `${top}px`,
      width:        `${w}px`,
      height:       `${h}px`,
      border:       `2px solid ${settings.color}`,
      borderRadius: settings.mode === 'circle' ? '50%' : '50% / 100%',
      opacity:      `${settings.opacity}`,
      pointerEvents:'none',
      zIndex:       '10000',
    });
    document.body.append(div);
    els.push(div);

    const lbl = document.createElement('div');
    if (settings.mode === 'circle') {
      lbl.innerText = `R=${Math.round(w/2)}px`;
    } else {
      lbl.innerText = `${Math.round(w)}×${Math.round(h)}px`;
    }
    Object.assign(lbl.style, {
      position:     'fixed',
      left:         `${left + w/2}px`,
      top:          `${top - 20}px`,
      background:   'black',
      color:        'white',
      padding:      '2px 4px',
      fontSize:     '12px',
      pointerEvents:'none',
      transform:    'translateX(-50%)',
      zIndex:       '10000',
    });
    document.body.append(lbl);
    lbls.push(lbl);
  }
}

function onUp() {
  startPt = null;
}

function clearCurrent() {
  els.forEach(e => e.remove());
  lbls.forEach(l => l.remove());
  els.length = 0;
  lbls.length = 0;
}
