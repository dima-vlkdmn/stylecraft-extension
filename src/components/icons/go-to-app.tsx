import React from 'react';

import { Icon, IconProps } from './icon';

const GoToAppIcon: React.FC<IconProps> = (props) => {
  return (
    <Icon {...props}>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M6.76778 17.3743C6.96305 17.5695 7.27963 17.5695 7.47489 17.3743L16.3137 8.53545L15.8188 12.0003C15.7797 12.2736 15.9696 12.5269 16.243 12.566C16.5164 12.605 16.7696 12.4151 16.8087 12.1417L17.6101 6.53198L12.0004 7.33337C11.727 7.37242 11.5371 7.62569 11.5761 7.89906C11.6152 8.17242 11.8684 8.36237 12.1418 8.32332L15.6066 7.82834L6.76778 16.6672C6.57252 16.8624 6.57252 17.179 6.76778 17.3743Z" fill="#9CA3AF"/>
    </Icon>
  );
}

export { GoToAppIcon };
