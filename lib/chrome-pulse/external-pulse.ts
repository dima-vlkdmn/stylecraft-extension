import { Tabs } from '@lib/chrome-api/tabs';
import { Runtime } from '@lib/chrome-api/runtime';

import { BasePulse } from './base-pulse';
import { Message, Payload } from './types';

class ExternalPulse extends BasePulse {
  public constructor(eventCategory: string, events: Record<string, (payload: Payload) => any> = {}) {
    super(eventCategory, events);

    this.startListening();
  }

  public setEvents(events: Record<string, (payload: Payload) => any>): void {
    this.eventActions = events;
  }

  public async sendMessage<T extends {}>(action: string, payload: Payload, tabId?: number): Promise<T[] | T> {
    const message: Message = {
      category: this.eventCategory,
      action,
      payload,
    };

    if (tabId !== undefined) {
      return Tabs.sendMessageToTab<T>(tabId, message);
    } else {
      return Tabs.sendMessageToAllTabs<T>(message);
    }
  }

  public startListening(): void {
    Runtime.subscribeToExternalMessages((message: Message, sender, sendResponse) => {
      const result = this.processMessage(message);

      if (result !== null) {
        sendResponse(result);
      }
    });
  }
}

export { ExternalPulse };
