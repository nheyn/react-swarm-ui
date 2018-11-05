// @flow
import WebSocket from 'ws';

import ZooidDocument from './ZooidDocument';
import ZooidEnvironment from './ZooidEnvironment';
import ZooidIdTracker from './ZooidIdTracker';
import ZooidManager from './ZooidManager';

export default function createDocument(soc: string | WebSocket): ZooidDocument {
  const webSocket = typeof soc === 'string'? new WebSocket(soc): soc;
  const zooidManager = new ZooidManager(webSocket);
  const zooidIdTracker = new ZooidIdTracker();
  const zooidEnvironment = new ZooidEnvironment(zooidManager, zooidIdTracker);

  return new ZooidDocument(zooidEnvironment);
}
