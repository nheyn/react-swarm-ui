// @flow

import type ZooidManager from './ZooidManager';
import type { ZooidId } from './types';

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

    //TODO, make this update if number of zooid's change
    //      need to figure out how when some ids are already out
    let first = true;
    this._unsubscribe = zooidManager.subscribe(() => {
      if (!first) return;
      first = false;

      this._stack = zooidManager.getAllIds();
    });
  }

  unsubscribe() {
    if (typeof this._unsubscribe !== 'function') return;

    this._unsubscribe();
  }
}
