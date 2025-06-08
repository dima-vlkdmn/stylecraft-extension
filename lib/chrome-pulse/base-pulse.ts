import { Message, Payload } from './types';

class BasePulse {
  protected eventCategory: string;
  protected eventActions: Record<string, (payload: Payload) => any>;

  public constructor(eventCategory: string, events: Record<string, (payload: Payload) => any> = {}) {
    this.eventCategory = eventCategory;
    this.eventActions = { ...events };
  }

  protected setEvents(events: Record<string, (payload: Payload) => any>): void {
    this.eventActions = { ...events };
  }

  public processMessage(message: Message): any {
    if (message.category !== this.eventCategory) {
      return null;
    }

    const handler = this.eventActions[message.action];

    if (handler) {
      return handler.call(this, message.payload);
    }
    
    return null;
  }

  public sendMessage(action: string, payload: Payload): void {
    throw new Error("sendMessage must be implemented in a subclass");
  }
}

export { BasePulse };
