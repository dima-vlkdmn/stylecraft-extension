export interface RecordingResponse {
  ok: boolean;
  error?: string;
  gifUrl?: string;
}

export interface GifRecorderState {
  isRecording: boolean;
  status: string;
  gifUrl: string | null;
  fps: number;
}
