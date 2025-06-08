import React from 'react';

import { Icon, IconProps } from './icon';

const BurgerIcon: React.FC<IconProps> = (props) => {
  return (
    <Icon {...props}>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M4.5 11.5C4.22386 11.5 4 11.7239 4 12C4 12.2761 4.22386 12.5 4.5 12.5H19.5C19.7761 12.5 20 12.2761 20 12C20 11.7239 19.7761 11.5 19.5 11.5H4.5Z" fill="#9CA3AF"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M4.5 5.5C4.22386 5.5 4 5.72386 4 6C4 6.27614 4.22386 6.5 4.5 6.5H19.5C19.7761 6.5 20 6.27614 20 6C20 5.72386 19.7761 5.5 19.5 5.5H4.5Z" fill="#9CA3AF"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M4.5 17.5C4.22386 17.5 4 17.7239 4 18C4 18.2761 4.22386 18.5 4.5 18.5H19.5C19.7761 18.5 20 18.2761 20 18C20 17.7239 19.7761 17.5 19.5 17.5H4.5Z" fill="#9CA3AF"/>
    </Icon>
  );
}

export { BurgerIcon };
