import React, { useState, useMemo } from 'react'
import styled, { keyframes } from 'styled-components'
import { PrimaryButton } from '../../ui/buttons/primary-button'
import { Title, Subtitle } from '../../ui/typography'
import { MainContainer } from '../../ui/containers'
import { SidePulse } from '@/lib/chrome-pulse/side-pulse'
import { useTabId } from '../../base/app'
import type {
  AccessibilityIssue,
  AccessibilitySummary
} from '@/src/services/accessibility-service/types'
import jsPDF from 'jspdf'

import { getColorForCategory } from '@/src/logic/accessibility'

const CATEGORIES = ['critical','contrast','alert','structure','aria','other'] as const
type Cat = typeof CATEGORIES[number]
const CAT_LABEL: Record<Cat,string> = {
  critical: 'Critical',
  contrast: 'Contrast',
  alert:    'Alert',
  structure:'Structure',
  aria:     'ARIA',
  other:    'Other'
}

function getColor(cat: Cat) {
  switch(cat){
    case 'critical':  return '#e32636'
    case 'contrast':  return '#ffb841'
    case 'alert':     return '#ffdc33'
    case 'structure': return '#4285b4'
    case 'aria':      return '#9966cc'
    default:          return '#a5a5a5'
  }
}

const pulse = new SidePulse('Accessibility')

const AccessibilityChecker: React.FC = () => {
  const tabId = useTabId()!
  const [issues, setIssues]   = useState<AccessibilityIssue[]>([])
  const [summary, setSummary] = useState<AccessibilitySummary|null>(null)
  const [filter, setFilter]   = useState<'all'|Cat>('all')

  const runAudit = async () => {
    const reply = await pulse.sendMessage<{
      issues: AccessibilityIssue[]
      summary: AccessibilitySummary
    }>('audit', { tabId })
    const sorted = [...reply.issues].sort((a,b) => a.index - b.index)
    setIssues(sorted)
    setSummary(reply.summary)
  }

  const highlight = () => {
    pulse.sendMessage('highlightCurrentIssues',{ tabId, issues })
  }
  const clearAll = () => {
    pulse.sendMessage('clearIssueHighlights',{ tabId })
    setIssues([]); setSummary(null)
  }
  const scrollTo = (idx: number) => {
    pulse.sendMessage('scrollTo',{ tabId, index: idx })
  }

  const byCat = useMemo(() => {
    const m = {
      critical:[], contrast:[], alert:[],
      structure:[], aria:[], other:[]
    } as Record<Cat,AccessibilityIssue[]>
    issues.forEach(i => m[i.category as Cat].push(i))
    return m
  },[issues])

  const display = filter==='all' ? issues : byCat[filter]

  const exportPDF = () => {
    const doc = new jsPDF({ unit:'pt', format:'letter' })
    doc.setFontSize(18)
    doc.text('Accessibility Report', 40, 40)

    let y = 70
    const cardW = 500
    const pad = 20

    display.forEach(issue => {
      // split description and selector
      const descLines = doc.splitTextToSize(issue.description, cardW - 120)
      const selector = issue.targets[0] || ''
      const selLines = selector
        ? doc.splitTextToSize(`Selector: ${selector}`, cardW - 120)
        : []

      let h =
        20 + // header height
        descLines.length * 12 +
        selLines.length * 10 +
        pad + // increased padding
        (issue.category === 'contrast' && issue.failColors ? 30 : 0)

      if (y + h > 770) {
        doc.addPage()
        y = 40
      }

      // background and border
      doc.setDrawColor(200)
      doc.setFillColor(255,255,255)
      doc.roundedRect(40, y, cardW, h, 4,4,'FD')

      // badge
      const bg = getColorForCategory(issue.category)
      doc.setFillColor(bg)
      doc.rect(46, y + 12, 24,24,'F')
      doc.setFontSize(12)
      doc.setTextColor('#fff')
      doc.text(String(issue.index), 58, y + 30, { align:'center' })

      // title
      doc.setFontSize(12)
      doc.setTextColor('#000')
      const title = `${CAT_LABEL[issue.category]}: ${issue.id}`
      doc.text(title, 80, y + 20, { maxWidth: cardW - 120 })

      // description
      doc.setFontSize(11)
      doc.text(descLines, 80, y + 35)

      // selector if present
      if (selLines.length) {
        const selY = y + 35 + descLines.length*12 + 5
        doc.setFontSize(10)
        doc.setTextColor('#555')
        doc.text(selLines, 80, selY)
      }

      // contrast swatches
      if (issue.category === 'contrast' && issue.failColors) {
        const { fg, bg: bb, ratio } = issue.failColors
        const swY = y + h - 25
        doc.setFillColor(fg); doc.rect(80, swY, 12,12,'F')
        doc.setFillColor(bb); doc.rect(100, swY,12,12,'F')
        doc.setFontSize(10)
        doc.setTextColor('#000')
        doc.text(`Ratio: ${ratio}`, 120, swY+10)
      }

      y += h + pad
    })

    doc.save('accessibility-report.pdf')
  }

  return (
    <MainContainer>
      <Title>Accessibility Checker</Title>
      <Subtitle>Audit & export detailed WCAG report</Subtitle>

      <ControlsRow>
        <PrimaryButton onClick={runAudit}>Run Audit</PrimaryButton>
        {issues.length > 0 && <>  
          <PrimaryButton onClick={highlight}>Highlight</PrimaryButton>
          <PrimaryButton onClick={clearAll}>Clear</PrimaryButton>
          <PrimaryButton onClick={exportPDF}>Export PDF</PrimaryButton>
        </>}
      </ControlsRow>

      {summary && (
        <>  
          <StatusText>  
            Violations: {summary.totalViolations} • Issues: {summary.totalIssues}
          </StatusText>

          <FilterRow>
            <FilterBtn
              active={filter==='all'}
              onClick={()=>setFilter('all')}
            >All</FilterBtn>
            {CATEGORIES.map(cat=>(
              <FilterBtn
                key={cat}
                active={filter===cat}
                onClick={()=>setFilter(cat)}
              >{CAT_LABEL[cat]}</FilterBtn>
            ))}
          </FilterRow>

          <List>
            {display.map(issue=>(
              <Card key={issue.index} onClick={()=>scrollTo(issue.index)}>  
                <Badge category={issue.category as Cat}>  
                  {issue.index}
                </Badge>
                <Info>  
                  <strong>{issue.id}</strong> — {issue.description}
                </Info>
              </Card>
            ))}
          </List>
        </>
      )}
    </MainContainer>
  )
}

const ControlsRow = styled.div`  
  display: flex;
  flex-wrap: wrap;
  gap: 8px;
  margin: 1rem 0;
`

const StatusText = styled.p`
  font-size: 1rem;
  margin-bottom: .5rem;
`

const FilterRow = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 6px;
  margin-bottom: .5rem;
`

const FilterBtn = styled.button<{active:boolean}>`
  padding: .25rem .5rem;
  background: ${p => p.active ? '#3498db' : '#eee'};
  color: ${p => p.active ? '#fff' : '#333'};
  border: none;
  border-radius: 4px;
  cursor: pointer;
`

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  margin-bottom: 1rem;
  animation: ${keyframes`
    from { opacity: 0; }
    to   { opacity: 1; }
  `} .3s ease-in;
`

const Card = styled.div`
  display: flex;
  align-items: center;
  padding: .5rem;
  background: #fff;
  border: 1px solid #ddd;
  border-radius: 6px;
  cursor: pointer;
  &:hover { background: rgba(0,0,0,0.03); }
`

const Badge = styled.div<{category:Cat}>`
  min-width: 28px;
  height: 28px;
  border-radius: 50%;
  background: ${p => getColor(p.category)};
  color: ${p => p.category==='alert' ? '#000' : '#fff'};
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;
  margin-right: .75rem;
`

const Info = styled.div`
  font-size: .9rem;
  line-height: 1.3;
`

export { AccessibilityChecker };