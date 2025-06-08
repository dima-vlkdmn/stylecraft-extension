import type { BaseMessenger } from '@/src/messenger/base-messenger';

export abstract class BaseBackgroundPage {
  private static messengers: BaseMessenger[] = [];

  static init(): void {
    this.initMessageListener();
  }

  protected static registerMessenger(m: BaseMessenger): void {
    this.messengers.push(m);
  }

  protected static initMessageListener(): void {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      for (const m of this.messengers) {
        if (m.target === message.target) {
          const result = m.handle(
            message.action,
            message.payload,
            sender,
            sendResponse
          );
          return result === undefined ? true : result;
        }
      }
      return false;
    });
  }

  static onInstall(callback: (info: { reason: string }) => void): void {
    chrome.runtime.onInstalled.addListener(callback);
  }

  static onUninstall(url: string): void {
    chrome.runtime.setUninstallURL(url);
  }
}