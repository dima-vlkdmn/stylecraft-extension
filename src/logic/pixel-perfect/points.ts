import type { Point, PointsSettings } from '@/src/services/pixel-perfect-service/types';

let canvas: HTMLCanvasElement | null = null;
let ctx!: CanvasRenderingContext2D;
let pts: Point[] = [];
let settings!: PointsSettings;
let active = false;

export function startPointsMode(opts: PointsSettings) {
  if (active) return;
  active = true;
  settings = opts;
  pts = [];

  canvas = document.createElement('canvas');
  Object.assign(canvas.style, {
    position:      'fixed',
    top:           '0',
    left:          '0',
    width:         '100%',
    height:        '100%',
    pointerEvents: 'none',
    zIndex:        '10000',
  });
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
  document.body.appendChild(canvas);

  const maybeCtx = canvas.getContext('2d');
  if (!maybeCtx) throw new Error('Не удалось получить 2D-контекст у canvas');
  ctx = maybeCtx;

  document.addEventListener('click', onClick, true);
}

export function stopPointsMode() {
  if (!active) return;
  active = false;
  document.removeEventListener('click', onClick, true);
  canvas?.remove();
  canvas = null;
  pts = [];
}

export function updatePointsSettings(opts: PointsSettings) {
  settings = opts;
}

function onClick(e: MouseEvent) {
  e.preventDefault();
  e.stopPropagation();

  pts.push({ x: e.clientX, y: e.clientY });
  redraw();
}

function redraw() {
  if (!canvas) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  ctx.strokeStyle = 'red';
  ctx.fillStyle   = 'red';
  ctx.lineWidth   = 2;
  ctx.font        = '12px sans-serif';
  ctx.textAlign   = 'center';
  ctx.textBaseline= 'middle';

  pts.forEach((p, i) => {
    ctx.beginPath();
    ctx.arc(p.x, p.y, settings.pointRadius, 0, Math.PI * 2);
    ctx.fill();
    ctx.stroke();

    if (i > 0) {
      const prev = pts[i - 1];
      ctx.beginPath();
      ctx.moveTo(prev.x, prev.y);
      ctx.lineTo(p.x, p.y);
      ctx.stroke();

      const dist = Math.hypot(p.x - prev.x, p.y - prev.y).toFixed(1);
      const mx = (prev.x + p.x) / 2;
      const my = (prev.y + p.y) / 2 - 8;

      ctx.fillStyle = 'black';
      ctx.fillText(`${dist}px`, mx, my);
      ctx.fillStyle = 'red';
    }
  });
}
