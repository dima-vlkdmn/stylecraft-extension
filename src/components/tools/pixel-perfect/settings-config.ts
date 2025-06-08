import { SidePulse } from '@/lib/chrome-pulse/side-pulse'
import type {
  RulerSettings,
  GridSettings,
  MaskSettings,
  PointsSettings,
  ShapeSettings
} from '@/src/services/pixel-perfect-service/types'
import type { SettingField } from './settings'

const pixelPulse = new SidePulse('PixelPerfect')

/** ─── RULER ───────────────────────────────────────────────────────── */
export const getRulerFields = (
  settings: RulerSettings,
  onLocalChange: (patch: Partial<RulerSettings>) => void,
  tabId: number
): SettingField[] => [
  {
    key: 'color', type: 'color', label: 'Color', value: settings.color,
    onChange: v => {
      onLocalChange({ color: v })
      pixelPulse.sendMessage('updateRulerSettings', { tabId, ...settings, color: v })
    }
  },
  {
    key: 'opacity', type: 'range', label: 'Opacity', value: settings.opacity,
    props: { min: 0, max: 1, step: 0.01 },
    onChange: v => {
      const nv = +v
      onLocalChange({ opacity: nv })
      pixelPulse.sendMessage('updateRulerSettings', { tabId, ...settings, opacity: nv })
    }
  },
  {
    key: 'saveLines', type: 'checkbox', label: 'Save Lines', value: settings.saveLines,
    onChange: v => {
      onLocalChange({ saveLines: v })
      pixelPulse.sendMessage('updateRulerSettings', { tabId, ...settings, saveLines: v })
    }
  },
  {
    key: 'snapStraight', type: 'checkbox', label: 'Snap Straight', value: settings.snapStraight,
    onChange: v => {
      onLocalChange({ snapStraight: v })
      pixelPulse.sendMessage('updateRulerSettings', { tabId, ...settings, snapStraight: v })
    }
  },
  {
    key: 'enablePixelSnap', type: 'checkbox', label: 'Pixel Snap', value: settings.enablePixelSnap,
    onChange: v => {
      onLocalChange({ enablePixelSnap: v })
      pixelPulse.sendMessage('updateRulerSettings', { tabId, ...settings, enablePixelSnap: v })
    }
  },
  {
    key: 'pixelStep', type: 'number', label: 'Pixel Step', value: settings.pixelStep, props: { min: 1 },
    onChange: v => {
      const nv = +v
      onLocalChange({ pixelStep: nv })
      pixelPulse.sendMessage('updateRulerSettings', { tabId, ...settings, pixelStep: nv })
    }
  },
  {
    key: 'showMeasurement', type: 'checkbox', label: 'Show Measurement', value: settings.showMeasurement,
    onChange: v => {
      onLocalChange({ showMeasurement: v })
      pixelPulse.sendMessage('updateRulerSettings', { tabId, ...settings, showMeasurement: v })
    }
  },
]

/** ─── MASK ────────────────────────────────────────────────────────── */
export const getMaskFields = (
  settings: MaskSettings,
  onLocalChange: (patch: Partial<MaskSettings>) => void,
  tabId: number
): SettingField[] => [
  {
    key: 'color', type: 'color', label: 'Mask Color', value: settings.color,
    onChange: v => {
      onLocalChange({ color: v })
      pixelPulse.sendMessage('startMaskMode', { tabId, ...settings, color: v })
    }
  },
  {
    key: 'opacity', type: 'range', label: 'Opacity', value: settings.opacity,
    props: { min: 0, max: 1, step: 0.05 },
    onChange: v => {
      const nv = +v
      onLocalChange({ opacity: nv })
      pixelPulse.sendMessage('startMaskMode', { tabId, ...settings, opacity: nv })
    }
  },
  {
    key: 'keepSelection', type: 'checkbox', label: 'Keep Multiple Selections', value: settings.keepSelection,
    onChange: v => {
      onLocalChange({ keepSelection: v })
      pixelPulse.sendMessage('startMaskMode', { tabId, ...settings, keepSelection: v })
    }
  },
]

/** ─── POINTS ─────────────────────────────────────────────────────── */
export const getPointsFields = (
  settings: PointsSettings,
  onLocalChange: (patch: Partial<PointsSettings>) => void,
  tabId: number
): SettingField[] => [
  {
    key: 'pointRadius',
    type: 'number',
    label: 'Point Radius',
    value: settings.pointRadius,
    props: { min: 1 },
    onChange: v => {
      const nv = Number(v)
      onLocalChange({ pointRadius: nv })
      pixelPulse.sendMessage('updatePointsSettings', {
        tabId,
        pointRadius: nv
      })
    }
  }
]

/** ─── SHAPE ──────────────────────────────────────────────────────── */
export const getShapeFields = (
  settings: ShapeSettings,
  onLocalChange: (patch: Partial<ShapeSettings>) => void,
  tabId: number
): SettingField[] => {
  const fields: SettingField[] = [
    {
      key: 'color',
      type: 'color',
      label: 'Color',
      value: settings.color,
      onChange: v => {
        onLocalChange({ color: v })
        pixelPulse.sendMessage('startShapeMode', { tabId, ...settings, color: v })
      },
    },
    {
      key: 'opacity',
      type: 'range',
      label: 'Opacity',
      value: settings.opacity,
      props: { min: 0, max: 1, step: 0.01 },
      onChange: v => {
        const nv = +v
        onLocalChange({ opacity: nv })
        pixelPulse.sendMessage('startShapeMode', { tabId, ...settings, opacity: nv })
      },
    },
    {
      key: 'mode',
      type: 'select',
      label: 'Shape',
      value: settings.mode,
      props: {
        options: [
          { label: 'Rectangle', value: 'rect' },
          { label: 'Oval',      value: 'oval' },
          { label: 'Circle',    value: 'circle' },
        ],
      },
      onChange: v => {
        onLocalChange({ mode: v as any })
        pixelPulse.sendMessage('startShapeMode', { tabId, ...settings, mode: v })
      },
    },

    {
      key: 'symmetric',
      type: 'checkbox',
      label: 'Symmetric on Shift',
      value: settings.symmetric ?? false,
      onChange: v => {
        onLocalChange({ symmetric: v })
        pixelPulse.sendMessage('startShapeMode', { tabId, ...settings, symmetric: v })
      },
    },
  ]

  // only for rectangles
  if (settings.mode === 'rect') {
    fields.push({
      key: 'cornerRadius',
      type: 'number',
      label: 'Corner Radius',
      value: settings.cornerRadius ?? 0,
      props: { min: 0 },
      onChange: v => {
        const nv = +v
        onLocalChange({ cornerRadius: nv })
        pixelPulse.sendMessage('startShapeMode', { tabId, ...settings, cornerRadius: nv })
      },
    })
  }

  return fields
}

/** ─── GRID ───────────────────────────────────────────────────────── */
export const getGridFields = (
  settings: GridSettings,
  onLocalChange: (patch: Partial<GridSettings>) => void,
  tabId: number
): SettingField[] => [
  // Full Grid
  {
    key: 'full.enabled', type: 'checkbox', label: 'Full Grid', value: settings.full.enabled,
    onChange: v => {
      onLocalChange({ full: { ...settings.full, enabled: v } })
      pixelPulse.sendMessage('updateGridSettings', {
        tabId,
        full:    { ...settings.full, enabled: v },
        columns: { ...settings.columns }
      })
    }
  },
  {
    key: 'full.cellSize', type: 'number', label: 'Cell Size', value: settings.full.cellSize, props:{min:1},
    onChange: v => {
      const nv = +v
      onLocalChange({ full: { ...settings.full, cellSize: nv } })
      pixelPulse.sendMessage('updateGridSettings', {
        tabId,
        full:    { ...settings.full, cellSize: nv },
        columns: { ...settings.columns }
      })
    }
  },
  {
    key: 'full.unit', type: 'select', label: 'Unit', value: settings.full.unit,
    props:{ options:[{label:'px',value:'px'},{label:'%',value:'%'}] },
    onChange: v => {
      onLocalChange({ full: { ...settings.full, unit: v } })
      pixelPulse.sendMessage('updateGridSettings', {
        tabId,
        full:    { ...settings.full, unit: v },
        columns: { ...settings.columns }
      })
    }
  },
  {
    key: 'full.color', type: 'color', label: 'Full Color', value: settings.full.color,
    onChange: v => {
      onLocalChange({ full: { ...settings.full, color: v } })
      pixelPulse.sendMessage('updateGridSettings', {
        tabId,
        full:    { ...settings.full, color: v },
        columns: { ...settings.columns }
      })
    }
  },
  {
    key: 'full.opacity', type: 'range', label: 'Full Opacity', value: settings.full.opacity,
    props:{min:0,max:1,step:0.05},
    onChange: v => {
      const nv = +v
      onLocalChange({ full: { ...settings.full, opacity: nv } })
      pixelPulse.sendMessage('updateGridSettings', {
        tabId,
        full:    { ...settings.full, opacity: nv },
        columns: { ...settings.columns }
      })
    }
  },

  // Columns Grid
  {
    key: 'columns.enabled', type: 'checkbox', label: 'Columns Grid', value: settings.columns.enabled,
    onChange: v => {
      onLocalChange({ columns: { ...settings.columns, enabled: v } })
      pixelPulse.sendMessage('updateGridSettings', {
        tabId,
        full:    { ...settings.full },
        columns: { ...settings.columns, enabled: v }
      })
    }
  },
  {
    key: 'columns.count', type: 'number', label: 'Columns Count', value: settings.columns.count, props:{min:1},
    onChange: v => {
      const nv = +v
      onLocalChange({ columns: { ...settings.columns, count: nv } })
      pixelPulse.sendMessage('updateGridSettings', {
        tabId,
        full:    { ...settings.full },
        columns: { ...settings.columns, count: nv }
      })
    }
  },
  {
    key: 'columns.gutter', type: 'number', label: 'Gutter', value: settings.columns.gutter, props:{min:0},
    onChange: v => {
      const nv = +v
      onLocalChange({ columns: { ...settings.columns, gutter: nv } })
      pixelPulse.sendMessage('updateGridSettings', {
        tabId,
        full:    { ...settings.full },
        columns: { ...settings.columns, gutter: nv }
      })
    }
  },
  {
    key: 'columns.color', type: 'color', label: 'Column Color', value: settings.columns.color,
    onChange: v => {
      onLocalChange({ columns: { ...settings.columns, color: v } })
      pixelPulse.sendMessage('updateGridSettings', {
        tabId,
        full:    { ...settings.full },
        columns: { ...settings.columns, color: v }
      })
    }
  },
  {
    key: 'columns.margin', type: 'number', label: 'Side Margin', value: settings.columns.margin, props:{min:0},
    onChange: v => {
      const nv = +v
      onLocalChange({ columns: { ...settings.columns, margin: nv } })
      pixelPulse.sendMessage('updateGridSettings', {
        tabId,
        full:    { ...settings.full },
        columns: { ...settings.columns, margin: nv }
      })
    }
  },
  {
    key: 'columns.opacity', type: 'range', label: 'Columns Opacity', value: settings.columns.opacity,
    props:{min:0,max:1,step:0.05},
    onChange: v => {
      const nv = +v
      onLocalChange({ columns: { ...settings.columns, opacity: nv } })
      pixelPulse.sendMessage('updateGridSettings', {
        tabId,
        full:    { ...settings.full },
        columns: { ...settings.columns, opacity: nv }
      })
    }
  },
]