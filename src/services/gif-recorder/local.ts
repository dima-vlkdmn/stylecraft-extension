import { LocalWing } from '@/lib/chrome-wings';
import { useWing }    from '@/lib/react-wings';
import type { GifRecorderState } from './types';
import { startGifRecording, stopGifRecording } from '@/src/logic/gif-recorder';

export class GifRecorderLocalService extends LocalWing<GifRecorderState> {
  constructor() {
    super('GifRecorder', {
      isRecording: false,
      status: '',
      gifUrl: null,
      fps: 10,
    });

    this.actions.setFps = this.setFps.bind(this);
    this.actions.start  = this.start.bind(this);
    this.actions.stop   = this.stop.bind(this);
  }

  public setFps(fps: number): void {
    this.setState({ fps });
  }

  public async start(): Promise<void> {
    this.setState({ status: 'Starting recording...', isRecording: true, gifUrl: null });
    const resp = await startGifRecording({ fps: this.state.fps });
    if (resp.ok) {
      this.setState({ status: `Recording at ${this.state.fps} FPS…` });
    } else {
      this.setState({ status: `Failed to start: ${resp.error}`, isRecording: false });
    }
  }

  public async stop(): Promise<void> {
    this.setState({ status: 'Stopping recording…', isRecording: false });
    const resp = await stopGifRecording();
    if (resp.ok && resp.gifUrl) {
      this.setState({ status: 'Recording complete!', gifUrl: resp.gifUrl });
    } else {
      this.setState({ status: `Failed to stop: ${resp.error}` });
    }
  }
}

export const gifRecorderLocalService = new GifRecorderLocalService();
export const useGifRecorder = useWing;
