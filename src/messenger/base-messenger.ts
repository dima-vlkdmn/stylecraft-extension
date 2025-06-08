import { IMessage } from './types';

export abstract class BaseMessenger {
  public abstract readonly target: string;

  public abstract handle(
    action: string,
    payload: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: any) => void
  ): boolean | void | Promise<boolean>;

  constructor() {
    chrome.runtime.onMessage.addListener(this.onMessage.bind(this));
  }

  private onMessage(
    message: IMessage,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: any) => void
  ): boolean {
    if (message.group !== this.target) {
      return false;
    }

    const handler = (this as any)[message.action];
    if (typeof handler !== 'function') {
      return false;
    }

    try {
      const result = handler.call(this, message.payload, sender);

      if (result && typeof (result as Promise<any>).then === 'function') {
        (result as Promise<any>)
          .then(sendResponse)
          .catch((err: unknown) => {
            const error = err instanceof Error ? err.message : String(err);
            sendResponse({ error });
          });
        return true;
      }

      sendResponse(result);
      return false; // Close port after synchronous response
    } catch (err: unknown) {
      const error = err instanceof Error ? err.message : String(err);
      sendResponse({ error });
      return false; // Close port after synchronous error response
    }
  }
}