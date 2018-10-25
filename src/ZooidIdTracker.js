// @flow

import type ZooidManager from './ZooidManager';

export type ZooidId = number;

export default class ZooidIdTracker {
  _stack: Array<ZooidId>;
  _unsubscribe: () => void;

  constructor(stack: Array<ZooidId> = []) {
    this._stack = stack;
  }

  hasZooids(): boolean {
    return this._stack.length >= 1;
  }

  getId(): ZooidId {
    const [top, ...rest] = this._stack;
    if (typeof top !== 'number') {
      throw new Error('No more zooids are available.');
    }

    this._stack = rest;
    return top;
  }

  giveId(id: ZooidId) {
    this._stack = [id, ...this._stack];
  }

  subscribeTo(zooidManager: ZooidManager) {
    this._stack = zooidManager.getAllIds();
    this._unsubscribe = zooidManager.subscribe(() => {
      //TODO, make this update if number of zooid's change
    });
  }

  unsubscribe() {
    if (typeof this._unsubscribe !== 'function') return;

    this._unsubscribe();
  }
}
