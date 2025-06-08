import { Wing } from '@lib/wings';
import { LocalPulse, Payload } from '@lib/chrome-pulse';

class LocalWing<T extends Payload> extends Wing<T> {
  protected messenger: LocalPulse;

  public constructor(eventCategory: string, initialState: T) {
    super(initialState);

    this.messenger = new LocalPulse(eventCategory, {
      update: (payload: Payload) => this.setStateWithoutPropagation(payload as T),
      getState: () => this.getState(),
    });

    this.messenger.startListening();

    this.messenger.sendMessage('getState')
      .then((state) => {
        this.setStateWithoutPropagation(state as T);
      });
  }

  private setStateWithoutPropagation(newState: T): void {
    super.setState(newState);
  }

  protected setState(newState: T | Partial<T>): void {
    super.setState(newState);

    this.messenger.sendMessage('update', this.getState());
  }
}

export { LocalWing };
