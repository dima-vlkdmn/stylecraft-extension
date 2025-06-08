import React from 'react';

import { Icon, IconProps } from './icon';

const RemoveIcon: React.FC<IconProps> = (props) => {
  return (
    <Icon {...props}>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M18.5 12C18.5 12.2761 18.2761 12.5 18 12.5H6C5.72386 12.5 5.5 12.2761 5.5 12C5.5 11.7239 5.72386 11.5 6 11.5H18C18.2761 11.5 18.5 11.7239 18.5 12Z" fill="#9CA3AF"/>
    </Icon>
  );
}

export { RemoveIcon };
