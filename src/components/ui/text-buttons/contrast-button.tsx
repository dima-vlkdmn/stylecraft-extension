import React from 'react';

import { BaseTextButton } from './base-text-button';
import { AdjustIcon } from '../../icons/adjust';

interface Props {
  text: string;
  onClick: () => void;
  style?: React.CSSProperties;
  className?: string;
}

const ContrastTextButton: React.FC<Props> = ({ text, onClick, style, className }) => {
  return (
    <BaseTextButton
      text={text}
      icon={<AdjustIcon width="20" height="20" />}
      isPrimary={false}
      onClick={onClick}
      className={className}
      style={style}
    />
  );
};

export { ContrastTextButton };