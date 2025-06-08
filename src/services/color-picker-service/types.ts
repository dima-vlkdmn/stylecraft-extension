export interface PickedColor {
  r: number;
  g: number;
  b: number;
  hex: string;
}

export interface OverlayHandles {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  zoomCanvas: HTMLCanvasElement;
  zoomContext: CanvasRenderingContext2D;
  cursorOverlay: HTMLDivElement;
}

export interface ColorPickerState {
  isPicking: boolean;
  pickedColor: PickedColor | null;
}
