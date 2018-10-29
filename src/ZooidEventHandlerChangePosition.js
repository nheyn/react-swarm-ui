// @flow
import ZooidElementBot from './ZooidElementBot';
import ZooidEventHandler from './ZooidEventHandler';

import type { Zooid, ZooidId } from './types';
import type ZooidElement from './ZooidElement'
import type { ZooidEvent } from './ZooidEventHandler';
import type ZooidManager from './ZooidManager';

export default class ZooidEventHandlerChangePosition
extends ZooidEventHandler<Zooid> {
  _id: void | ZooidId;
  _pos: void | [number, number];

  onEventWillAttach(element: ZooidElement<any, any, any>) {
    if (!(element instanceof ZooidElementBot)) {
      throw new Error(
        'ZooidEventHandlerChangePosition can only attach to ZooidElementBot'
      );
    }
  }

  onEventDidAttach(element: ZooidElement<any, any, any>) {
    if (!(element instanceof ZooidElementBot)) {
      throw new Error(
        'ZooidEventHandlerChangePosition can only attach to ZooidElementBot'
      );
    }

    if (!element.hasAssignedZooid()) return;
    this._id = element.getId();

    //TODO, replace this (so private var doesn't need accssesed)
    const { _zooidManager: zooidManager } = element;
    if (zooidManager === undefined) {
      throw new Error(
        'Element must be append to element tree for eventHandlers to be attached'
      );
    }
    const zooid = this._getZooidFrom(zooidManager);
    this._pos = zooid.pos;
  }

  onEventDidDetach() {
    this._id = undefined;
    this._pos = undefined;
  }

  shouldTriggerEvent(zooidManager: ZooidManager): boolean {
    const { _pos: pos } = this;
    if (!Array.isArray(pos)) return false;

    const zooid = this._getZooidFrom(zooidManager);
    this._pos = zooid.pos;

    const posDiffX = Math.abs(zooid.pos[0] - pos[0]);
    const posDiffY = Math.abs(zooid.pos[1] - pos[1]);
    const minDiff = zooid.siz / 2;

    return posDiffX > minDiff || posDiffY > minDiff;
  }

  createEvent(zooidManager: ZooidManager): ZooidEvent<Zooid> {
    return this._getZooidFrom(zooidManager);
  }

  _getZooidFrom(zooidManager: ZooidManager): Zooid {
    const { _id: id } = this;
    if (typeof id !== 'number') throw new Error('Event not correctly attached');

    const zooid = zooidManager.getZooid(id);
    if (zooid === undefined) throw new Error(`Invalid zooid id: ${id}`);

    return zooid;
  }
}
