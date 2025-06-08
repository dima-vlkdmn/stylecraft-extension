import React from 'react';

import { BaseIconButton } from './base-icon-button';
import { AddIcon } from '../../icons/add';

interface Props {
  onClick: () => void;
  disabled?: boolean;
}

const AddIconButton: React.FC<Props> = ({ onClick, disabled }) => {
  return (
    <BaseIconButton
      icon={<AddIcon />}
      onClick={onClick}
      disabled={disabled}
    />
  );
}

export { AddIconButton };