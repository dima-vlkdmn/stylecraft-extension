import React, { useState } from 'react'
import styled from 'styled-components'
import { PrimaryButton } from '../../ui/buttons/primary-button'
import { Title, Subtitle } from '../../ui/typography'
import { MainContainer } from '../../ui/containers'
import { SidePulse } from '@/lib/chrome-pulse/side-pulse'
import { useTabId } from '../../base/app'

const cssPulse = new SidePulse('CssSelector')

const CssSelector: React.FC = () => {
  const tabId = useTabId()!

  const [isSelecting, setIsSelecting] = useState(false)
  const [pickerStatus, setPickerStatus] = useState('')
  const [resultSelector, setResultSelector] = useState('')
  const [inputSelector, setInputSelector] = useState('')
  const [highlightStatus, setHighlightStatus] = useState('')

  const togglePicker = async () => {
    if (isSelecting) {
      await cssPulse.sendMessage('stopSelection', { tabId })
      setIsSelecting(false)
      setPickerStatus('Selection stopped.')
    } else {
      setIsSelecting(true)
      setPickerStatus('Click on the page to pick an element…')

      const { selector } = await cssPulse.sendMessage<{ selector: string | null }>(
        'startSelection',
        { tabId }
      )

      setIsSelecting(false)
      if (selector) {
        setResultSelector(selector)
        setPickerStatus('Selector extracted:')
      } else {
        setPickerStatus('Selection cancelled.')
      }
    }
  }

  const handleHighlight = async () => {
    if (!inputSelector.trim()) {
      setHighlightStatus('Please enter a selector.')
      return
    }
    const count = await cssPulse.sendMessage<number>(
      'highlightElements',
      { tabId, selector: inputSelector }
    )
    setHighlightStatus(
      count > 0
        ? `Highlighted ${count} element(s).`
        : 'Nothing matched.'
    )
  }

  return (
    <MainContainer>
      <Title>CSS Selector Picker</Title>
      <Subtitle>
        Click “Start Selection” then click any element to extract its selector.
      </Subtitle>

      <ButtonRow>
        <PrimaryButton onClick={togglePicker}>
          {isSelecting ? 'Stop Selection' : 'Start Selection'}
        </PrimaryButton>
      </ButtonRow>
      {pickerStatus && <StatusText>{pickerStatus}</StatusText>}

      {resultSelector && (
        <ResultContainer>
          <SectionTitle>Your selector:</SectionTitle>
          <SelectorText>{resultSelector}</SelectorText>
        </ResultContainer>
      )}

      <Divider />

      <Subtitle>Or highlight elements by selector:</Subtitle>
      <SearchRow>
        <Input
          placeholder="e.g. .header .logo"
          value={inputSelector}
          onChange={e => setInputSelector(e.target.value)}
        />
        <PrimaryButton onClick={handleHighlight}>
          Highlight
        </PrimaryButton>
      </SearchRow>
      {highlightStatus && <HighlightStatus>{highlightStatus}</HighlightStatus>}
    </MainContainer>
  )
}

const ButtonRow = styled.div`
  margin-top: 1rem;
  display: flex;
`

const StatusText = styled.p`
  margin-top: 1rem;
  font-size: 1rem;
  color: #333;
`

const Divider = styled.hr`
  margin: 1.5rem 0;
`

const ResultContainer = styled.div`
  margin-top: 1rem;
  width: 100%;
`

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  margin-bottom: 0.5rem;
  color: #555;
`

const SelectorText = styled.div`
  padding: 0.5rem;
  border: 1px solid #ddd;
  background: #f9f9f9;
  word-break: break-all;
`

const SearchRow = styled.div`
  display: flex;
  gap: 0.5rem;
  margin-top: 1rem;
`

const Input = styled.input`
  flex: 1;
  padding: 0.5rem;
`

const HighlightStatus = styled.p`
  margin-top: 0.5rem;
  color: #444;
  font-size: 0.9rem;
`

export { CssSelector };