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
  _pos: *;

  onEventWillAttach(element: ZooidElement) {
    if (!(element instanceof ZooidElementBot)) {
      throw new Error(
        'ZooidEventHandlerChangePosition can only attach to ZooidElementBot'
      );
    }
  }

  onEventDidAttach(element: ZooidElement) {
    if (!(element instanceof ZooidElementBot)) {
      throw new Error(
        'ZooidEventHandlerChangePosition can only attach to ZooidElementBot'
      );
    }

    this._id = element.getId();

    const zooid = this._getZooidFrom(element.getZooidManagerFor(this));
    this._pos = zooid.pos;
  }

  onEventDidDetach() {
    this._id = undefined;
    this._pos = undefined;
  }

  shouldTriggerEvent(zooidManager: ZooidManager) {
    const { _pos: pos } = this;
    if (!Array.isArray(pos)) throw new Error('Event not correctly attached');

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
