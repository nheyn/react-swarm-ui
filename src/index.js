// @flow
import React from 'react';
import WebSocket from 'ws';

import createReconciler from './createReconciler';
import ZooidDocument from './ZooidDocument';
import ZooidManager from './ZooidManager';

class TestApp extends React.Component<*, *> {
  getDes(offset: number) {
    const { dim: [width, height], des:[bottom, left] } = this.props;
    const defaultBottom = bottom + (width / 2);
    const defaultLeft = left + (height / 2)

    return [ defaultBottom + offset, defaultLeft - offset ];
  }

  render() {
    return (
      <>
        <zooid des={this.getDes(0.05)} col={[255, 0, 0]} />
        <zooid des={this.getDes(0)} col={[0, 255, 0]} />
        <zooid des={this.getDes(-0.05)} col={[0, 0, 255]} />
      </>
    );
  }
}

const webSocket = new WebSocket('http://localhost:9092');
const zooidManager = new ZooidManager(webSocket);
const unsubscribe = zooidManager.subscribe(() => {
  unsubscribe();

  const zooidDocument = new ZooidDocument(zooidManager);
  const { updateContainer, createContainer } = createReconciler();
  updateContainer(
    <TestApp dim={zooidManager.getTableDimentions()} des={[0, 0]} />,
    createContainer(zooidDocument, false),
    null,
    () => console.log('initial render complete')
  );
});
