// src/services/pixel-perfect-service/types.ts
export interface FullGridSettings {
  enabled: boolean;
  cellSize: number;
  unit: string;
  color: string;
  opacity: number;    // ← новое поле
}

export interface ColumnsSettings {
  enabled: boolean;
  count: number;
  gutter: number;
  color: string;
  margin: number;
  opacity: number;    // ← новое поле
}

export interface GridSettings {
  full: FullGridSettings;
  columns: ColumnsSettings;
}

export interface RulerSettings {
  color: string;
  opacity: number;
  saveLines: boolean;
  snapStraight: boolean;
  enablePixelSnap: boolean;
  pixelStep: number;
  showMeasurement: boolean;
}

export interface MaskSettings {
  color: string;
  opacity: number;
  keepSelection: boolean;
}

export interface PointsSettings {
  pointRadius: number;
  /** Количество точек при Auto-Fit (по умолчанию 4) */
  pointCount?: number;
}

/**
 * Добавили:
 *  - cornerRadius? для rect
 * Убрали:
 *  - 'triangle' из списка mode
 */
// src/services/pixel-perfect-service/types.ts
export interface ShapeSettings {
  color: string;
  opacity: number;
  mode: 'rect' | 'oval' | 'circle';
  symmetric: boolean;
  cornerRadius: number;
}



export interface OverlaySettings {
  opacity: number;
}

export interface SelectedInfo {
  el: HTMLElement;
  width: number;
  height: number;
  padding: { top: string; right: string; bottom: string; left: string };
  margin:  { top: string; right: string; bottom: string; left: string };
  border:  { width: string; style: string; color: string };
}

export interface Point { x: number; y: number }

export interface Measurement { start: Point; end: Point; distance: number }

export interface PixelPerfectState {
  rulerActive: boolean;
  maskActive: boolean;
  pointsActive: boolean;
  shapeActive: boolean;
  overlayActive: boolean;
  rulerSettings: RulerSettings;
  maskSettings: MaskSettings;
  pointsSettings: PointsSettings;
  shapeSettings: ShapeSettings;
  overlaySettings: OverlaySettings;
  gridSettings: GridSettings;
  measurements: Measurement[];
}
