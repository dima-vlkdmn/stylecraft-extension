import React, { useState, useRef } from 'react';
import styled, { keyframes } from 'styled-components';
import { SidePulse }       from '@/lib/chrome-pulse/side-pulse';
import { useTabId }        from '../../base/app';
import { MainContainer }   from '../../ui/containers';
import { Title, Subtitle } from '../../ui/typography';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {
  faPlay,
  faStop,
  faPause,
  faDownload,
} from '@fortawesome/free-solid-svg-icons';
import type { RecordingResponse } from '@/src/services/gif-recorder/types';

const gifPulse = new SidePulse('GifRecorder');
const SUPPORTED_FPS = [5, 10, 15, 24, 30, 60];

enum Status {
  Idle = 'Idle',
  Requesting = 'Requesting…',
  Recording = 'Recording…',
  Paused = 'Paused',
  Completed = 'Completed',
  Error = 'Error',
}

const GifRecorder: React.FC = () => {
  const tabId = useTabId()!;
  const [status, setStatus]           = useState<Status>(Status.Idle);
  const [isRecording, setIsRecording] = useState(false);
  const [gifUrl, setGifUrl]           = useState<string | null>(null);
  const [fps, setFps]                 = useState<number>(15);
  const videoRef = useRef<HTMLVideoElement>(null);

  const start = async () => {
    setStatus(Status.Requesting);
    try {
      const resp = await gifPulse.sendMessage<RecordingResponse>('start', { tabId, fps });
      if (!resp.ok) throw new Error(resp.error);
      setIsRecording(true);
      setGifUrl(null);
      setStatus(Status.Recording);
    } catch {
      setStatus(Status.Error);
    }
  };

  const stop = async () => {
    setStatus(Status.Requesting);
    try {
      const reply = await gifPulse.sendMessage<RecordingResponse>('stop', { tabId });
      const r = Array.isArray(reply) ? reply[0] : reply;
      if (!r.ok || !r.gifUrl) throw new Error(r.error || 'Unknown');
      setGifUrl(r.gifUrl);
      setStatus(Status.Completed);
    } catch {
      setStatus(Status.Error);
    } finally {
      setIsRecording(false);
    }
  };

  const pause = async () => {
    await gifPulse.sendMessage('pause', { tabId });
    setStatus(Status.Paused);
  };
  const resume = async () => {
    await gifPulse.sendMessage('resume', { tabId });
    setStatus(Status.Recording);
  };

  const download = () => {
    if (!gifUrl) return;
    const a = document.createElement('a');
    a.href = gifUrl;
    a.download = 'recording.gif';
    a.click();
  };

  return (
    <Container>
      <Title>GIF Recorder</Title>
      <Subtitle>Record the current page as a GIF</Subtitle>

      <Toolbar>
        <Group>
          <Label htmlFor="fps-select">FPS</Label>
          <Select
            id="fps-select"
            value={fps}
            onChange={e => setFps(+e.target.value)}
          >
            {SUPPORTED_FPS.map(v => (
              <option key={v} value={v}>{v}</option>
            ))}
          </Select>
        </Group>

        <IconButton
          onClick={isRecording ? stop : start}
          title={isRecording ? 'Stop' : 'Start'}
        >
          <FontAwesomeIcon icon={isRecording ? faStop : faPlay} />
        </IconButton>

        {isRecording && (
          <>
            <IconButton onClick={pause} title="Pause">
              <FontAwesomeIcon icon={faPause} />
            </IconButton>
            <IconButton onClick={resume} title="Resume">
              <FontAwesomeIcon icon={faPlay} />
            </IconButton>
          </>
        )}

        {!isRecording && status === Status.Completed && (
          <IconButton onClick={download} title="Download">
            <FontAwesomeIcon icon={faDownload} />
          </IconButton>
        )}
      </Toolbar>

      <StatusBadge status={status}>{status}</StatusBadge>

      {gifUrl && (
        <Preview>
          <Video ref={videoRef} src={gifUrl} controls />
        </Preview>
      )}
    </Container>
  );
};

const fadeIn = keyframes`
  from { opacity: 0 }
  to   { opacity: 1 }
`;

const Container = styled(MainContainer)`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const Toolbar = styled.div`
  display: flex;
  align-items: center;
  gap: 0.75rem;
`;

const Group = styled.div`
  display: flex;
  align-items: center;
  gap: 0.5rem;
`;

const Label = styled.label`
  font-weight: 500;
`;

const Select = styled.select`
  padding: 0.25rem 0.5rem;
  border-radius: 4px;
  border: 1px solid #ccc;
`;

const IconButton = styled.button`
  background: none;
  border: none;
  padding: 0.5rem;
  border-radius: 4px;
  cursor: pointer;
  color: #343a40;
  font-size: 1.25rem;

  &:hover {
    background: #f0f0f0;
  }
`;

const StatusBadge = styled.span<{ status: Status }>`
  display: inline-block;
  padding: 0.25rem 0.75rem;
  border-radius: 12px;
  font-size: 0.9rem;
  font-weight: 600;
  color: white;
  background-color: ${({ status }) => {
    switch (status) {
      case Status.Recording:   return '#28a745';
      case Status.Paused:      return '#ffc107';
      case Status.Error:       return '#dc3545';
      case Status.Requesting:  return '#17a2b8';
      default:                 return '#6c757d';
    }
  }};
  animation: ${fadeIn} 0.3s ease-in;
`;

const Preview = styled.div`
  margin-top: 1rem;
  display: flex;
  justify-content: center;
  animation: ${fadeIn} 0.5s ease-in;
`;

const Video = styled.video`
  width: 100%;
  max-width: 600px;
  border-radius: 8px;
  box-shadow: 0 2px 8px rgba(0,0,0,0.2);
`;

export { GifRecorder };