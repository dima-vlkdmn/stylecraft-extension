import { Tab } from './types';

class Tabs {
  
  public static async getAll(): Promise<Tab[]> {
    return new Promise((resolve) => {
      chrome.tabs.query({}, (tabs) => {
        resolve(tabs as Tab[]);
      });
    });
  }

  public static async getCurrent(): Promise<Tab> {
    return new Promise((resolve, reject) => {
      chrome.tabs.getCurrent((tab) => {
        if (!tab) {
          return reject(new Error('No current tab context'));
        }
        resolve(tab as Tab);
      });
    });
  }

  public static async getActive(): Promise<Tab> {
    return new Promise((resolve) => {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        resolve(tabs[0] as Tab);
      });
    });
  }

  public static async sendMessageToTab<T>(tabId: number, message: any): Promise<T> {
    return new Promise((resolve) => {
      chrome.tabs.sendMessage(tabId, message, resolve);
    });
  }

  public static async sendMessageToActiveTab<T>(message: any): Promise<T> {
    const tab = await Tabs.getActive();

    if (!tab.id) {
      throw new Error('No active tab found');
    }

    return Tabs.sendMessageToTab(tab.id, message);
  }

  public static async sendMessageToAllTabs<T>(message: any): Promise<T[]> {
    const tabs = await Tabs.getAll();

    return Promise.all(tabs.map((tab) => {
      if (!tab.id) {
        throw new Error('No tab id found');
      }

      return Tabs.sendMessageToTab(tab.id, message) as T;
    }));
  }
}

export { Tabs };
