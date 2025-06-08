type Payload = string | number | boolean | object | null;

interface Target {
  tabId: number;
}

interface Message {
  category: string;
  action:   string;
  payload:  Payload;
  target?:  Target;
}

export { Message, Payload, Target };
