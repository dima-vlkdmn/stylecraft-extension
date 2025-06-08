import React, { useState } from 'react';
import styled, { keyframes } from 'styled-components';

import { RefreshIcon } from '../../icons/refresh';
import { BaseIconButton } from './base-icon-button';

interface Props {
  onClick: () => void;
  disabled?: boolean;
}

const RefreshIconButton: React.FC<Props> = ({ onClick, disabled }) => {
  const [isRotating, setIsRotating] = useState(false);

  const handleClick = () => {
    if (!disabled) {
      setIsRotating(true);
      onClick();
      setTimeout(() => setIsRotating(false), 500); 
    }
  };

  return (
    <RotatingButton
      icon={<RefreshIcon />}
      onClick={handleClick}
      disabled={disabled}
      isRotating={isRotating}
    />
  );
}

const rotate = keyframes`
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
`;

const RotatingButton = styled(BaseIconButton)<{ isRotating: boolean }>`
  svg {
    animation: ${({ isRotating }) => (isRotating ? rotate : 'none')} 1s linear;
  }
`;

export { RefreshIconButton };
