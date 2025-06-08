import { BasePulse } from './base-pulse';
import { Message, Target, Payload } from './types';
import { Runtime } from '@lib/chrome-api/runtime';

class SidePulse extends BasePulse {
  constructor(
    eventCategory: string,
    events: Record<string, (payload: Payload) => any> = {}
  ) {
    super(eventCategory, events);
    this.startListening();
  }

  private startListening() {
    Runtime.subscribeToMessages((message: Message, sender, sendResponse) => {
      if (message.category !== this.eventCategory) {
        return;
      }
      const result = this.processMessage(message);
      if (result !== null) {
        sendResponse(result);
      }
    });
  }

  public async sendMessage<T = any>(
    action: string,
    payload: Payload = {},
    target?: Target
  ): Promise<T> {
    const message: Message = {
      category: this.eventCategory,
      action,
      payload,
      target,
    };
    return Runtime.sendMessage<T>(message);
  }
}

export const sidePulse = new SidePulse('SidePanel')
export { SidePulse };