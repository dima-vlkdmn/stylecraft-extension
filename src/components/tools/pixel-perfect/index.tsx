import React, { useState } from 'react'
import { Title, Subtitle } from '../../ui/typography'
import { MainContainer }    from '../../ui/containers'
import { SidePulse }        from '@/lib/chrome-pulse/side-pulse'
import { useTabId }         from '../../base/app'
import { ModeSwitcher, ToolMode } from './switcher'
import { ToolSettingsPanel }      from './settings'
import {
  getRulerFields,
  getMaskFields,
  getPointsFields,
  getShapeFields,
  getGridFields
} from './settings-config'
import type {
  RulerSettings,
  MaskSettings,
  PointsSettings,
  ShapeSettings,
  GridSettings
} from '@/src/services/pixel-perfect-service/types'
import {
  faRuler, faMask, faMapPin,
  faShapes
} from '@fortawesome/free-solid-svg-icons'

const pixelPulse = new SidePulse('PixelPerfect')

const PixelPerfectTools: React.FC = () => {
  const tabId = useTabId()!

  const [mode, setMode] = useState<ToolMode>('ruler')
  const [rulerActive,  setRulerActive]  = useState(false)
  const [maskActive,   setMaskActive]   = useState(false)
  const [pointsActive, setPointsActive] = useState(false)
  const [shapeActive,  setShapeActive]  = useState(false)
  const [gridActive,   setGridActive]   = useState(false)

  const [rulerSettings, setRulerSettings] = useState<RulerSettings>({
    color:'#f00', opacity:1, saveLines:false,
    snapStraight:false, enablePixelSnap:false,
    pixelStep:1, showMeasurement:true
  })
  const [maskSettings,  setMaskSettings]  = useState<MaskSettings>({
    color:'blue', opacity:0.3, keepSelection:false
  })
  const [pointsSettings,setPointsSettings] = useState<PointsSettings>({pointRadius:4 })
  const [shapeSettings, setShapeSettings] = useState<ShapeSettings>({
    color:'blue',
    opacity:1,
    mode:'rect',
    symmetric:false,      
    cornerRadius:0        
  })
  const [gridSettings,  setGridSettings]  = useState<GridSettings>({
    full:    { enabled:false, cellSize:50, unit:'px', color:'rgba(0,0,0,0.1)', opacity:1 },
    columns: { enabled:false, count:12, gutter:20, color:'rgba(0,0,255,0.2)', margin:0, opacity:1 }
  })

  // Ruler
  const toggleRuler = async () => {
    if (rulerActive) {
      await pixelPulse.sendMessage('deactivateRuler', { tabId })
      setRulerActive(false)
    } else {
      await pixelPulse.sendMessage('activateRuler', { tabId })
      await pixelPulse.sendMessage('updateRulerSettings', { tabId, ...rulerSettings })
      setRulerActive(true)
    }
  }
  const updateRuler = async (patch: Partial<RulerSettings>) => {
    const next = { ...rulerSettings, ...patch }
    setRulerSettings(next)
    if (rulerActive) {
      await pixelPulse.sendMessage('updateRulerSettings', { tabId, ...next })
    }
  }

  // Mask
  const toggleMask = async () => {
    if (maskActive) {
      await pixelPulse.sendMessage('stopMaskMode', { tabId })
      setMaskActive(false)
    } else {
      await pixelPulse.sendMessage('startMaskMode', { tabId, ...maskSettings })
      setMaskActive(true)
    }
  }
  const updateMask = async (patch: Partial<MaskSettings>) => {
    const next = { ...maskSettings, ...patch }
    setMaskSettings(next)
    if (maskActive) {
      await pixelPulse.sendMessage('startMaskMode', { tabId, ...next })
    }
  }

  // Points
  const togglePoints = async () => {
    if (pointsActive) {
      await pixelPulse.sendMessage('stopPointsMode', { tabId })
      setPointsActive(false)
    } else {
      await pixelPulse.sendMessage('startPointsMode', {
        tabId,
        pointRadius: pointsSettings.pointRadius,
      })
      setPointsActive(true)
    }
  }
  const updatePoints = async (patch: Partial<PointsSettings>) => {
    const next = { ...pointsSettings, ...patch }
    setPointsSettings(next)
    if (pointsActive) {
      await pixelPulse.sendMessage('updatePointsSettings', {
        tabId,
        pointRadius: next.pointRadius,
      })
    }
  }

  // Shape
  const toggleShape = async () => {
    if (shapeActive) {
      await pixelPulse.sendMessage('stopShapeMode', { tabId })
      setShapeActive(false)
    } else {
      await pixelPulse.sendMessage('startShapeMode', { tabId, ...shapeSettings })
      setShapeActive(true)
    }
  }
  const updateShape = async (patch: Partial<ShapeSettings>) => {
    const next: ShapeSettings = { ...shapeSettings, ...patch }
    setShapeSettings(next)
    if (shapeActive) {
      await pixelPulse.sendMessage('startShapeMode', { tabId, ...next })
    }
  }

  // Grid
  const toggleGrid = async () => {
    const next = !gridActive
    setGridActive(next)
    await pixelPulse.sendMessage('updateGridSettings', {
      tabId,
      full:    { ...gridSettings.full, enabled: false },
      columns: { ...gridSettings.columns, enabled: next },
    })
  }
  const updateGrid = async (patch: Partial<GridSettings>) => {
    const next = {
      full:    { ...gridSettings.full,    ...patch.full    },
      columns: { ...gridSettings.columns, ...patch.columns },
    }
    setGridSettings(next)
    if (gridActive) {
      await pixelPulse.sendMessage('updateGridSettings', { tabId, ...next })
    }
  }

  // ─── Switch Mode ──────────────────────────────────────────────────────
  const switchMode = async (m: ToolMode) => {
    if (mode==='ruler'  && rulerActive)   await pixelPulse.sendMessage('deactivateRuler',{ tabId })
    if (mode==='mask'   && maskActive)    await pixelPulse.sendMessage('stopMaskMode',  { tabId })
    if (mode==='points' && pointsActive)  await pixelPulse.sendMessage('stopPointsMode',{ tabId })
    if (mode==='shape'  && shapeActive)   await pixelPulse.sendMessage('stopShapeMode', { tabId })
    setMode(m)
  }

  return (
    <MainContainer>
      <Title>Pixel Perfect Tools</Title>
      <Subtitle>Design measurements & grid</Subtitle>

      <ModeSwitcher
        currentMode={mode}
        options={[
          { mode:'ruler',  icon:faRuler  },
          { mode:'mask',   icon:faMask   },
          { mode:'points', icon:faMapPin },
          { mode:'shape',  icon:faShapes },
        ]}
        onSwitch={switchMode}
      />

      {mode==='ruler'  && <ToolSettingsPanel
          title="Ruler"
          status={rulerActive}
          toggleLabel={{on:'Stop Ruler',off:'Start Ruler'}}
          onToggle={toggleRuler}
          fields={getRulerFields(rulerSettings, updateRuler, tabId)}
      />}
      {mode==='mask'   && <ToolSettingsPanel
          title="Mask"
          status={maskActive}
          toggleLabel={{on:'Stop Mask',off:'Start Mask'}}
          onToggle={toggleMask}
          fields={getMaskFields(maskSettings, updateMask, tabId)}
      />}
      {mode==='points' && <ToolSettingsPanel
          title="Points"
          status={pointsActive}
          toggleLabel={{on:'Stop Points',off:'Start Points'}}
          onToggle={togglePoints}
          fields={getPointsFields(pointsSettings, updatePoints, tabId)}
      />}
      {mode==='shape'  && <ToolSettingsPanel
          title="Shape"
          status={shapeActive}
          toggleLabel={{on:'Stop Shape',off:'Start Shape'}}
          onToggle={toggleShape}
          fields={getShapeFields(shapeSettings, updateShape, tabId)}
      />}

      <ToolSettingsPanel
        title="Grid"
        status={gridActive}
        toggleLabel={{on:'Disable Grid',off:'Enable Grid'}}
        onToggle={toggleGrid}
        fields={getGridFields(gridSettings, updateGrid, tabId)}
      />
    </MainContainer>
  )
}

export { PixelPerfectTools };