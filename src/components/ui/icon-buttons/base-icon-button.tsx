import React from 'react';
import styled from 'styled-components';

import { Button } from 'primereact/button';

interface Props {
  icon: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  isPrimary?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const BaseIconButton: React.FC<Props> = ({ 
  icon, 
  onClick,
  isPrimary = false,
  disabled = false,
  className,
  style,
}) => {
  return (
    <ButtonSmall 
      $isPrimary={isPrimary}
      disabled={disabled}
      className={className} 
      style={style}
      onClick={onClick}
    >
      {icon}
    </ButtonSmall>
  );
}

const ButtonSmall = styled(Button)<{ $isPrimary: boolean }>`
  border-radius: 0.25rem;
  height: 2rem;
  width: 2rem;
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  border: none;
  background: none;

  &:focus {
    box-shadow: none;
  }

  .icon * {
    fill: ${({ $isPrimary }) => $isPrimary ? 'var(--primary-color)' : 'var(--surface-500)'};
  }
`;

export { BaseIconButton };