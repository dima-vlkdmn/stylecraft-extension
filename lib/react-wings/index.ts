import { useEffect, useState } from 'react';

import { Wing, EventMessage } from '../wings';

type EventListener = () => void;

function useWing<T>(
  controller: Wing<T>,
  eventListeners?: Record<string, EventListener[]>,
): [T, Record<string, Function>] {
  const [state, setState] = useState(controller.getState());

  useEffect(() => {
    const listener = ({ event, payload: { currentState } }: EventMessage<T>) => {
      if (event === 'UPDATE') {
        setState(currentState);
      }

      if (eventListeners?.[event]) {
        for (const listener of eventListeners[event]) {
          listener();
        }
      }
    };

    controller.subscribe(listener);

    return () => {
      controller.unsubscribe(listener);
    };
  }, [controller]);

  return [state, controller.getActions()];
}

export { useWing };
