import { PickedColor } from "@/src/services/color-picker-service/types";

interface OverlayHandles {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  zoomCanvas: HTMLCanvasElement;
  zoomContext: CanvasRenderingContext2D;
  cursorOverlay: HTMLDivElement;
}

const SAMPLE_SIZE = 11;
const ZOOM_PIXELS = 110;

export function createOverlays(imageSrc: string): Promise<OverlayHandles> {
  return new Promise(resolve => {
    const canvas = document.createElement('canvas');
    const ctx    = canvas.getContext('2d')!;
    const img    = new Image();
    img.src      = imageSrc;
    img.onload = () => {

      canvas.width  = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);

      Object.assign(canvas.style, {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100%',
        height: '100%',
        zIndex: 9999,
        cursor: 'none',
        pointerEvents: 'auto',      
      });
      document.body.append(canvas);

      const zoomCanvas = document.createElement('canvas');
      zoomCanvas.width  = ZOOM_PIXELS;
      zoomCanvas.height = ZOOM_PIXELS;
      Object.assign(zoomCanvas.style, {
        position:      'fixed',
        pointerEvents: 'none',
        zIndex:        10000,
      });
      const zoomCtx = zoomCanvas.getContext('2d')!;
      document.body.append(zoomCanvas);

      const cursorOverlay = document.createElement('div');
      Object.assign(cursorOverlay.style, {
        position: 'fixed',
        width:    '1px',
        height:   '1px',
        border:   '1px solid red',
        transform:'translate(-50%,-50%)',
        pointerEvents: 'none',
        zIndex:    10001,
      });
      document.body.append(cursorOverlay);

      resolve({ canvas, context: ctx, zoomCanvas, zoomContext: zoomCtx, cursorOverlay });
    };
  });
}

export function updateOverlays(
  handles: OverlayHandles,
  clientX: number,
  clientY: number
): void {
  const { canvas, context, zoomCanvas, zoomContext, cursorOverlay } = handles;

  cursorOverlay.style.left = `${clientX}px`;
  cursorOverlay.style.top  = `${clientY}px`;

  const scaleX = canvas.width  / window.innerWidth;
  const scaleY = canvas.height / window.innerHeight;
  const half   = Math.floor(SAMPLE_SIZE / 2);
  const sx     = Math.max(0, Math.round(clientX * scaleX) - half);
  const sy     = Math.max(0, Math.round(clientY * scaleY) - half);

  try {
    const imgData = context.getImageData(sx, sy, SAMPLE_SIZE, SAMPLE_SIZE);

    zoomContext.imageSmoothingEnabled = false;
    zoomContext.clearRect(0, 0, ZOOM_PIXELS, ZOOM_PIXELS);
    zoomContext.putImageData(imgData, 0, 0);
    zoomContext.drawImage(
      zoomCanvas,
      0, 0, SAMPLE_SIZE, SAMPLE_SIZE,
      0, 0, ZOOM_PIXELS, ZOOM_PIXELS
    );

    const cell = ZOOM_PIXELS / SAMPLE_SIZE;
    zoomContext.strokeStyle = 'rgba(0,0,0,0.2)';
    zoomContext.lineWidth = 1;
    for (let i = 0; i <= SAMPLE_SIZE; i++) {

      zoomContext.beginPath();
      zoomContext.moveTo(i * cell, 0);
      zoomContext.lineTo(i * cell, ZOOM_PIXELS);
      zoomContext.stroke();

      zoomContext.beginPath();
      zoomContext.moveTo(0, i * cell);
      zoomContext.lineTo(ZOOM_PIXELS, i * cell);
      zoomContext.stroke();
    }

    zoomContext.strokeStyle = 'red';
    zoomContext.lineWidth = 2;
    zoomContext.strokeRect(
      half * cell + 1,
      half * cell + 1,
      cell - 2,
      cell - 2
    );
  } catch (e) {
    console.error('[ColorPicker] zoom error', e);
  }

  zoomCanvas.style.left = `${clientX + 15}px`;
  zoomCanvas.style.top  = `${clientY + 15}px`;
}

export function getPixelColor(
  canvas: HTMLCanvasElement,
  clientX: number,
  clientY: number
): PickedColor {
  const ctx    = canvas.getContext('2d')!;
  const scaleX = canvas.width  / window.innerWidth;
  const scaleY = canvas.height / window.innerHeight;

  const x = Math.floor(clientX * scaleX);
  const y = Math.floor(clientY * scaleY);
  const [r, g, b] = ctx.getImageData(x, y, 1, 1).data;
  const hex = `#${r.toString(16).padStart(2,'0')}${g.toString(16).padStart(2,'0')}${b.toString(16).padStart(2,'0')}`;
  return { r, g, b, hex };
}

export function cleanupOverlays(handles: OverlayHandles): void {
  [handles.zoomCanvas, handles.cursorOverlay, handles.canvas].forEach(el => {
    if (el.parentNode) el.parentNode.removeChild(el);
  });
}

export { OverlayHandles };
