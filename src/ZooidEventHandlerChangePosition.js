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
  }

  onEventDidDetach() {
    this._id = undefined;
  }

  shouldTriggerEvent(zooidManager: ZooidManager) {
    const zooid = this._getZooidFrom(zooidManager);

    const diffX = Math.abs(zooid.pos[0] - zooid.des[0]);
    const diffY = Math.abs(zooid.pos[1] - zooid.des[1]);

    return diffX > zooid.siz || diffY > zooid.siz;
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
