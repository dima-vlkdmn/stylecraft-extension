import React, { useState } from 'react';
import styled from 'styled-components';
import { copyToClipboard } from '../../../utils/copy';
import { Button } from 'primereact/button';

interface Props {
  text: string;
  label?: string;
  onCopyCallback?: () => void;
  iconColor?: string;
}

const CopyButton: React.FC<Props> = ({ text, label, onCopyCallback, iconColor = 'var(--primary-color)' }) => {
  const [copied, setCopied] = useState(false);
  const [icon, setIcon] = useState('pi pi-copy');

  const copyText = async () => {
    copyToClipboard(text, {
      onSuccess: () => {
        setIcon('pi pi-check');
        setCopied(true);

        setTimeout(() => {
          setIcon('pi pi-copy');
          setCopied(false);
        }, 3000);

        if (onCopyCallback) {
          onCopyCallback();
        }
      },
    });
  };

  return (
    <CopyButtonWrapper onClick={copyText}>
      <ButtonSmall icon={icon} iconColor={iconColor} />
      {label && <CopyText iconColor={iconColor}>{copied ? 'Copied' : label}</CopyText>}
    </CopyButtonWrapper>
  );
};

const CopyButtonWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;

const ButtonSmall = styled(Button)<{ iconColor: string }>`
  border-radius: 0.4rem;
  height: 2rem;
  width: 2rem;
  color: ${({ iconColor }) => iconColor};
  border: none;
  background: none;

  &:focus {
    box-shadow: none;
  }

  .pi {
    color: ${({ iconColor }) => iconColor};
  }
`;

const CopyText = styled.span<{ iconColor: string }>`
  margin-left: 0.2rem;
  color: ${({ iconColor }) => iconColor};
`;

export { CopyButton };