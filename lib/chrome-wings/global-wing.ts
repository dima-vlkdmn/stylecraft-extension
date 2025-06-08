import { Wing } from '@lib/wings'
import { GlobalPulse, Payload } from '@lib/chrome-pulse'
import type { Message } from '@lib/chrome-pulse/types'

type WingHandler<T> = (
  payload: Payload,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: any) => void,
  message: Message
) => any

export class GlobalWing<T extends Payload> extends Wing<T> {
  private messenger: GlobalPulse

  constructor(eventCategory: string, initialState: T) {
    super(initialState)

    this.messenger = new GlobalPulse(eventCategory, {
      update: ((payload: Payload) => {
        this.setStateWithoutPropagation(payload as T)
      }) as WingHandler<T>,

      getState: ((_,
                 __,
                 sendResponse: (res: any) => void) => {
        sendResponse(this.getState())
        return false
      }) as WingHandler<T>,
    })
  }

  private setStateWithoutPropagation(newState: T): void {
    super.setState(newState)
  }

  protected setState(newState: T | Partial<T>): void {
    super.setState(newState)
    this.messenger.sendMessage('update', this.getState())
  }
}
