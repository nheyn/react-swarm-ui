// @flow
import React from 'react';

import createReconciler from './createReconciler';
import ZooidManager from './ZooidManager';

const { updateContainer, createContainer } = createReconciler();
updateContainer(
  <React.Fragment>
    <zooid des={[0.15, 0.5]} col={[0, 0, 125]} />
    <zooid des={[0.25, 0.5]} col={[0, 125, 0]} />
    <zooid des={[0.35, 0.5]} col={[125, 0, 0]} />
  </React.Fragment>,
  createContainer(new ZooidManager('http://localhost:9092'), false),
  null,
  () => console.log('done')
);
