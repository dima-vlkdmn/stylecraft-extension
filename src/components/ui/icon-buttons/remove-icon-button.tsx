import React from 'react';

import { BaseIconButton } from './base-icon-button';
import { RemoveIcon } from '../../icons/remove';

interface Props {
  onClick: () => void;
  disabled?: boolean;
}

const RemoveIconButton: React.FC<Props> = ({ onClick, disabled }) => {
  return (
    <BaseIconButton
      icon={<RemoveIcon />}
      onClick={onClick}
      disabled={disabled}
    />
  );
}

export { RemoveIconButton };