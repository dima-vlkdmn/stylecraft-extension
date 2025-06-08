import { Observer } from '../observer';

type EventMessage<T> = { event: string, payload: { previousState: T, currentState: T } };
type EventCondition<T> = (previousState: T, currentState: T) => boolean;

class Wing<T> extends Observer<EventMessage<T>> {
  protected state: T;
  protected actions: Record<string, Function> = {};
  protected events: Record<string, EventCondition<T>> = {};

  constructor(initialState: T) {
    super();

    this.state = initialState;
  }

  protected setState(newState: T | Partial<T>): void {
    const updatedState = { ...this.state, ...newState };

    this.notify({ event: 'UPDATE', payload: { previousState: this.state, currentState: updatedState } });

    for (const [event, condition] of Object.entries(this.events)) {
      if (condition(this.state, updatedState)) {
        this.notify({ event, payload: { previousState: this.state, currentState: updatedState }});
      }
    }

    this.state = updatedState;
  }

  getState(): T {
    return this.state;
  }

  getActions() {
    return this.actions;
  }

  getEvents() {
    return this.events;
  }
}

export { Wing, EventMessage, EventCondition };
