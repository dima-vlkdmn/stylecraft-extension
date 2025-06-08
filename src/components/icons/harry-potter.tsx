import React from 'react';

import { Icon, IconProps } from './icon';

const HarryPotterIcon: React.FC<IconProps> = (props) => {
  return (
    <Icon {...props}>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M12 6.25C12.0884 6.25 12.1703 6.2967 12.2152 6.37282L18.7152 17.3728C18.7609 17.4501 18.7616 17.5459 18.7171 17.6239C18.6726 17.7019 18.5898 17.75 18.5 17.75H5.5C5.41023 17.75 5.32736 17.7019 5.28286 17.6239C5.23837 17.5459 5.2391 17.4501 5.28477 17.3728L11.7848 6.37282C11.8297 6.2967 11.9116 6.25 12 6.25ZM5.93811 17.25H18.0619L12 6.99142L5.93811 17.25Z" fill="#9CA3AF"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M11.75 17.5V6.5H12.25V17.5H11.75Z" fill="#9CA3AF"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M12 17C13.7949 17 15.25 15.5449 15.25 13.75C15.25 11.9551 13.7949 10.5 12 10.5C10.2051 10.5 8.75 11.9551 8.75 13.75C8.75 15.5449 10.2051 17 12 17ZM12 17.5C14.0711 17.5 15.75 15.8211 15.75 13.75C15.75 11.6789 14.0711 10 12 10C9.92893 10 8.25 11.6789 8.25 13.75C8.25 15.8211 9.92893 17.5 12 17.5Z" fill="#9CA3AF"/>
    </Icon>
  );
}

export { HarryPotterIcon };
