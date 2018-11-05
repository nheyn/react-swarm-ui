// @flow

import type { ZooidId, ZooidApi, Unsubscribe } from './types';
import type ZooidElement from './ZooidElement';
import type ZooidEnvironment from './ZooidEnvironment';

export type ZooidEvent<T> = T;
export type ZooidEventFunc<T> = (e: ZooidEvent<T>) => any;

export default class ZooidEventHandler<T> {
  _onEvent: ZooidEventFunc<T>;
  _zooidSubsriptions: { [key:  ZooidId]: Unsubscribe };

  constructor(onEvent: ZooidEventFunc<T>) {
    this._onEvent = onEvent;
    this._zooidSubsriptions = {};
  }

  // External Public API
  attachTo(zooid: ZooidApi) {
    this.onEventWillAttach(zooid);

    this.detachFrom(zooid);
    this._zooidSubsriptions = {
      ...this._zooidSubsriptions,
      [zooid.id]: zooid.subscribe(() => {
        if (!this.shouldTriggerEvent(zooid)) return;

        this._onEvent(this.createEvent(zooid));
      }),
    };

    this.onEventDidAttach(zooid);
  }

  detachFrom(zooid: ZooidApi) {
    const { [zooid.id]: unsubscribe } = this._zooidSubsriptions;
    if (typeof unsubscribe !== 'function') return;

    this.onEventWillDetach(zooid);

    unsubscribe();
    this._zooidSubsriptions = {
      ...this._zooidSubsriptions,
      [zooid.id]: undefined,
    };

    this.onEventDidDetach(zooid);
  }

  // Methods for Subclass to override
  onEventWillAttach(zooid: ZooidApi) {
    //NOTE, override in subclass check if this event can be added to the given
    //      zooid, throw an error for react-reconclier to catch if not
  }

  onEventDidAttach(zooid: ZooidApi) {
    //NOTE, override in subclass check to finish attaching the given element
  }

  onEventWillDetach(zooid: ZooidApi) {
    //NOTE, override in subclass check if this event can be detached, throw an
    //      error for react-reconclier to catch if not
  }

  onEventDidDetach(zooid: ZooidApi) {
    //NOTE, override in subclass check to finish detaching
  }

  shouldTriggerEvent(zooid: ZooidApi) {
    //NOTE, override in subclass check if event should be triggered

    return false;
  }

  createEvent(zooid: ZooidApi): ZooidEvent<T> {
    //NOTE, override in subclass to create an event

    throw new Error('The createEvent(...) method must be overriden');
  }
}
