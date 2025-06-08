import React from 'react';

import { Icon, IconProps } from './icon';

const SendIcon: React.FC<IconProps> = (props) => {
  return (
    <Icon {...props}>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M19.2787 5.39893L14.2008 19.1817C13.9557 19.847 13.0097 19.8322 12.7855 19.1596L10.9686 13.709L5.51796 11.8921C4.84538 11.6679 4.83061 10.7219 5.49585 10.4768L19.2787 5.39893ZM11.936 13.4487L13.5088 18.1673L17.1788 8.20588L11.936 13.4487ZM16.4717 7.49878L11.2289 12.7416L6.51031 11.1688L16.4717 7.49878Z" fill="#9CA3AF"/>
    </Icon>
  );
}

export { SendIcon };
