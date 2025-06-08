import type { RecordingResponse } from '@/src/services/gif-recorder/types';

export function startGifRecording(params: { fps: number }): Promise<RecordingResponse> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { target: 'offscreen',    action: 'startRecording', data: params },
      (resp: RecordingResponse) => {
        if (chrome.runtime.lastError) {
          return reject(new Error(chrome.runtime.lastError.message));
        }
        resolve(resp);
      }
    );
  });
}

export function stopGifRecording(): Promise<RecordingResponse> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { target: 'offscreen',    action: 'stopRecording' },
      (resp: RecordingResponse) => {
        if (chrome.runtime.lastError) {
          return reject(new Error(chrome.runtime.lastError.message));
        }
        resolve(resp);
      }
    );
  });
}
