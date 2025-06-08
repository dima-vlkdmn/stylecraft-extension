import React from 'react';
import styled, { keyframes } from 'styled-components';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faStar } from '@fortawesome/free-solid-svg-icons';

interface Props {
  onClick?: () => void;
  className?: string;
}

const Logo: React.FC<Props> = ({ onClick, className }) => {
  return (
    <Container
      href='https://stylecrafts.app'
      target='_blank'
      rel='noopener noreferrer'
      onClick={onClick}
      className={className}
    >
      <Text>StyleCrafts</Text>

      <StarIcon
        icon={faStar}
      />
    </Container>
  );
}

const scaleUpDown = keyframes`
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(0);
  }
  80% {
    transform: scale(1.5);
  }
  100% {
    transform: scale(1);
  }
`;

const Container = styled.a`
  position: relative;
  width: fit-content;
  cursor: pointer;
  text-decoration: none;
`;

const Text = styled.span`
  font-family: 'Delius Swash Caps', cursive;
  font-size: 1.5rem;
  user-select: none;
  background: linear-gradient(90deg, #ff1493, #ff69b4, #87cefa, #4682b4);
  -webkit-background-clip: text;
  color: transparent;
`;

const StarIcon = styled(FontAwesomeIcon)`
  position: absolute;
  top: 0.9rem;
  left: 2.25rem;
  font-size: 0.25rem;
  transform: rotate(180deg);
  color: #FF69B4;
  animation: ${scaleUpDown} 2s ease-out;
`;

export { Logo };
