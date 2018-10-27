// @flow
import createReactReconciler from 'react-reconciler';

import ZooidElementBot from './ZooidElementBot';

export default function createReconciler() {
  const rootHostContext = {};
  const childHostContext = {};

  return createReactReconciler({
    now: Date.now,
    getRootHostContext() {
      return rootHostContext;
    },
    getChildHostContext() {
      return childHostContext;
    },
    prepareForCommit() {
      //console.log('prepareForCommit');
    },
    resetAfterCommit() {
      //console.log('resetAfterCommit');
    },
    shouldSetTextContent() {
      return false;
    },
    createInstance(type, props, zooidDocument) {
      if (type !== 'zooid') {
        throw new Error('Only zooid type elements can be used');
      }

      return new ZooidElementBot(props);
    },
    createTextInstance() {
      throw new Error('No text instances are possiable for react-swarm-ui');
    },
    finalizeInitialChildren(instance, type, props) {
      //console.log('finalizeInitialChildren');
    },
    appendInitialChild(parent, child) {
      //TODO, add 'ZooidAreaElement' class for this
      throw new Error('NYI: ZooidAreaElement');
    },
    appendChildToContainer(zooidDocument, child) {
      zooidDocument.appendChild(child);
    },
    removeChildFromContainer(zooidDocument, child) {
      zooidDocument.removeChild(child);
    },
    getPublicInstance(...args) {
      //console.log('getPublicInstance', args);
    },
    supportsMutation: true,
    prepareUpdate(instance, type, oldProps, newProps) {
      //console.log('prepareUpdate', type);
      return true;
    },
    appendChild(parent, child) {
      //console.log('appendChild');
      parent.appendChild(child);
    },
    removeChild(parent, child) {
      //console.log('removeChild');
      parent.removeChild(child);
    },
    commitUpdate(instance, _, type, oldProps, newProps) {
      if (!(instance instanceof ZooidElementBot)) return;

      instance.update(newProps);
    },
  });
}
