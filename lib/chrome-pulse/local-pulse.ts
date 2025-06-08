import { Runtime } from '@lib/chrome-api/runtime';
import { BasePulse } from './base-pulse';
import { Message, Payload } from './types';

class LocalPulse extends BasePulse {
  public constructor(
    eventCategory: string,
    events: Record<string, (payload: Payload, sender: chrome.runtime.MessageSender, sendResponse: (res: any) => void) => any> = {}
  ) {
    super(eventCategory, {} as any);
    // Заносим расширенные хендлеры в eventActions
    this.setEvents(events as any);
    this.startListening();
  }

  public async sendMessage<T extends {}>(action: string, payload: Payload = {}): Promise<T> {
    const message: Message = {
      category: this.eventCategory,
      action,
      payload,
    };
    return Runtime.sendMessage<T>(message);
  }

  public startListening(): void {
    Runtime.subscribeToMessages((message: Message, sender, sendResponse) => {
      // обрабатываем только наши категории
      if (message.category !== this.eventCategory) {
        return false;
      }

      const handler = (this as any).eventActions[message.action];
      if (!handler) {
        return false;
      }

      // Вызов хендлера даёт либо:
      // - true           → хендлер сам вызовет sendResponse позднее
      // - Promise<res>   → мы дождёмся и отправим res
      // - любое другое  → сразу отправим
      const result = handler(message.payload, sender, sendResponse);

      if (result === true) {
        // хендлер сам позаботится о sendResponse
        return true;  // удерживаем порт
      }

      if (result instanceof Promise) {
        result.then(res => {
          if (res !== undefined) sendResponse(res);
        });
        return true;  // удерживаем порт до окончания промиса
      }

      if (result !== undefined) {
        sendResponse(result);
      }
      return false;  // можно закрыть порт
    });
  }
}

export { LocalPulse };
