import React from 'react';

interface IconProps {
  width?: string;
  height?: string;
  fill?: string;
  stroke?: string;
  strokeWidth?: string;
  className?: string;
  onClick?: () => void;
}

interface Props extends IconProps {
  children: React.ReactNode;
}

const Icon: React.FC<Props> = ({
  children,
  width = '24',
  height = '24',
  fill = 'none',
  className,
  onClick,
}) => {
  return (
    <svg
      width={width} 
      height={height}
      viewBox='0 0 24 24' 
      fill={fill}
      strokeWidth={0}
      xmlns='http://www.w3.org/2000/svg'
      className={`${className ? className : ''} icon`}
      onClick={onClick}
    >
      <style>
        {`
          * {
            transition: fill 0.3s;
          }
        `}
      </style>

      <defs>
        <linearGradient id="landing" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stop-color="#FE8667" />
          <stop offset="70%" stop-color="#F72687" />
          <stop offset="100%" stop-color="#3B2391" />
        </linearGradient>
      </defs>

      {children}
    </svg>
  );
}

export { Icon };

export type { IconProps };
