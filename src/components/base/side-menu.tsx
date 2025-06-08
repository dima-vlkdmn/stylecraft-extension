import React from 'react';
import styled, { css } from 'styled-components';

import { Tool } from './app';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

interface Props {
  tools: Tool[];
  activeToolId: string | null;
  onSelectTool: (id: string) => void;
}

const SideMenu: React.FC<Props> = ({ tools, activeToolId, onSelectTool }) => {
  return (
    <Container>
      {tools.map((tool) => (
        <MenuItem 
          key={tool.id}
          selected={activeToolId === tool.id}
          onClick={() => onSelectTool(tool.id)}
        >
          <Icon icon={tool.icon} />
        </MenuItem>  
      ))}
    </Container>
  );
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 2rem;
  height: 100%;
  padding-top: 4rem;
  overflow: hidden;
`;

const Icon = styled(FontAwesomeIcon)`
`;

const MenuItem = styled.div<{ selected: boolean }>`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 2rem;
  height: 2rem;
  cursor: pointer;

  ${Icon} {
    font-size: 1rem;
    color: var(--surface-500);
    transform: scale(1);
    transition: color 0.3s, transform 0.3s;
  }

  &:hover {
    ${Icon} {
      color: var(--surface-700);
      transform: scale(1.2);
    }
  }

  ${({ selected }) => selected && css`
    ${Icon}, &:hover ${Icon} {
      color: var(--primary-color);
    }
  `}
`;

export { SideMenu };