class ContextMenu {
  static create(id: string, title: string, contexts: chrome.contextMenus.ContextType[] = ['all']) {
    chrome.contextMenus.create({ id, title, contexts });
  }

  static onClick(menuItem: string, callback: (info: chrome.contextMenus.OnClickData, tab?: chrome.tabs.Tab) => void) {
    chrome.contextMenus.onClicked.addListener((info, tab) => {
      if (info.menuItemId === menuItem) {
        callback(info, tab);
      }
    });
  }
}

export { ContextMenu };
