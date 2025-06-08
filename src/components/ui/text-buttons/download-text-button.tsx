import React from 'react';

import { BaseTextButton } from './base-text-button';
import { DownloadIcon } from '../../icons/download';

interface Props {
  text?: string;
  onClick: () => void;
  style?: React.CSSProperties;
  className?: string;
}

const DownloadTextButton: React.FC<Props> = ({ text = 'Download', onClick, style, className }) => {
  return (
    <BaseTextButton
      text={text}
      icon={<DownloadIcon width='20' height='20' />}
      isPrimary
      onClick={onClick}
      className={className}
      style={style}
    />
  );
};

export { DownloadTextButton };
