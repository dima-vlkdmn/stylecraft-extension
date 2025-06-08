import React from 'react';

import { Icon, IconProps } from './icon';

const ExpandIcon: React.FC<IconProps> = (props) => {
  return (
    <Icon {...props}>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M12 5.5C12.2761 5.5 12.5 5.72386 12.5 6V16.7929L13.6464 15.6464C13.8417 15.4512 14.1583 15.4512 14.3536 15.6464C14.5488 15.8417 14.5488 16.1583 14.3536 16.3536L12 18.7071L9.64645 16.3536C9.45118 16.1583 9.45118 15.8417 9.64645 15.6464C9.84171 15.4512 10.1583 15.4512 10.3536 15.6464L11.5 16.7929V6C11.5 5.72386 11.7239 5.5 12 5.5Z" fill="#9CA3AF"/>
    </Icon>
  );
}

export { ExpandIcon };
