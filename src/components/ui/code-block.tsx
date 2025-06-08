import React from 'react';
import styled, { keyframes } from 'styled-components';
import { CopyButton } from '../ui/buttons/copy-button';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { okaidia } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeElementProps {
  code: string;
  language: string;
}

const CodeElement: React.FC<CodeElementProps> = ({ language, code }) => (
  <Element>
    <Header>
      <LanguageLabel>{language}</LanguageLabel>
      <CopyButtonContainer>
        <CopyButton text={code} iconColor="white" label="Copy code" />
      </CopyButtonContainer>
    </Header>

    <SyntaxWrapper>
      <SyntaxHighlighter
        language={language}
        style={okaidia}
        showLineNumbers
        wrapLongLines={false}      // отключаем перенос
        customStyle={{ margin: 0, background: 'transparent' }}
        codeTagProps={{ style: { fontFamily: 'monospace', fontSize: '0.65rem' } }}
      >
        {code}
      </SyntaxHighlighter>
    </SyntaxWrapper>
  </Element>
);

const fadeIn = keyframes`
  from { opacity: 0 }
  to   { opacity: 1 }
`;

const Element = styled.div`
  position: relative;
  width: 100%;
  margin: 1rem 0;
  animation: ${fadeIn} 0.5s ease-out;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
  border-radius: 0.25rem;
  overflow: hidden;
`;

const Header = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #2d2d2d;
  padding: 0.5rem 1rem;
`;

const LanguageLabel = styled.span`
  color: #eee;
  font-size: 0.875rem;
  font-weight: 500;
`;

const CopyButtonContainer = styled.div`
  display: flex;
  align-items: center;
`;

const SyntaxWrapper = styled.div`
  max-height: 15rem;
  overflow-y: auto;
  overflow-x: auto;
  background-color: #2d2d2d;
  white-space: pre;
`;

export { CodeElement };