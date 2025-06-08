import React from 'react';
import styled from 'styled-components';

import { Button } from 'primereact/button';

interface Props {
  text: string;
  icon?: React.ReactNode;
  onClick: () => void;
  disabled?: boolean;
  isPrimary?: boolean;
  className?: string;
  style?: React.CSSProperties;
}

const BaseTextButton: React.FC<Props> = ({
  text,
  icon,
  onClick,
  isPrimary = false,
  disabled = false,
  className,
  style,
}) => {
  return (
    <ButtonStyled 
      $isPrimary={isPrimary}
      disabled={disabled}
      className={className} 
      style={style}
      onClick={onClick}
    >
      {icon}

      <span>{text}</span>
    </ButtonStyled>
  );
}

const ButtonStyled = styled(Button)<{ $isPrimary: boolean }>`
  font-size: 0.875rem;
  padding: 0.25rem 0.5rem;
  width: fit-content;
  height: fit-content;
  min-height: 2rem;
  color: ${({ $isPrimary }) => $isPrimary ? 'var(--primary-color)' : 'var(--surface-500)'};
  border: 0.0625rem solid ${({ $isPrimary }) => $isPrimary ? 'var(--primary-color)' : 'var(--surface-border)'};
  background-color: var(--surface-50);
  border-radius: 0.25rem;

  .p-button-label {
    padding: 0;
  }

  .icon {
    margin-right: 0.25rem;
  }

  .icon * {
    fill: ${({ $isPrimary }) => $isPrimary ? 'var(--primary-color)' : 'var(--surface-500)'};
  }
`;

export { BaseTextButton };