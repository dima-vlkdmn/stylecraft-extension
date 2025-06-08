import React from 'react';

import { Icon, IconProps } from './icon';

const XIcon: React.FC<IconProps> = (props) => {
  return (
    <Icon {...props}>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M20 3H4C3.44772 3 3 3.44772 3 4V20C3 20.5523 3.44772 21 4 21H20C20.5523 21 21 20.5523 21 20V4C21 3.44772 20.5523 3 20 3ZM4 2C2.89543 2 2 2.89543 2 4V20C2 21.1046 2.89543 22 4 22H20C21.1046 22 22 21.1046 22 20V4C22 2.89543 21.1046 2 20 2H4Z" fill="#9CA3AF"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M6 6.5L14 17.5H18L9.5 6.5H6ZM7.96377 7.5L14.5092 16.5H15.9635L9.00896 7.5H7.96377Z" fill="#9CA3AF"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M6 17.5H8L11.5 13.5L10.5 12.5L6 17.5Z" fill="#9CA3AF"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M17.5 6.5H15.5L12 10.5L13 11.5L17.5 6.5Z" fill="#9CA3AF"/>
    </Icon>
  );
}

export { XIcon };
