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
    // $FlowFixMe - this is already checked in
    const botElement: ZooidElementBot = element;

    this._id = botElement.getId();
  }

  onEventDidDetach() {
    this._id = undefined;
  }

  createEvent(zooidManager: ZooidManager): ZooidEvent<Zooid> {
    const { _id: id } = this;
    if (typeof id !== 'number') throw new Error('Event not correctly attached');

    const zooid = zooidManager.getZooid(id);
    if (zooid === undefined) throw new Error(`Invalid zooid id: ${id}`);

    return zooid;
  }
}
