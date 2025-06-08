import { IMessage } from './types';

class Messenger {
  static sendToBackground(message: IMessage): Promise<any> {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(
        message,
        (response) => {
          console.log('Message Response:', response);
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError.message);
          } else {
            resolve(response);
          }
        }
      );
    });
  }

  static sendToTab(tabId: number, message: IMessage): Promise<any> {
    return new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(
        tabId, 
        message, 
        (response) => {
          if (chrome.runtime.lastError) {
            reject(chrome.runtime.lastError.message);
          } else {
            resolve(response);
          }
        },
      );
    });
  }
}

export { Messenger };
