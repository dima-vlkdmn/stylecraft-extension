import { BaseMessenger } from '@/src/messenger/base-messenger';
import { SidePanel } from '@/lib/chrome-api/side-panel';

export class SidePanelMessenger extends BaseMessenger {
  public readonly target = 'SidePanel';

  public handle(
    action: string,
    _payload: any,
    sender: chrome.runtime.MessageSender,
    sendResponse: (response: any) => void
  ): boolean {
    if (action === 'open' && sender.tab?.id) {
      SidePanel.open(sender.tab.id);
      SidePanel.setOptions({
        path: 'side-panel.html',
        enabled: true,
        tabId: sender.tab.id,
      });
      sendResponse({ opened: true });
      return true;
    }

    return false;
  }
}
