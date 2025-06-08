import ReactGA from 'react-ga4';
import { GAEvent } from './types';

class GAService {
  public static init(trackingId: string) {
    ReactGA.initialize(trackingId);
  }

  public static logPageView() {
    ReactGA.send({ hitType: 'pageview', page: window.location.pathname + window.location.search });
  }

  public static logEvent(event: GAEvent) {
    ReactGA.event(event);
  }
}

export { GAService };
