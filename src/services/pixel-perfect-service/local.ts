// src/services/pixel-perfect-local.service.ts

import { LocalWing } from '@/lib/chrome-wings'
import { useWing }    from '@/lib/react-wings'
import type {
  PixelPerfectState,
  GridSettings,
  MaskSettings,
  PointsSettings,
  ShapeSettings,
} from './types'
import {
  activateRuler,
  updateRulerSettings,
  deactivateRuler,
  clearCurrent as clearCurrentRuler,
} from '@/src/logic/pixel-perfect/ruler'
import {
  renderGrid,
  removeGrid,
  updateGridSettings as logicUpdateGrid,
  getGridSettings,
} from '@/src/logic/pixel-perfect/grid'
import {
  startMaskMode as logicStartMask,
  stopMaskMode  as logicStopMask,
} from '@/src/logic/pixel-perfect/mask'
import {
  startPointsMode as logicStartPoints,
  stopPointsMode  as logicStopPoints,
} from '@/src/logic/pixel-perfect/points'
import {
  startShapeMode as logicStartShape,
  stopShapeMode  as logicStopShape,
} from '@/src/logic/pixel-perfect/shape'

const INITIAL_STATE: PixelPerfectState = {
  rulerActive:   false,
  maskActive:    false,
  pointsActive:  false,
  shapeActive:   false,
  overlayActive: false,

  rulerSettings: {
    color: '#f00',
    opacity: 1,
    saveLines: false,
    snapStraight: false,
    enablePixelSnap: false,
    pixelStep: 1,
    showMeasurement: true,
  },

  maskSettings:    { color: '#00f', opacity: 0.3, keepSelection: false },
  pointsSettings:  { pointRadius: 4 },
  shapeSettings:   {
    color:        '#00f',
    opacity:      1,
    mode:         'rect',
    symmetric: false,
    cornerRadius: 0,
   },
  overlaySettings: { opacity: 0.5 },
  gridSettings:    getGridSettings(),
  measurements:    [],       // больше не используется локально
}

export class PixelPerfectLocalService extends LocalWing<PixelPerfectState> {
  constructor() {
    super('PixelPerfect', INITIAL_STATE)
    Object.assign(this.actions, {
      activateRuler:       this.activateRuler.bind(this),
      deactivateRuler:     this.deactivateRuler.bind(this),
      clearMeasurements:   this.clearMeasurements.bind(this),
      updateRulerSettings: this.updateRulerSettings.bind(this),

      activateGrid:        this.activateGrid.bind(this),
      deactivateGrid:      this.deactivateGrid.bind(this),
      updateGridSettings:  this.updateGridSettings.bind(this),

      startMaskMode:       this.startMaskMode.bind(this),
      stopMaskMode:        this.stopMaskMode.bind(this),
      updateMaskSettings:  this.updateMaskSettings.bind(this),

      startPointsMode:     this.startPointsMode.bind(this),
      stopPointsMode:      this.stopPointsMode.bind(this),
      updatePointsSettings:this.updatePointsSettings.bind(this),

      startShapeMode:      this.startShapeMode.bind(this),
      stopShapeMode:       this.stopShapeMode.bind(this),
      updateShapeSettings: this.updateShapeSettings.bind(this),
    })
  }

  // ─── RULER ─────────────────────────────────────────────────────

  activateRuler() {
    // Включаем режим линейки в content script
    activateRuler(this.state.rulerSettings)
    // Сбрасываем превью
    clearCurrentRuler()
    // Очищаем сохранённые измерения, если нужно
    if (!this.state.rulerSettings.saveLines) {
      this.setState({ measurements: [] })
    }
    this.setState({ rulerActive: true })
  }

  deactivateRuler() {
    // Выключаем режим линейки в content script
    deactivateRuler()
    clearCurrentRuler()
    this.setState({ rulerActive: false })
  }

  clearMeasurements() {
    // Просто очищаем всё в content script
    clearCurrentRuler()
    this.setState({ measurements: [] })
  }

  updateRulerSettings(payload: any) {
    const { tabId, ...patch } = payload as { tabId?: number } & Partial<PixelPerfectState['rulerSettings']>
    const next = { ...this.state.rulerSettings, ...patch }
    this.setState({ rulerSettings: next })
    // Обновляем настройки в content script
    updateRulerSettings(next)
    // Если линейка активна — сбрасываем текущее превью
    if (this.state.rulerActive) {
      clearCurrentRuler()
      if (!next.saveLines) {
        this.setState({ measurements: [] })
      }
    }
  }

  // ─── GRID ──────────────────────────────────────────────────────

  activateGrid() {
    this.setState({ overlayActive: true })
    renderGrid()
  }

  deactivateGrid() {
    this.setState({ overlayActive: false })
    removeGrid()
  }

  updateGridSettings(patch: Partial<GridSettings>) {
    logicUpdateGrid(patch)
    this.setState({ gridSettings: getGridSettings() })
  }

  // ─── MASK ──────────────────────────────────────────────────────

  startMaskMode(opts: MaskSettings) {
    this.setState({
      maskActive:    true,
      overlayActive: true,
      maskSettings:  { ...opts },
      overlaySettings:{ opacity: opts.opacity },
    })
    logicStartMask(opts)
  }

  stopMaskMode() {
    logicStopMask()
    this.setState({ maskActive: false, overlayActive: false })
  }

  updateMaskSettings(payload: any) {
    const { tabId, ...patch } = payload as { tabId?: number } & Partial<MaskSettings>
    const next = { ...this.state.maskSettings, ...patch }
    this.setState({ maskSettings: next })
    if (this.state.maskActive) {
      logicStopMask()
      logicStartMask(next)
    }
  }

  // ─── POINTS ────────────────────────────────────────────────────

  startPointsMode(opts: PointsSettings) {
    logicStartPoints(opts)
    this.setState({ pointsActive: true, pointsSettings: opts })
  }

  stopPointsMode() {
    logicStopPoints()
    this.setState({ pointsActive: false })
  }

  updatePointsSettings(payload: any) {
    const { tabId, ...patch } = payload as { tabId?: number } & Partial<PointsSettings>
    const next = { ...this.state.pointsSettings, ...patch }
    this.setState({ pointsSettings: next })
    if (this.state.pointsActive) {
      logicStopPoints()
      logicStartPoints(next)
    }
  }

  // ─── SHAPE ─────────────────────────────────────────────────────

  startShapeMode(opts: ShapeSettings) {
    logicStartShape(opts)
    this.setState({ shapeActive: true, shapeSettings: opts })
  }

  stopShapeMode() {
    logicStopShape()
    this.setState({ shapeActive: false })
  }

  updateShapeSettings(payload: any) {
    const { tabId, ...patch } = payload as { tabId?: number } & Partial<ShapeSettings>
    const next = { ...this.state.shapeSettings, ...patch }
    this.setState({ shapeSettings: next })
    if (this.state.shapeActive) {
      logicStopShape()
      logicStartShape(next)
    }
  }
}

export const pixelPerfectLocalService = new PixelPerfectLocalService()
export const usePixelPerfect = useWing
