import React, { useState } from 'react';
import styled from 'styled-components';

import { BaseIconButton } from './base-icon-button';
import { ShuffleIcon } from '../../icons/shuffle';

interface Props {
  onClick: () => void;
}

const ShuffleIconButton: React.FC<Props> = ({ onClick }) => {
  const [rotate, setRotate] = useState<boolean>(true);

  const handleClick = () => {
    setRotate(!rotate);
    onClick();
  };

  return (
    <IconButton
      $rotate={rotate}
      icon={<ShuffleIcon width='20' height='20' />}
      onClick={handleClick}
    />
  );
};

const IconButton = styled(BaseIconButton)<{ $rotate: boolean }>`
  padding: 0;
  transition: all 0.3s;

  &:hover {
    background-color: var(--surface-200);
  }

  .icon {
    transform: scaleY(${({ $rotate }) => ($rotate ? 1 : -1)});
    transition: transform 0.3s;
  }
`;

export { ShuffleIconButton };