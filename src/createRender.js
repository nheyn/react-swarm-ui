// @flow
import WebSocket from 'ws';

import createReconciler from './createReconciler';
import ZooidDocument from './ZooidDocument';
import ZooidIdTracker from './ZooidIdTracker';
import ZooidManager from './ZooidManager';

import type { Node } from 'react';

export default function createRender() {
  const updatesForUrl = new Map();

  return (
    root: Node,
    socket: string | WebSocket,
    callback?: () => void
  ) => {
    let webSocket;
    if (typeof socket === 'string') {
      const update = updatesForUrl.get(socket);
      if (typeof update === 'function') {
        update(root, callback);
      }
      else {
        webSocket = new WebSocket(socket);
      }
    }
    else {
      if (typeof socket.__updateContainer === 'function') {
        socket.__updateContainer(root, callback);
      }
      else {
        webSocket = socket;
      }
    }
    if (webSocket === undefined) return;

    const zooidManager = new ZooidManager(webSocket);
    zooidManager.subscribe((_, unsubscribe) => {
      unsubscribe();

      const zooidIdTracker = new ZooidIdTracker();
      const zooidDocument = new ZooidDocument(zooidManager, zooidIdTracker);
      const { updateContainer, createContainer } = createReconciler();

      const container = createContainer(zooidDocument, false);
      const update = (r, cb) => updateContainer(r, container, null, cb);
      if (typeof socket === 'string') {
        updatesForUrl.set(socket, update);
      }
      else {
        socket.__updateContainer = update;
      }

      update(root, callback);
    });
  };
}
