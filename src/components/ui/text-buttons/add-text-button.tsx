import React from 'react';

import { BaseTextButton } from './base-text-button';
import { AddIcon } from '../../icons/add';

interface Props {
  text: string;
  onClick: () => void;
  style?: React.CSSProperties;
  className?: string;
}

const AddTextButton: React.FC<Props> = ({ text, onClick, style, className }) => {
  return (
    <BaseTextButton
      text={text}
      icon={<AddIcon width='20' height='20' />}
      isPrimary={false}
      onClick={onClick}
      className={className}
      style={style}
    />
  );
};

export { AddTextButton };
