import React from 'react';

import { Icon, IconProps } from './icon';

const AddIcon: React.FC<IconProps> = (props) => {
  return (
    <Icon {...props}>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M12 18.5C11.7239 18.5 11.5 18.2761 11.5 18V12.5H6C5.72386 12.5 5.5 12.2761 5.5 12C5.5 11.7239 5.72386 11.5 6 11.5H11.5V6C11.5 5.72386 11.7239 5.5 12 5.5C12.2761 5.5 12.5 5.72386 12.5 6V11.5H18C18.2761 11.5 18.5 11.7239 18.5 12C18.5 12.2761 18.2761 12.5 18 12.5H12.5V18C12.5 18.2761 12.2761 18.5 12 18.5Z" fill="#9CA3AF"/>
    </Icon>
  );
}

export { AddIcon };
