import React, { useState } from 'react'
import styled, { keyframes } from 'styled-components'
import { SidePulse } from '@/lib/chrome-pulse/side-pulse'
import { useTabId } from '../../base/app'
import { MainContainer } from '../../ui/containers'
import { Title, Subtitle } from '../../ui/typography'
import { PrimaryButton } from '../../ui/buttons/primary-button'
import { CopyIconButton } from '../../ui/icon-buttons/copy-icon-button'
import { CopyTextButton } from '../../ui/text-buttons/copy-text-button'
import type { CategorizedPalette } from '@/src/services/palette-service/types'

const BRAND_PRESETS: Record<string,string[]> = {
  'Apple':    ['#A2AAAD', '#888888', '#333333', '#000000', '#FFFFFF'],
  'Google':   ['#4285F4', '#DB4437', '#F4B400', '#0F9D58', '#FFFFFF'],
  'Microsoft':['#00A4EF', '#F65314', '#7CBB00', '#FFBB00', '#737373'],
  'Amazon':   ['#FF9900', '#146EB4', '#232F3E', '#FFFFFF', '#555555'],
  'Netflix':  ['#E50914', '#221F1F', '#F5F5F1', '#000000', '#B81D24'],
  'Spotify':  ['#1DB954', '#191414', '#FFFFFF', '#1ED760', '#535353'],
}


const palettePulse = new SidePulse('Palette')

const PaletteExtractor: React.FC = () => {
  const tabId = useTabId()!
  const [palette, setPalette] = useState<CategorizedPalette>({
    backgroundColors: [],
    textColors: [],
    borderColors: [],
    additionalColors: [],
    actionColors: []
  })
  const [extracted, setExtracted] = useState(false)
  const [showPresets, setShowPresets] = useState(false)

  const onExtract = async () => {
    setExtracted(false)
    setPalette({
      backgroundColors: [],
      textColors: [],
      borderColors: [],
      additionalColors: [],
      actionColors: []
    })
    try {
      const raw = await palettePulse.sendMessage<CategorizedPalette>(
        'scanPalette',
        { tabId }
      )
      const limit = (arr: string[]) => arr.slice(0, 8)
      setPalette({
        backgroundColors: limit(raw.backgroundColors),
        textColors:       limit(raw.textColors),
        borderColors:     limit(raw.borderColors),
        additionalColors: limit(raw.additionalColors),
        actionColors:     limit(raw.actionColors),
      })
      setExtracted(true)
    } catch (err) {
      console.error('Palette extraction failed', err)
    }
  }

  const categories: Record<string, string[]> = {
    'Background Colors': palette.backgroundColors,
    'Text Colors':       palette.textColors,
    'Border Colors':     palette.borderColors,
    'Action Colors':     palette.actionColors,
    'Additional Colors': palette.additionalColors,
  }

  return (
    <Container>
      <Title>Palette Extractor</Title>
      <Subtitle>Extract detailed color palette from any website</Subtitle>

      <div>
        <ExtractButton onClick={onExtract}>
          {extracted ? 'Re-Extract Palette' : 'Extract Palette'}
        </ExtractButton>
        <PresetButton onClick={() => setShowPresets(v => !v)}>
          {showPresets ? 'Hide Presets' : 'Show Presets'}
        </PresetButton>
      </div>

      {showPresets && (
        <ColorsContainer>
          {Object.entries(BRAND_PRESETS).map(([brand, colors], ci) => (
            <CategoryContainer
              key={brand}
              style={{ animationDelay: `${0.3 + ci * 0.1}s` }}
            >
              <CategoryTitle>{brand}</CategoryTitle>
              <ColorsGrid>
                {colors.map((color, i) => (
                  <Color key={color} color={color} delay={i * 0.1}>
                    <CopyButtonContainer className="copy-button">
                      <CopyIconButton text={color} />
                    </CopyButtonContainer>
                  </Color>
                ))}
              </ColorsGrid>
              <StyledCopyTextButton
                text="Copy All"
                copyText={JSON.stringify(colors)}
                iconSize={16}
              />
            </CategoryContainer>
          ))}
        </ColorsContainer>
      )}

      {extracted && (
        <ColorsContainer>
          {Object.entries(categories).map(([category, colors], ci) =>
            colors.length > 0 ? (
              <CategoryContainer
                key={category}
                style={{ animationDelay: `${0.3 + ci * 0.1}s` }}
              >
                <CategoryTitle>{category}</CategoryTitle>
                <ColorsGrid>
                  {colors.map((color, i) => (
                    <Color key={`${color}-${i}`} color={color} delay={i * 0.1}>
                      <CopyButtonContainer className="copy-button">
                        <CopyIconButton text={color} />
                      </CopyButtonContainer>
                    </Color>
                  ))}
                </ColorsGrid>
                <StyledCopyTextButton
                  text="Copy All Colors"
                  copyText={JSON.stringify(colors)}
                  iconSize={16}
                />
              </CategoryContainer>
            ) : null
          )}
        </ColorsContainer>
      )}
    </Container>
  )
}

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`

const Container = styled(MainContainer)`
  padding: 1rem;
`

const ExtractButton = styled(PrimaryButton)`
  margin-top: 1rem;
`

const PresetButton = styled(PrimaryButton)`
  margin-left: 1rem;
`

const ColorsContainer = styled.div`
  width: 100%;
  margin-top: 1rem;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
  gap: 2rem;
  opacity: 0;
  animation: ${fadeIn} 1s forwards;
  animation-delay: 0.2s;
`

const CategoryContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 1rem;
  opacity: 0;
  animation: ${fadeIn} 1s forwards;
  animation-fill-mode: forwards;
`

const CategoryTitle = styled.h3`
  margin: 0;
`

const ColorsGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  width: 10rem;
`

const Color = styled.div<{ color: string; delay: number }>`
  width: 2rem;
  height: 2rem;
  border: 1px solid var(--surface-border);
  border-radius: 4px;
  background-color: ${({ color }) => color};
  opacity: 0;
  position: relative;
  animation: ${fadeIn} 1s forwards;
  animation-delay: ${({ delay }) => delay}s;

  &:hover .copy-button {
    display: block;
  }
`

const CopyButtonContainer = styled.div`
  display: none;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
`

const StyledCopyTextButton = styled(CopyTextButton)`
  font-size: 0.7rem;
  padding: 0.25rem 0.5rem;
`

export { PaletteExtractor };