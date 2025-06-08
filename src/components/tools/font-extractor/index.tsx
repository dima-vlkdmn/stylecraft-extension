import React, { useState, useEffect, useCallback } from 'react'
import styled, { keyframes } from 'styled-components'
import { SidePulse } from '@/lib/chrome-pulse/side-pulse'
import type { Payload } from '@/lib/chrome-pulse/types'
import { useTabId } from '../../base/app'
import { MainContainer } from '../../ui/containers'
import { Title, Subtitle } from '../../ui/typography'
import { PrimaryButton } from '../../ui/buttons/primary-button'
import { CopyIconButton } from '../../ui/icon-buttons/copy-icon-button'
import type { FontUsage } from '@/src/services/font-service/types'

interface CategorySettings {
  fontFamily: string
  fontSize: number
  lineHeight: number
  fontWeight: string
  letterSpacing: number
}

const FontExtractor: React.FC = () => {
  const tabId = useTabId()!

  const [loading, setLoading] = useState(false)
  const [usages, setUsages] = useState<FontUsage[]>([])
  const [googleFonts, setGoogleFonts] = useState<string[]>([])
  const [localFonts, setLocalFonts] = useState<string[]>([])
  const [dropped, setDropped] = useState(false)
  const [isDragOver, setDragOver] = useState(false)
  const [dropError, setDropError] = useState<string | null>(null)

  const [mode, setMode] = useState<'categories' | 'marker'>('categories')
  const categories: FontUsage['primaryUsage'][] = [
    'Heading', 'Subheading', 'Action', 'Paragraph', 'Regular'
  ]
  const initialCatSettings = categories.reduce((acc, cat) => {
    acc[cat] = {
      fontFamily: '',
      fontSize: 16,
      lineHeight: 1.5,
      fontWeight: '400',
      letterSpacing: 0.1,
    }
    return acc
  }, {} as Record<FontUsage['primaryUsage'], CategorySettings>)
  const [catSettings, setCatSettings] = useState(initialCatSettings)

  const [selectedMarker, setSelectedMarker] = useState<string | null>(null)
  const [markerSettings, setMarkerSettings] = useState<CategorySettings>({
    fontFamily: '',
    fontSize: 16,
    lineHeight: 1.5,
    fontWeight: '400',
    letterSpacing: 0,
  })

  const [pulse] = useState(() =>
    new SidePulse('FontService', {
      selectElementFromPage: (payload: Payload) => {
        const { selector } = payload as { selector: string }
        setSelectedMarker(selector)
        setMode('marker')
      },
    })
  )

  useEffect(() => {
    ;(async () => {
      try {
        const gf = await pulse.sendMessage<string[]>('loadGoogleFonts', { tabId })
        setGoogleFonts(gf || [])
      } catch {}
      try {
        const lfInit = await pulse.sendMessage<string[]>('getLocalFonts', { tabId })
        setLocalFonts(lfInit || [])
      } catch {}
    })()
    void pulse.sendMessage('initLocalFontLoader', { tabId })
  }, [pulse, tabId])

  const handleScan = useCallback(async () => {
    setLoading(true)
    setUsages([])
    setSelectedMarker(null)

    const [scanRes, gf, lf] = await Promise.all([
      pulse.sendMessage<FontUsage[]>('scanFonts', { tabId }),
      pulse.sendMessage<string[]>('loadGoogleFonts', { tabId }),
      pulse.sendMessage<string[]>('getLocalFonts', { tabId }),
    ])
    setUsages(Array.isArray(scanRes) ? scanRes : [])
    setGoogleFonts(gf || [])
    setLocalFonts(lf || [])

    await pulse.sendMessage('annotatePageWithIcons', { tabId })

    setLoading(false)
  }, [pulse, tabId])

  const handleClear = useCallback(async () => {
    await pulse.sendMessage('clearFonts', { tabId })
    setUsages([])
    setSelectedMarker(null)
  }, [pulse, tabId])

  const onDrop = useCallback(async (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)

    const files = Array.from(e.dataTransfer.files)
    const bad = files.some(f => !/\.(ttf|woff2?|otf)$/i.test(f.name))
    if (bad) {
      setDropError('Unsupported file format')
      return
    }

    setDropError(null)
    setDropped(true)
    const buffers = await Promise.all(files.map(f => f.arrayBuffer()))
    const payloadFiles = files.map((f, i) => ({ name: f.name, buffer: buffers[i] }))
    await pulse.sendMessage('uploadLocalFonts', { tabId, files: payloadFiles })
    const lf = await pulse.sendMessage<string[]>('getLocalFonts', { tabId })
    setLocalFonts(lf || [])
  }, [pulse, tabId])

  const applyCategories = useCallback(async () => {
    await pulse.sendMessage('applyCategoryStyles', {
      tabId,
      settings: catSettings,
    })
  }, [pulse, tabId, catSettings])

  const applyMarker = useCallback(async () => {
    if (!selectedMarker) return
  
    await pulse.sendMessage('selectElement', {
      tabId,
      selector: selectedMarker
    })
  
    await pulse.sendMessage('applyElementStyle', {
      tabId,
      fontFamily:    markerSettings.fontFamily,
      fontSize:      `${markerSettings.fontSize}px`,
      lineHeight:    `${markerSettings.lineHeight}`,
      fontWeight:    markerSettings.fontWeight,
      letterSpacing: `${markerSettings.letterSpacing}px`,
    })
  }, [pulse, tabId, selectedMarker, markerSettings])
  
  

  return (
    <Container>
      <Title>Font Extractor</Title>
      <Subtitle>Manage page fonts</Subtitle>

      <ButtonRow>
        <PrimaryButton onClick={handleScan} disabled={loading}>
          {loading ? 'Scanning…' : 'Scan Fonts'}
        </PrimaryButton>
        <PrimaryButton onClick={handleClear} disabled={loading || !usages.length}>
          Clear Results
        </PrimaryButton>
      </ButtonRow>

      {usages.length > 0 && (
        <Section style={{ animationDelay: '0.2s' }}>
          <Subtitle>Found Fonts on Page</Subtitle>
          {categories.map((cat, gi) => {
            const fonts = usages.filter(u => u.primaryUsage === cat)
            if (!fonts.length) return null
            return (
              <div key={cat} style={{ marginTop: '1rem', animationDelay: `${0.2 + gi * 0.1}s` }}>
                <h4>{cat}</h4>
                <FontList>
                  {fonts.map(u => (
                    <FontItem key={u.fontFamily}>
                      <span>{u.fontFamily}</span>
                      <CopyIconButton text={u.fontFamily} />
                    </FontItem>
                  ))}
                </FontList>
              </div>
            )
          })}
        </Section>
      )}

      <Section>
        <Subtitle>Upload Custom Fonts</Subtitle>
        <DropArea
          dragOver={isDragOver}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={onDrop}
        >
          {dropError ?? (dropped ? 'Fonts loaded!' : 'Drag & drop .ttf/.woff/.woff2 here')}
        </DropArea>
      </Section>

      <Section>
        <ToggleBar>
          <ToggleButton active={mode === 'categories'} onClick={() => setMode('categories')}>
            By Categories
          </ToggleButton>
          <ToggleButton active={mode === 'marker'} onClick={() => setMode('marker')} disabled={!selectedMarker}>
            By Marker
          </ToggleButton>
        </ToggleBar>
      </Section>

      {mode === 'categories' && (
        <Section>
          <Subtitle>Category Settings</Subtitle>
          {categories.map(cat => (
            <div key={cat} style={{ marginBottom: '1rem' }}>
              <h4>{cat}</h4>
              <Label>Font:</Label>
              <Select
                value={catSettings[cat].fontFamily}
                onChange={e =>
                  setCatSettings(s => ({ ...s, [cat]: { ...s[cat], fontFamily: e.target.value } }))
                }
              >
                <option value="">— Select font —</option>
                {[...localFonts.map(f => `[Local] ${f}`), ...googleFonts].map(f => (
                  <option key={f} value={f}>{f}</option>
                ))}
              </Select>
              <Label>Size (px):</Label>
              <Input
                type="number" min={8}
                value={catSettings[cat].fontSize}
                onChange={e => setCatSettings(s => ({ ...s, [cat]: { ...s[cat], fontSize: +e.target.value } }))}
              />
              <Label>Line Height:</Label>
              <Input
                type="number" step={0.1} min={1}
                value={catSettings[cat].lineHeight}
                onChange={e => setCatSettings(s => ({ ...s, [cat]: { ...s[cat], lineHeight: +e.target.value } }))}
              />
              <Label>Weight:</Label>
              <Select
                value={catSettings[cat].fontWeight}
                onChange={e => setCatSettings(s => ({ ...s, [cat]: { ...s[cat], fontWeight: e.target.value } }))}
              >
                {['100','200','300','400','500','600','700','800','900'].map(w => (
                  <option key={w} value={w}>{w}</option>
                ))}
              </Select>
              <Label>Letter Spacing (px):</Label>
              <Input
                type="number" step={0.1}
                value={catSettings[cat].letterSpacing}
                onChange={e => setCatSettings(s => ({ ...s, [cat]: { ...s[cat], letterSpacing: +e.target.value } }))}
              />
            </div>
          ))}
          <PrimaryButton onClick={applyCategories}>Apply Categories</PrimaryButton>
        </Section>
      )}

      {mode === 'marker' && selectedMarker && (
        <Section>
          <Subtitle>Marker Settings</Subtitle>
          <p>Selected element: <code>{selectedMarker}</code></p>
          <Label>Font:</Label>
          <Select
            value={markerSettings.fontFamily}
            onChange={e => setMarkerSettings(s => ({ ...s, fontFamily: e.target.value }))}
          >
            <option value="">— Select font —</option>
            {[...localFonts.map(f => `[Local] ${f}`), ...googleFonts].map(f => (
              <option key={f} value={f}>{f}</option>
            ))}
          </Select>
          <Label>Size (px):</Label>
          <Input
            type="number" min={8}
            value={markerSettings.fontSize}
            onChange={e => setMarkerSettings(s => ({ ...s, fontSize: +e.target.value }))}
          />
          <Label>Line Height:</Label>
          <Input
            type="number" step={0.1} min={1}
            value={markerSettings.lineHeight}
            onChange={e => setMarkerSettings(s => ({ ...s, lineHeight: +e.target.value }))}
          />
          <Label>Weight:</Label>
          <Select
            value={markerSettings.fontWeight}
            onChange={e => setMarkerSettings(s => ({ ...s, fontWeight: e.target.value }))}
          >
            {['100','200','300','400','500','600','700','800','900'].map(w => (
              <option key={w} value={w}>{w}</option>
            ))}
          </Select>
          <Label>Letter Spacing (px):</Label>
          <Input
            type="number" step={0.1}
            value={markerSettings.letterSpacing}
            onChange={e => setMarkerSettings(s => ({ ...s, letterSpacing: +e.target.value }))}
          />
          <PrimaryButton onClick={applyMarker}>Apply to Marker</PrimaryButton>
        </Section>
      )}
    </Container>
  )
}


const fadeIn = keyframes`
  from { opacity: 0 }
  to   { opacity: 1 }
`

const Container = styled(MainContainer)`
  padding: 1rem;
`
const Section = styled.section`
  margin-top: 1.5rem;
  opacity: 0;
  animation: ${fadeIn} 0.4s forwards;
`
const DropArea = styled.div<{ dragOver: boolean }>`
  margin: 1rem 0;
  padding: 1.5rem;
  border: 2px dashed #ccc;
  border-radius: 4px;
  text-align: center;
  color: #666;
  background: ${({ dragOver }) => (dragOver ? '#eef' : 'transparent')};
  transition: background 0.2s;
`
const ToggleBar = styled.div`
  display: flex;
  margin: 1rem 0;
  border-bottom: 1px solid #ddd;
`
const ToggleButton = styled.button<{ active: boolean }>`
  flex: 1;
  padding: 0.75rem;
  background: ${({ active }) => (active ? '#eef' : 'transparent')};
  border: none;
  border-bottom: ${({ active }) => (active ? '2px solid #4A90E2' : 'none')};
  cursor: pointer;
  font-weight: ${({ active }) => (active ? '600' : '400')};
`
const Label = styled.label`
  display: block;
  margin-top: 0.5rem;
  font-weight: 500;
`
const Input = styled.input`
  padding: 0.25rem 0.5rem;
  margin-right: 0.5rem;
  width: 100px;
`
const Select = styled.select`
  padding: 0.25rem 0.5rem;
  margin-right: 0.5rem;
`
const ButtonRow = styled.div`
  display: flex;
  gap: 1rem;
  margin-top: 1rem;
  flex-wrap: wrap;
`
const FontList = styled.ul`
  list-style: none;
  padding: 0;
  margin: 0;
`
const FontItem = styled.li`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 0.25rem;
  cursor: pointer;
  &:hover {
    background: #eef;
  }
`

export { FontExtractor };