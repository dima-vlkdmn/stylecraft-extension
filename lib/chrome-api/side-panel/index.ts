class SidePanel {
  static open(tabId: number): void {
    chrome.sidePanel.open({ tabId });
  }

  static setOptions(options: chrome.sidePanel.PanelOptions): void {
    chrome.sidePanel.setOptions(options);
  }
}

export { SidePanel };
