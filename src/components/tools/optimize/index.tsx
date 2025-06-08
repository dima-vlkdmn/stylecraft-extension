import React, { useState, useEffect } from 'react';
import styled, { createGlobalStyle, keyframes } from 'styled-components';
import { MainContainer } from '../../ui/containers';
import { Title, Subtitle } from '../../ui/typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faCheckCircle, faTimesCircle,
  faSearch, faCompressAlt, faArchive
} from '@fortawesome/free-solid-svg-icons';
import { SidePulse } from '@/lib/chrome-pulse/side-pulse';
import { useTabId } from '../../base/app';
import type { LargeImage, OptimizeSummary } from '@/src/services/optimize-service/types';

const GlobalStyles = createGlobalStyle`
  .optimize-highlight {
    outline: 2px solid red;
    transition: outline 0.3s ease;
  }
`;

const fadeIn = keyframes`
  from { opacity: 0; }
  to   { opacity: 1; }
`;

const optimizePulse = new SidePulse('Optimize');

const OptimizeChecker: React.FC = () => {
  const tabId = useTabId()!;
  const [status, setStatus] = useState('');
  const [summary, setSummary] = useState<OptimizeSummary|null>(null);
  const [largeImages, setLargeImages] = useState<LargeImage[]>([]);
  const [recs, setRecs] = useState<string[]>([]);
  const [optimizedMap, setOptimizedMap] = useState<Record<number,string>>({});

  useEffect(() => {
    setStatus('');
    setSummary(null);
    setLargeImages([]);
    setRecs([]);
    setOptimizedMap({});
  }, [tabId]);

  const runAudit = async () => {
    setStatus('Running audit…');
    try {
      const reply = await optimizePulse.sendMessage<{
        summary: OptimizeSummary;
        largeImages: LargeImage[];
        recommendations: string[];
      }>('audit', { tabId });
      const data = Array.isArray(reply) ? reply[0] : reply;
      setSummary(data.summary);
      setLargeImages(data.largeImages);
      setRecs(data.recommendations);
      setStatus('Audit completed');
      await optimizePulse.sendMessage('showOverlays', { tabId });
    } catch (e: any) {
      setStatus(`Error: ${e.message}`);
    }
  };

  const clearOverlays = () => {
    optimizePulse.sendMessage('clearOverlays', { tabId });
    setStatus('Overlays cleared');
  };

  const scrollToImage = (idx: number) => {
    optimizePulse.sendMessage('scrollTo', { tabId, index: idx });
  };

  const compressAllHandler = async () => {
    setStatus('Compressing images…');
    try {
      const map = await optimizePulse.sendMessage<Record<number,string>>('compressAll', { tabId });
      setOptimizedMap(map);
      setStatus('Compression done');
    } catch (e: any) {
      setStatus(`Error: ${e.message}`);
    }
  };

  return (
    <MainContainer>
      <GlobalStyles/>
      <Title>Optimize Checker</Title>
      <Subtitle>Audit page & images, then compress offline</Subtitle>

      <ButtonRow>
        <IconButton onClick={runAudit}><FontAwesomeIcon icon={faSearch} /></IconButton>
        <IconButton onClick={clearOverlays}><FontAwesomeIcon icon={faCompressAlt} /></IconButton>
        {largeImages.length > 0 && (
          <IconButton onClick={compressAllHandler}><FontAwesomeIcon icon={faArchive} /></IconButton>
        )}
      </ButtonRow>

      {status && <StatusText>{status}</StatusText>}

      {summary && (
        <ReportContainer>
          <SectionTitle>Summary</SectionTitle>
          <Line><strong>HTTPS:</strong> {summary.isHttps
            ? <IconSuccess icon={faCheckCircle}/> 
            : <IconFail icon={faTimesCircle}/>}
          </Line>
          <Line><strong>Missing Headers:</strong> {summary.missingSecurityHeaders.length
            ? <><IconFail icon={faTimesCircle}/> {summary.missingSecurityHeaders.join(', ')}</>
            : <IconSuccess icon={faCheckCircle}/>}
          </Line>
          <Line><strong>Total Images:</strong> {summary.totalImages}</Line>
          <Line><strong>Large Images:</strong> {summary.largeImages > 0
            ? <><IconFail icon={faTimesCircle}/> {summary.largeImages}</>
            : <><IconSuccess icon={faCheckCircle}/> {summary.largeImages}</>}
          </Line>
          <Line><strong>Lazy-loaded:</strong> {summary.lazyLoadedLargeImages === summary.largeImages
            ? <><IconSuccess icon={faCheckCircle}/> {summary.lazyLoadedLargeImages}</>
            : <><IconFail icon={faTimesCircle}/> {summary.lazyLoadedLargeImages}</>}
          </Line>

          {largeImages.length > 0 && (
            <>
              <SectionTitle>Images</SectionTitle>
              <MarkersContainer>
                {largeImages.map(img => (
                  <MarkerButton key={img.index}
                    onClick={() => scrollToImage(img.index)}>
                    {img.index}
                  </MarkerButton>
                ))}
              </MarkersContainer>
            </>
          )}

          {Object.keys(optimizedMap).length > 0 && (
            <>
              <SectionTitle>Optimized Previews</SectionTitle>
              <MarkersContainer>
                {largeImages.map(img => (
                  <PreviewThumb key={img.index}>
                    <img src={optimizedMap[img.index]} alt={`opt-${img.index}`} />
                    <a href={optimizedMap[img.index]} download={`img${img.index}.webp`}>Download</a>
                  </PreviewThumb>
                ))}
              </MarkersContainer>
            </>
          )}

          {recs.length > 0 && (
            <>
              <SectionTitle>Recommendations</SectionTitle>
              <ul>
                {recs.map((r,i) => <li key={i}>{r}</li>)}
              </ul>
            </>
          )}
        </ReportContainer>
      )}
    </MainContainer>
  );
};

const ButtonRow = styled.div`
  display: flex; gap: 8px; align-items: center; margin: 1rem 0;
`;

const IconButton = styled.button`
  width: 36px; height: 36px;
  border: none; border-radius: 6px;
  background: #3498db; color: #fff;
  display: flex; align-items: center; justify-content: center;
  cursor: pointer; transition: background .2s;
  &:hover { background: #2980b9; }
`;

const StatusText = styled.p`
  font-weight: bold; margin: .5rem 0;
`;

const ReportContainer = styled.div`
  animation: ${fadeIn} .4s ease-in;
  border: 1px solid #ddd; border-radius: 6px;
  padding: 1rem; background: #fafafa;
`;

const SectionTitle = styled.h4`
  margin: .75rem 0 .5rem;
  color: #555;
`;

const Line = styled.div`
  display: flex; align-items: center; gap: 6px; margin: 4px 0;
`;

const IconSuccess = styled(FontAwesomeIcon)`color: green;`;
const IconFail    = styled(FontAwesomeIcon)`color: red;`;

const MarkersContainer = styled.div`
  display: flex; flex-wrap: wrap; gap: 6px; margin: .5rem 0;
`;

const MarkerButton = styled.button`
  width: 30px; height: 30px;
  border-radius: 4px; background: #e74c3c; color: #fff;
  border: none; cursor: pointer;
  display: flex; align-items: center; justify-content: center;
  transition: background .2s;
  &:hover { background: #c0392b; }
`;

const PreviewThumb = styled.div`
  display: flex; flex-direction: column; align-items: center; gap: 4px;
  img { max-width: 80px; border-radius: 4px; }
  a { font-size: 0.8rem; color: #3498db; }
`;

export { OptimizeChecker };