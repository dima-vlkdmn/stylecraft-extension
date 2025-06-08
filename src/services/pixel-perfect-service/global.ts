// src/services/pixel-perfect-global.service.ts
import { GlobalWing } from '@/lib/chrome-wings'
import type {
  PixelPerfectState,
  RulerSettings,
  MaskSettings,
  PointsSettings,
  ShapeSettings,
  OverlaySettings,
  GridSettings,
  Measurement
} from './types'

const INITIAL_STATE: PixelPerfectState = {
  rulerActive: false,
  maskActive: false,
  pointsActive: false,
  shapeActive: false,
  overlayActive: false,

  rulerSettings: {
    color: 'red',
    opacity: 1,
    saveLines: false,
    snapStraight: false,
    enablePixelSnap: false,
    pixelStep: 1,
    showMeasurement: true,
  },

  maskSettings: {
    color: 'blue',
    opacity: 0.3,
    keepSelection: false,
  },

  pointsSettings: {
    pointRadius: 4,
  },

  shapeSettings: {
    color: 'blue',
    opacity: 1,
    mode: 'rect',
    symmetric: false,
    cornerRadius: 0,
  },

  overlaySettings: {
    opacity: 0.5,
  },

  gridSettings: {
    full: {
      enabled: false,
      cellSize: 50,
      unit: 'px',
      color: 'rgba(0,0,0,0.1)',
      opacity: 1,
    },
    columns: {
      enabled: false,
      count: 12,
      gutter: 20,
      color: 'rgba(0,0,255,0.2)',
      margin: 0,
      opacity: 1,
    },
  },

  measurements: [],
}

export class PixelPerfectGlobalService extends GlobalWing<PixelPerfectState> {
  constructor() {
    super('PixelPerfect', INITIAL_STATE)
  }

  // RULER
  setRulerActive(active: boolean) {
    this.setState({ rulerActive: active })
  }
  setRulerSettings(patch: Partial<RulerSettings>) {
    this.setState({
      rulerSettings: { ...this.state.rulerSettings, ...patch },
    })
  }
  clearMeasurements() {
    this.setState({ measurements: [] })
  }
  setMeasurements(ms: Measurement[]) {
    this.setState({ measurements: ms })
  }

  // MASK
  setMaskActive(active: boolean) {
    this.setState({ maskActive: active })
  }
  setMaskSettings(patch: Partial<MaskSettings>) {
    this.setState({
      maskSettings: { ...this.state.maskSettings, ...patch },
    })
  }

  // POINTS
  setPointsActive(active: boolean) {
    this.setState({ pointsActive: active })
  }
  setPointsSettings(patch: Partial<PointsSettings>) {
    this.setState({
      pointsSettings: { ...this.state.pointsSettings, ...patch },
    })
  }

  // SHAPE
  setShapeActive(active: boolean) {
    this.setState({ shapeActive: active })
  }
  setShapeSettings(patch: Partial<ShapeSettings>) {
    this.setState({
      shapeSettings: { ...this.state.shapeSettings, ...patch },
    })
  }

  // GRID
  setGridSettings(patch: Partial<GridSettings>) {
    this.setState({
      gridSettings: {
        full:    { ...this.state.gridSettings.full,    ...(patch.full    || {}) },
        columns: { ...this.state.gridSettings.columns, ...(patch.columns || {}) },
      },
    })
  }
}

export const pixelPerfectGlobalService = new PixelPerfectGlobalService()
