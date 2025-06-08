import React from 'react';

import { Icon, IconProps } from './icon';

const ErrorIcon: React.FC<IconProps> = (props) => {
  return (
    <Icon {...props}>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M12 19C15.866 19 19 15.866 19 12C19 8.13401 15.866 5 12 5C8.13401 5 5 8.13401 5 12C5 15.866 8.13401 19 12 19ZM12 20C16.4183 20 20 16.4183 20 12C20 7.58172 16.4183 4 12 4C7.58172 4 4 7.58172 4 12C4 16.4183 7.58172 20 12 20Z" fill="#9CA3AF"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M12 7C12.2761 7 12.5 7.22386 12.5 7.5V12.5C12.5 12.7761 12.2761 13 12 13C11.7239 13 11.5 12.7761 11.5 12.5V7.5C11.5 7.22386 11.7239 7 12 7Z" fill="#9CA3AF"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M12 14.5C11.4477 14.5 11 14.9477 11 15.5C11 16.0523 11.4477 16.5 12 16.5C12.5523 16.5 13 16.0523 13 15.5C13 14.9477 12.5523 14.5 12 14.5Z" fill="#9CA3AF"/>
    </Icon>
  );
}

export { ErrorIcon };
