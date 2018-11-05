// @flow
import createReconciler from './createReconciler';

import type { Node } from 'react';
import type ZooidDocument from './ZooidDocument';

const { updateContainer, createContainer } = createReconciler();

export default function render(
  root: Node,
  zooidDocument: ZooidDocument,
  callback?: () => void
) {
  // Check socket to see if it has already has a container
  if (zooidDocument.__container !== undefined) {
    updateContainer(root, zooidDocument.__container, null, callback);
    return;
  }

  // Initial Reconciler Container
  const container = createContainer(zooidDocument, false);
  zooidDocument.__container = container;

  // Wait until zooidManager is connect for the initial render
  zooidDocument.onLoad(() => updateContainer(root, container, null, callback));
}
