import React from 'react';

import { Icon, IconProps } from './icon';

const QREmailIcon: React.FC<IconProps> = (props) => {
  return (
    <Icon {...props}>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M5.5 8C5.5 7.17157 6.17157 6.5 7 6.5H17C17.8284 6.5 18.5 7.17157 18.5 8V16C18.5 16.8284 17.8284 17.5 17 17.5H7C6.17157 17.5 5.5 16.8284 5.5 16V8ZM7 7.5C6.72386 7.5 6.5 7.72386 6.5 8V16C6.5 16.2761 6.72386 16.5 7 16.5H17C17.2761 16.5 17.5 16.2761 17.5 16V8C17.5 7.72386 17.2761 7.5 17 7.5H7Z" fill="#9CA3AF"/>
      <path fill-rule="evenodd" clip-rule="evenodd" d="M6.0301 9.32913C6.12447 9.06961 6.41135 8.93573 6.67087 9.0301L11.8291 10.9058C11.9395 10.946 12.0605 10.946 12.1709 10.9058L17.3291 9.0301C17.5886 8.93573 17.8755 9.06961 17.9699 9.32913C18.0643 9.58865 17.9304 9.87553 17.6709 9.9699L12.5126 11.8456C12.1815 11.966 11.8185 11.966 11.4874 11.8456L6.32913 9.9699C6.06961 9.87553 5.93573 9.58865 6.0301 9.32913Z" fill="#9CA3AF"/>
    </Icon>
  );
}

export { QREmailIcon };
