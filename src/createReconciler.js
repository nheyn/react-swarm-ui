// @flow
import createReactReconciler from 'react-reconciler';

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
      console.log('prepareForCommit');
    },
    resetAfterCommit() {
      console.log('resetAfterCommit');
    },
    shouldSetTextContent() {
      return false;
    },
    createInstance(type, props) {
      console.log('createInstance', type);
      //TODO, create zooid element
      return { type, props };
    },
    createTextInstance() {
      throw new Error('No text instances are possiable for react-swarm-ui');
    },
    getPublicInstance() {
      console.log('getPublicInstance');
    },
    appendInitialChild(parent, child) {
      console.log('appendInitialChild');
      //TODO, append child to the parent
    },
    finalizeInitialChildren(instance, type, props) {
      console.log('finalizeInitialChildren');
    },
    appendChildToContainer: (container, child) => {
      console.log('appendChildToContainer', container, child);
      //TODO, append child to the parent
    },
    supportsMutation: true,
    prepareUpdate(instance, type, oldProps, newProps) {
      console.log('prepareUpdate', type);
      return true;
    },
    appendChild(parent, child) {
      console.log('appendChild');
      //TODO, append child to the parent
    },
    removeChild(parent, child) {
      console.log('removeChild');
      //TODO, remove the child
    },
    commitUpdate(instance) {
      console.log('commitUpdate', instance);
    },
  });
}
