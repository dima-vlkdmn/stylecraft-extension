import React from 'react';

import { BaseIconButton } from './base-icon-button';
import { CheckmarkIcon } from '../../icons/checkmark';
import { ErrorIcon } from '../../icons/error';

interface Props {
  linked: boolean;
  onToggle: () => void;
}

const LinkIconButton: React.FC<Props> = ({ linked, onToggle }) => {
  return (
    <BaseIconButton
      icon={linked ? (
        <ErrorIcon width='16' height='16' />
      ) : (
        <CheckmarkIcon width='16' height='16' />
      )}
      isPrimary
      onClick={onToggle}
    />
  );
};

export { LinkIconButton };
