interface Tab {
  id?: number;
  index: number;
  windowId: number;
  active: boolean;
  pinned: boolean;
  url?: string;
  title?: string;
  status?: 'loading' | 'complete';
  incognito: boolean;             
  width?: number;                 
  height?: number;                
  sessionId?: string;             
}

export { Tab };
