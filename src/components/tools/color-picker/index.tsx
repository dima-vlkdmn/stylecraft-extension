import React, { useState } from 'react'
import styled from 'styled-components'
import { PrimaryButton }     from '../../ui/buttons/primary-button'
import { Subtitle, Title }   from '../../ui/typography'
import { MainContainer }     from '../../ui/containers'
import { Palette }           from './palette'
import tinycolor from 'tinycolor2'
import { SidePulse }         from '@/lib/chrome-pulse/side-pulse'
import { useTabId }          from '../../base/app'
import type { PickedColor }  from '@/src/services/color-picker-service/types'
import { FaTimes }           from 'react-icons/fa'
import { CopyIconButton }    from '../../ui/icon-buttons/copy-icon-button'

interface ShadeGroupEntry {
  base: string;
  shades: string[];
}

const ColorPicker: React.FC = () => {
  const tabId = useTabId()!
  const [picked, setPicked]         = useState<string[]>([])
  const [shadeGroups, setShadeGroups] = useState<ShadeGroupEntry[]>([])
  const [isPicking, setPicking]     = useState(false)

  const pulse = new SidePulse('ColorPicker')

  const onPick = async () => {
    setPicking(true)
    try {
      const { hex } = await pulse.sendMessage<PickedColor>(
        'pickColor',
        { tabId }
      )
      setPicked(ps => [...ps, hex])
    } catch (err) {
      console.error('Pick failed', err)
    } finally {
      setPicking(false)
    }
  }

  const onCancel = () => {
    pulse.sendMessage('cancelPicking', { tabId })
    setPicking(false)
  }

  const onBaseContext = (color: string) => {

    const shades = Array.from({ length: 9 }, (_, i) =>
      tinycolor.mix(color, '#ffffff', (i + 1) * 10).toHexString()
    )
    setShadeGroups(groups => {
      const filtered = groups.filter(g => g.base !== color)
      const updated = [{ base: color, shades }, ...filtered]
      return updated.slice(0, 4)
    })
  }

  const removeGroup = (base: string) => {
    setShadeGroups(groups => groups.filter(g => g.base !== base))
  }

  const copyGroup = (shades: string[]) => {
    const text = shades.join(', ')
    navigator.clipboard.writeText(text)
  }

  return (
    <MainContainer>
      <Title>Color Picker</Title>
      <Subtitle>Pick a color from the page</Subtitle>

      <ButtonRow>
        <PrimaryButton onClick={onPick} disabled={isPicking}>
          {isPicking ? 'Picking…' : 'Pick Color'}
        </PrimaryButton>
        {isPicking && <CancelButton onClick={onCancel}>Cancel</CancelButton>}
      </ButtonRow>

      <Hint>Right-click a picked color to generate shades (max 4 groups)</Hint>

      <Palette
        palette={picked}
        onRemoveColor={i => setPicked(ps => ps.filter((_, idx) => idx !== i))}
        onRefreshPalette={() => setPicked([])}
        onColorClick={onBaseContext}
      />

      {shadeGroups.length > 0 && (
        <>
          <Subtitle style={{ marginTop: '1rem' }}>Shades</Subtitle>
          <ShadeGroups>
            {shadeGroups.map(group => (
              <ShadeGroup key={group.base}>
                <GroupTitle>
                  {group.base}
                  <ClearGroupButton
                    title="Remove shades"
                    onClick={() => removeGroup(group.base)}
                  >
                    <FaTimes size={12}/>
                  </ClearGroupButton>
                  <CopyIconButton
                    text={group.shades.join(', ')}
                    onCopyCallback={() => copyGroup(group.shades)}
                  />
                </GroupTitle>
                <ShadesRow>
                  {group.shades.map(col => (
                    <ShadeSquare key={col} color={col}>
                      <ShadeOverlay>
                        <CopyIconButton
                          text={col}
                          onCopyCallback={() => navigator.clipboard.writeText(col)}
                        />
                      </ShadeOverlay>
                    </ShadeSquare>
                  ))}
                </ShadesRow>
              </ShadeGroup>
            ))}
          </ShadeGroups>
        </>
      )}
    </MainContainer>
  )
}

const ButtonRow = styled.div`
  margin-top: 1rem;
  display: flex;
  gap: 8px;
  align-items: center;
`

const CancelButton = styled(PrimaryButton)`
  background: #f66;
  &:hover { background: #d44; }
`

const Hint = styled.div`
  margin-top: 0.5rem;
  font-size: 0.9rem;
  color: #666;
`

const ShadeGroups = styled.div`
  margin-top: 1rem;
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`

const ShadeGroup = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`

const GroupTitle = styled.div`
  display: flex;
  align-items: center;
  gap: 0.25rem;
  margin-bottom: 0.25rem;
  font-size: 0.9rem;
`

const ClearGroupButton = styled.button`
  background: transparent;
  border: none;
  color: #999;
  cursor: pointer;
  &:hover { color: #333; }
`

const ShadesRow = styled.div`
  display: flex;
  gap: 0.25rem;
`

const ShadeSquare = styled.div<{ color: string }>`
  position: relative;
  width: 2rem;
  height: 2rem;
  background-color: ${({ color }) => color};
  border-radius: 0.2rem;
  cursor: pointer;
  &:hover { filter: brightness(85%); }
`

const ShadeOverlay = styled.div`
  display: none;
  position: absolute;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  background: rgba(0, 0, 0, 0.3);
  align-items: center;
  justify-content: center;
  border-radius: 0.2rem;
  cursor: pointer;
  ${ShadeSquare}:hover & {
    display: flex;
  }
`

export { ColorPicker };