import React, { useState, useEffect } from 'react'
import styled, { keyframes } from 'styled-components'
import { SidePulse }         from '@/lib/chrome-pulse/side-pulse'
import { useTabId }          from '../../base/app'
import { MainContainer }     from '../../ui/containers'
import { Title, Subtitle }   from '../../ui/typography'
import { PrimaryButton }     from '../../ui/buttons/primary-button'
import { CodeElement }       from '../../ui/code-block'

const elementPulse = new SidePulse('ElementPicker')

const ElementPicker: React.FC = () => {
  const tabId = useTabId()!

  const [isSelecting, setIsSelecting]   = useState(false)
  const [pickerStatus, setPickerStatus] = useState('')
  const [selectedHtml, setSelectedHtml] = useState<string | null>(null)
  const [selectedCss, setSelectedCss]   = useState<string | null>(null)

  useEffect(() => {
    if (isSelecting) {
      setPickerStatus('Element selection mode activated. Click on any element.')
    } else if (selectedHtml) {
      setPickerStatus('Element selected and extracted.')
    } else {
      setPickerStatus('')
    }
  }, [isSelecting, selectedHtml])

  const togglePicker = async () => {
    if (isSelecting) {
      await elementPulse.sendMessage('stopElementSelection', { tabId })
      setIsSelecting(false)
      return
    }

    setIsSelecting(true)
    try {
      const { html, css } = await elementPulse.sendMessage<{
        html: string
        css:  string
      }>(
        'startElementSelection',
        { tabId }
      )
      setSelectedHtml(html)
      setSelectedCss(css)
    } catch (err) {
      console.error('Element selection failed', err)
    } finally {
      setIsSelecting(false)
    }
  }

  return (
    <MainContainer>
      <Title>Element Picker</Title>
      <Subtitle>
        Click the button to start element selection. When you click on any element,
        its HTML and CSS will be extracted.
      </Subtitle>

      <PrimaryButton onClick={togglePicker}>
        {isSelecting ? 'Stop Element Selection' : 'Start Element Selection'}
      </PrimaryButton>

      {pickerStatus && <StatusText>{pickerStatus}</StatusText>}

      {selectedHtml && selectedCss && (
        <ResultContainer>
          <PreviewContainer>
            <SectionTitle>Component Preview</SectionTitle>
            <Preview dangerouslySetInnerHTML={{ __html: selectedHtml }} />
          </PreviewContainer>
          <CodeContainer>
            <SectionTitle>Component Code</SectionTitle>
            <SubSectionTitle>HTML</SubSectionTitle>
            <CodeElement code={selectedHtml} language="html" />
            <SubSectionTitle>CSS</SubSectionTitle>
            <CodeElement code={selectedCss} language="css" />
          </CodeContainer>
        </ResultContainer>
      )}
    </MainContainer>
  )
}

const fadeIn = keyframes`
  from { opacity: 0 }
  to   { opacity: 1 }
`

const StatusText = styled.p`
  margin-top: 1rem;
  font-size: 1rem;
  color: #333;
`

const ResultContainer = styled.div`
  margin-top: 1.5rem;
  width: 100%;
  opacity: 0;
  animation: ${fadeIn} 0.4s forwards;
  animation-delay: 0.2s;
`

const PreviewContainer = styled.div`
  margin-bottom: 2rem;
`

const Preview = styled.div`
  border: 1px solid #ddd;
  padding: 1rem;
  background-color: #f9f9f9;
`

const CodeContainer = styled.div`
  margin-top: 1rem;
`

const SectionTitle = styled.h3`
  font-size: 1.2rem;
  margin: 1rem 0 0.5rem;
  color: #555;
`

const SubSectionTitle = styled.h4`
  font-size: 1rem;
  margin: 0.5rem 0;
  color: #666;
`

export { ElementPicker };