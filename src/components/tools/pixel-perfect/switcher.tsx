import React from 'react'
import styled from 'styled-components'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'

export type ToolMode = 'ruler' | 'mask' | 'points' | 'shape'
interface ModeOption {
  mode: ToolMode
  icon: any
}

interface ModeSwitcherProps {
  currentMode: ToolMode
  options: ModeOption[]
  onSwitch: (mode: ToolMode) => void
}

const ModeSwitcher: React.FC<ModeSwitcherProps> = ({ currentMode, options, onSwitch }) => (
  <SwitcherContainer>
    {options.map(({ mode, icon }) => (
      <SwitcherButton
        key={mode}
        active={currentMode === mode}
        onClick={() => onSwitch(mode)}
      >
        <FontAwesomeIcon icon={icon} />
      </SwitcherButton>
    ))}
  </SwitcherContainer>
)

const SwitcherContainer = styled.div`
  display: flex;
  gap: 0.5rem;
  justify-content: flex-start;
  margin-bottom: 1rem;
`

const SwitcherButton = styled.button<{ active: boolean }>`
  width: 2.5rem;
  height: 2.5rem;
  display: flex;
  align-items: center;
  justify-content: center;
  background: ${({ active }) => (active ? '#007bff' : 'transparent')};
  color: ${({ active }) => (active ? '#fff' : '#333')};
  border: 1px solid var(--surface-border);
  border-radius: 4px;
  cursor: pointer;
  font-size: 1.2rem;
`

export { ModeSwitcher };