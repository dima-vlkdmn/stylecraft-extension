import React, { useMemo } from 'react';
import styled from 'styled-components';

import { GAService } from '@/src/services/google-analytics-service';
import { analyticsEvents } from '@/src/services/google-analytics-service/analytics-events';

import { CopyTextButton } from '../../ui/text-buttons/copy-text-button';
import { RefreshIcon } from '../../icons/refresh';
import { CopyIcon } from '../../icons/copy';

interface Props {
  palette: string[];
  onRemoveColor: (index: number) => void;
  onRefreshPalette: () => void;
  onColorClick?: (color: string) => void;
}

const Palette: React.FC<Props> = ({
  palette,
  onRemoveColor,
  onRefreshPalette,
  onColorClick,
}) => {
  const rowsCount = useMemo(() => {
    if (palette.length === 0) return 2;
    return Math.ceil((palette.length + 1) / 4);
  }, [palette]);

  const copyColor = (color: string) => {
    navigator.clipboard.writeText(color);
    GAService.logEvent(analyticsEvents.colors.blender.colorCopied(color));
  };

  const onCopyAll = () => {
    const text = JSON.stringify(palette).replace(/,/g, ', ');
    navigator.clipboard.writeText(text);
    GAService.logEvent(analyticsEvents.colors.blender.colorsCopied(text));
  };

  return (
    <Container>
      <PaletteGrid>
        {Array.from({ length: rowsCount * 4 }).map((_, idx) => {
          if (idx === rowsCount * 4 - 1) {
            return (
              <RefreshButton
                key={idx}
                onClick={onRefreshPalette}
                title="Refresh"
              >
                <RefreshIcon />
              </RefreshButton>
            );
          }

          const color = palette[idx];
          if (!color) {
            return <EmptyColorSquare key={idx} $backgroundColor="#ffffff" />;
          }

          return (
            <ColorSquare
              key={idx}
              $backgroundColor={color}
              onClick={() => copyColor(color)}
              onDoubleClick={() => onRemoveColor(idx)}
              onContextMenu={e => {
                e.preventDefault();
                onColorClick?.(color);
              }}
              title="Left-click: copy • Double-click: remove • Right-click: shades"
            >
              <Overlay>
                <ColorTooltip>{color}</ColorTooltip>
                <CopyIcon />
              </Overlay>
            </ColorSquare>
          );
        })}
      </PaletteGrid>

      <CopyTextButton
        text="Copy All"
        copyText={JSON.stringify(palette).replace(/,/g, ', ')}
        onCopyCallback={onCopyAll}
      />
    </Container>
  );
};

const Container = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
`;

const PaletteGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 0.5rem;
  margin-bottom: 0.5rem;
`;

const ColorSquare = styled.div.attrs<{ $backgroundColor: string }>(
  ({ $backgroundColor }) => ({
    style: { backgroundColor: $backgroundColor },
  })
)`
  width: 4rem;
  height: 4rem;
  position: relative;
  border-radius: 0.25rem;
  cursor: pointer;
`;

const EmptyColorSquare = styled(ColorSquare)`
  border: 1px solid var(--surface-300);
  background-color: transparent;
  cursor: default;
`;

const Overlay = styled.div`
  width: 100%;
  height: 100%;
  position: absolute;
  opacity: 0;
  transition: opacity 0.3s;
  display: flex;
  align-items: center;
  justify-content: space-between;
  flex-direction: column;
  padding: 0.5rem;
  background: var(--maskbg);
  border-radius: 0.25rem;

  ${ColorSquare}:hover & {
    opacity: 1;
  }

  > svg {
    color: var(--primary-color);
    font-size: 1rem;
  }
`;

const ColorTooltip = styled.div`
  color: var(--gray-50);
  padding: 0.25rem 0.5rem;
  border-radius: 0.25rem;
  font-size: 0.75rem;
  font-family: var(--font-mono);
`;

const RefreshButton = styled.button`
  width: 4rem;
  height: 4rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border: 1px solid var(--surface-300);
  border-radius: 0.25rem;
  background: transparent;
  cursor: pointer;
  color: var(--surface-300);
  transition: border-color 0.3s, color 0.3s;

  &:hover {
    border-color: var(--primary-color);
    color: var(--primary-color);
  }
`;

export { Palette };
