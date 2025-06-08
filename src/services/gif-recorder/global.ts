import { GlobalWing } from '@/lib/chrome-wings';
import { ensureOffscreenDocument } from '@/src/background';
import { startGifRecording, stopGifRecording } from '@/src/logic/gif-recorder';
import type { GifRecorderState } from './types';
import type { RecordingResponse } from '@/src/services/gif-recorder/types';

export class GifRecorderGlobalService extends GlobalWing<GifRecorderState> {
  constructor() {
    super('GifRecorder', {
      isRecording: false,
      status: '',
      gifUrl: null,
      fps: 10,
    });
  }

  public async startRecording(params: { fps: number }): Promise<RecordingResponse> {
    this.setState({
      fps: params.fps,
      isRecording: true,
      status: `Starting recording at ${params.fps} FPS…`,
    });

    await ensureOffscreenDocument();

    const resp = await startGifRecording({ fps: params.fps });

    if (resp.ok) {
      this.setState({ status: `Recording in progress at ${params.fps} FPS…` });
    } else {
      this.setState({
        isRecording: false,
        status: `Failed to start recording: ${resp.error}`,
      });
    }

    return resp;
  }

  public async stopRecording(): Promise<RecordingResponse> {
    this.setState({
      isRecording: false,
      status: 'Stopping recording…',
    });

    const resp = await stopGifRecording();

    if (resp.ok) {
      this.setState({
        status: 'Recording stopped.',
        gifUrl: resp.gifUrl || null,
      });
    } else {
      this.setState({
        status: `Failed to stop recording: ${resp.error}`,
      });
    }

    return resp;
  }
}

export const gifRecorderGlobalService = new GifRecorderGlobalService();
