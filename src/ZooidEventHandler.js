// @flow

import type ZooidELement from './ZooidELement';
import type ZooidManager from './ZooidManager';

type ZooidEvent<T> = T;
type ZooidEventFunc<T> = (e: ZooidEvent<T>) => any;

export default class ZooidEventHandler<T> {
  _onEvent: ZooidEventFunc<T>;
  _unsubscribe: void | () => void;

  constructor(onEvent: ZooidEventFunc<T>) {
    this._onEvent = onEvent;
    this._unsubscribe = undefined;
  }

  // External Public API
  attachTo(element: ZooidELement) {
    const zooidManager = element.getZooidManagerFor(this);

    this.detach();
    this._unsubscribe = zooidManager.subscribe(() => {
      if (!this.shouldTriggerEvent(zooidManager)) return;

      this._onEvent(this.createEvent(zooidManager));
    });
  }

  detach() {
    if (typeof this._unsubscribe !== 'function') return;

    this._unsubscribe();
  }

  // Methods for Subclass to override
  shouldTriggerEvent(zooidManager: ZooidManager) {
    //NOTE, override in subclass check if event should be triggered

    return false;
  }

  createEvent(zooidManager: ZooidManager): ZooidEvent<T> {
    //NOTE, override in subclass to create an event

    throw new Error('The createEvent(...) method must be overriden');
  }
}
