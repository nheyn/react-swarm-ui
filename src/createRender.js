// @flow
import WebSocket from 'ws';

import createReconciler from './createReconciler';
import ZooidDocument from './ZooidDocument';
import ZooidEnvironment from './ZooidEnvironment';
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
    // Check socket to see if it has already has a container
    let webSocket;
    if (typeof socket === 'string') {
      const update = updatesForUrl.get(socket);
      if (typeof update === 'function') {
        update(root, callback);
        return;
      }

      webSocket = new WebSocket(socket);
    }
    else {
      if (typeof socket.__updateContainer === 'function') {
        socket.__updateContainer(root, callback);
        return;
      }

      webSocket = socket;
    }

    // Initial Reconciler Container
    const zooidManager = new ZooidManager(webSocket);
    const zooidIdTracker = new ZooidIdTracker();
    const zooidEnvironment = new ZooidEnvironment(
      zooidManager,
      zooidIdTracker,
      zooidManager.getTableDimentions(),
      [0, 0]
    );
    const zooidDocument = new ZooidDocument(zooidEnvironment);

    const { updateContainer, createContainer } = createReconciler();
    const container = createContainer(zooidDocument, false);
    const update = (r, cb) => updateContainer(r, container, null, cb);

    // Save container for re-rendering
    if (typeof socket === 'string') {
      updatesForUrl.set(socket, update);
    }
    else {
      socket.__updateContainer = update;
    }

    // Wait until zooidManager is connect for the initial render
    zooidManager.subscribe((_, unsubscribe) => {
      unsubscribe();
      update(root, callback);
    });
  };
}
