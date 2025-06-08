// src/lib/chrome-pulse/global-pulse.ts
import { Tabs } from '@lib/chrome-api/tabs'
import { Runtime } from '@lib/chrome-api/runtime'
import { BasePulse } from './base-pulse'
import type { Message, Payload, Target } from './types'

type Handler = (
  payload: Payload,
  sender: chrome.runtime.MessageSender,
  sendResponse: (response: any) => void,
  message: Message & { target?: Target }
) => any | Promise<any> | boolean

export class GlobalPulse extends BasePulse {
  constructor(
    eventCategory: string,
    // теперь принимаем хендлеры с полной сигнатурой
    handlers: Record<string, Handler>
  ) {
    // передаём пустой объект в BasePulse — всё подключим ниже
    super(eventCategory, {})

    // подписываемся на все входящие
    Runtime.subscribeToMessages((message, sender, sendResponse) => {
      if (message.category !== eventCategory) return

      const handler = handlers[message.action]
      if (!handler) return

      // вызываем handler с четырьмя аргументами
      const result = handler(message.payload, sender, sendResponse, message as any)

      // если handler вернул true — значит он сам вызовет sendResponse позднее
      if (result === true) {
        return
      }

      // если handler вернул промис — ждём и шлём
      if (result instanceof Promise) {
        result.then(res => {
          if (res !== undefined) sendResponse(res)
        })
        return true  // удерживаем канал открытым до промиса
      }

      // иначе — сразу отвечаем, если не `undefined`
      if (result !== undefined) {
        sendResponse(result)
      }

      // канал можно закрывать
      return false
    })
  }

  public async sendMessage<T = any>(
    action: string,
    payload: Payload = {},
    tabId?: number
  ): Promise<T | T[]> {
    const msg: Message = { category: this.eventCategory, action, payload }
    if (tabId != null) {
      return Tabs.sendMessageToTab<T>(tabId, msg)
    }
    return Tabs.sendMessageToAllTabs<T>(msg)
  }
}
