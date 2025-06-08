class Runtime {
  public static async sendMessage<T>(message: any): Promise<T> {
    return new Promise((resolve) => {
      chrome.runtime.sendMessage(message, resolve);
    });
  }

  public static subscribeToMessages(callback: (message: any, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => void): void {
    chrome.runtime.onMessage.addListener(callback);
  }

  public static unsubscribeFromMessages(callback: (message: any, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => void): void {
    chrome.runtime.onMessage.removeListener(callback);
  }

  public static subscribeToExternalMessages(callback: (message: any, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => void): void {
    chrome.runtime.onMessageExternal.addListener(callback);
  }

  public static unsubscribeFromExternalMessages(callback: (message: any, sender: chrome.runtime.MessageSender, sendResponse: (response: any) => void) => void): void {
    chrome.runtime.onMessageExternal.removeListener(callback);
  }

  public static async getManifest(): Promise<chrome.runtime.Manifest> {
    return chrome.runtime.getManifest();
  }
}

export { Runtime };
