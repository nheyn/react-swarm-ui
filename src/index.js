// @flow
import React from 'react';

import createReconciler from './createReconciler';
import ZooidDocument from './ZooidDocument';
import ZooidManager from './ZooidManager';

const zooidManager = new ZooidManager('http://localhost:9092');
const zooidDocument = new ZooidDocument(zooidManager);
const { updateContainer, createContainer } = createReconciler();
updateContainer(
  <>
    <zooid des={[0.15, 0.5]} col={[0, 0, 125]} />
    <zooid des={[0.25, 0.5]} col={[0, 125, 0]} />
    <zooid des={[0.35, 0.5]} col={[125, 0, 0]} />
  </>,
  createContainer(zooidDocument, false),
  null,
  () => console.log('rendered:', zooidManager._state)
);
