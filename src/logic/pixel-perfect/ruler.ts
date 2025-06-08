import type { Point, RulerSettings } from '@/src/services/pixel-perfect-service/types';

let settings: RulerSettings;
let active = false;
let startPt: Point | null = null;
let currentLine: HTMLElement | null = null;
let currentLabel: HTMLElement | null = null;
const savedLines: HTMLElement[] = [];
const savedLabels: HTMLElement[] = [];

export function activateRuler(opts: RulerSettings) {
  settings = opts;
  if (active) return;
  active = true;
  document.body.style.cursor = 'crosshair';
  document.addEventListener('mousedown', onDown);
  document.addEventListener('mousemove', onMove);
  document.addEventListener('mouseup', onUp);
}

export function updateRulerSettings(opts: RulerSettings) {
  const prevShow = settings?.showMeasurement;
  settings = opts;

  if (prevShow !== settings.showMeasurement) {
    savedLabels.forEach(label => {
      label.style.display = settings.showMeasurement ? 'block' : 'none';
    });
  }
}

export function deactivateRuler() {
  if (!active) return;
  active = false;
  document.body.style.cursor = '';
  document.removeEventListener('mousedown', onDown);
  document.removeEventListener('mousemove', onMove);
  document.removeEventListener('mouseup', onUp);
  clearCurrent();
  savedLines.forEach(l => l.remove());
  savedLabels.forEach(l => l.remove());
  savedLines.length = 0;
  savedLabels.length = 0;
}

export function clearCurrent() {
  if (currentLine) { currentLine.remove(); currentLine = null; }
  if (currentLabel) { currentLabel.remove(); currentLabel = null; }
}

function onDown(e: MouseEvent) {
  e.preventDefault();
  startPt = { x: e.clientX, y: e.clientY };

  if (!settings.saveLines) {
    savedLines.forEach(l => l.remove());
    savedLabels.forEach(l => l.remove());
    savedLines.length = 0;
    savedLabels.length = 0;
  }

  clearCurrent();
}

function onMove(e: MouseEvent) {
  if (!startPt) return;
  const end = calcEnd(startPt, e);
  drawCurrent(startPt, end);
}

function onUp(e: MouseEvent) {
  if (!startPt) return;
  const end = calcEnd(startPt, e);

  if (settings.saveLines && currentLine && currentLabel) {
    savedLines.push(currentLine);
    savedLabels.push(currentLabel);
    if (!settings.showMeasurement) {
      currentLabel.style.display = 'none';
    }
    currentLine = null;
    currentLabel = null;
  }

  startPt = null;
}

function calcEnd(start: Point, e: MouseEvent): Point {
  let rawX = e.clientX, rawY = e.clientY;
  let dx = rawX - start.x, dy = rawY - start.y;

  if (e.shiftKey || settings.snapStraight) {
    const angleDeg = (Math.atan2(dy, dx) * 180) / Math.PI;
    if (Math.abs(angleDeg) < 22.5 || Math.abs(angleDeg) > 157.5) {
      rawY = start.y;
      dy = 0;
    } else if (Math.abs(angleDeg - 90) < 22.5 || Math.abs(angleDeg + 90) < 22.5) {
      rawX = start.x;
      dx = 0;
    } else {
      const dist = Math.hypot(dx, dy);
      const rad45 = Math.round(angleDeg / 45) * 45 * (Math.PI / 180);
      rawX = start.x + dist * Math.cos(rad45);
      rawY = start.y + dist * Math.sin(rad45);
      dx = rawX - start.x;
      dy = rawY - start.y;
    }
  }

  if (settings.enablePixelSnap && settings.pixelStep > 1) {
    const dist = Math.hypot(dx, dy);
    const quant = Math.round(dist / settings.pixelStep) * settings.pixelStep;
    if (dist > 0) {
      const ux = dx / dist, uy = dy / dist;
      rawX = start.x + ux * quant;
      rawY = start.y + uy * quant;
    }
  }

  return { x: rawX, y: rawY };
}

function drawCurrent(start: Point, end: Point) {
  clearCurrent();

  const dx = end.x - start.x, dy = end.y - start.y;
  const dist = Math.hypot(dx, dy);
  const angle = (Math.atan2(dy, dx) * 180) / Math.PI;

  // line
  currentLine = document.createElement('div');
  Object.assign(currentLine.style, {
    position:       'fixed',
    left:           `${start.x}px`,
    top:            `${start.y}px`,
    width:          `${dist}px`,
    height:         '2px',
    backgroundColor: settings.color,
    opacity:        String(settings.opacity),
    transform:      `rotate(${angle}deg)`,
    transformOrigin:'0 0',
    pointerEvents:  'none',
    zIndex:         '10000',
  });
  document.body.append(currentLine);

  // text
  if (settings.showMeasurement) {
    currentLabel = document.createElement('div');
    currentLabel.innerText = `${dist.toFixed(1)}px`;
    Object.assign(currentLabel.style, {
      position:       'fixed',
      left:           `${(start.x + end.x) / 2}px`,
      top:            `${(start.y + end.y) / 2 - 14}px`,
      backgroundColor:'black',
      color:          'white',
      padding:        '2px 4px',
      fontSize:       '12px',
      pointerEvents:  'none',
      zIndex:         '10000',
    });
    document.body.append(currentLabel);
  }
}
