// @flow

import type ZooidElement from './ZooidElement';
import type ZooidManager from './ZooidManager';

export type ZooidEvent<T> = T;
export type ZooidEventFunc<T> = (e: ZooidEvent<T>) => any;

let c = 0;

export default class ZooidEventHandler<T> {
  _onEvent: ZooidEventFunc<T>;
  _unsubscribe: void | () => void;

  constructor(onEvent: ZooidEventFunc<T>) {
    this._onEvent = onEvent;
    this._unsubscribe = undefined;
  }

  // External Public API
  attachTo(element: ZooidElement) {
    this.onEventWillAttach(element);

    const zooidManager = element.getZooidManagerFor(this);
    this.detach();
    this._unsubscribe = zooidManager.subscribe(() => {
      if (!this.shouldTriggerEvent(zooidManager)) return;

      this._onEvent(this.createEvent(zooidManager));
    });

    this.onEventDidAttach(element);
  }

  detach() {
    const { _unsubscribe: unsubscribe } = this;
    if (typeof unsubscribe !== 'function') return;

    this.onEventWillDetach();

    unsubscribe();
    this._unsubscribe = undefined;

    this.onEventDidDetach();
  }

  // Methods for Subclass to override
  onEventWillAttach(element: ZooidElement) {
    //NOTE, override in subclass check if this event can be added to the given
    //      element, throw an error for react-reconclier to catch if not
  }

  onEventDidAttach(element: ZooidElement) {
    //NOTE, override in subclass check to finish attaching the given element
  }

  onEventWillDetach() {
    //NOTE, override in subclass check if this event can be detached, throw an
    //      error for react-reconclier to catch if not
  }

  onEventDidDetach() {
    //NOTE, override in subclass check to finish detaching
  }

  shouldTriggerEvent(zooidManager: ZooidManager) {
    //NOTE, override in subclass check if event should be triggered

    return false;
  }

  createEvent(zooidManager: ZooidManager): ZooidEvent<T> {
    //NOTE, override in subclass to create an event

    throw new Error('The createEvent(...) method must be overriden');
  }
}
