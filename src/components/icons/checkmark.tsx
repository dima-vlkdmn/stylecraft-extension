import React from 'react';

import { Icon, IconProps } from './icon';

const CheckmarkIcon: React.FC<IconProps> = ({ fill, ...rest }) => {
  return (
    <Icon {...rest}>
      <path 
        fill-rule="evenodd" 
        clip-rule="evenodd" 
        d="M17.2957 6.59683C17.5184 6.76013 17.5665 7.07303 17.4032 7.29572L10.0699 17.2957C9.97959 17.4188 9.83799 17.494 9.68541 17.4997C9.53284 17.5054 9.38601 17.4411 9.28675 17.3251L5.62008 13.0394C5.44056 12.8295 5.46513 12.5139 5.67496 12.3344C5.88479 12.1549 6.20042 12.1794 6.37994 12.3893L9.63651 16.1957L16.5968 6.70435C16.7601 6.48167 17.073 6.43353 17.2957 6.59683Z"
        fill={fill || 'currentColor'}
      />
    </Icon>
  );
}

export { CheckmarkIcon };
