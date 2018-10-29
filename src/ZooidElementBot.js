// @flow
import ZooidElement from './ZooidElement';

import type { ZooidId, Zooid } from './types';
import type ZooidEventHandlerChangePosition from './ZooidEventHandlerChangePosition';
import type ZooidEventHandlerMove from './ZooidEventHandlerMove';
import type ZooidManager from './ZooidManager';

export type Attribues = $Shape<$Rest<Zooid, {|id: ZooidId|}>>;
export type EventHandlers = $Shape<{
  onChangePosition: ZooidEventHandlerChangePosition,
  onStartMove: ZooidEventHandlerMove,
  onEndMove: ZooidEventHandlerMove,
}>;

export default class ZooidElementBot
extends ZooidElement<Attribues, EventHandlers, []> {
  _id: void | ZooidId;

  constructor(attrs: Attribues, eventHandlers: EventHandlers) {
    super(attrs, eventHandlers, []);

    this._id = undefined;
  }

  hasAssignedZooid(): boolean {
    return typeof this._id === 'number';
  }

  getId(): ZooidId {
    if (typeof this._id !== 'number') {
      throw new Error('ZooidElementBot has not been attached to parent');
    }

    return this._id;
  }

  elementWillAppendChild(child: ZooidElement<any, any, any>) {
    throw new Error('Zooid element cannot have children attached');
  }

  elementDidAttachToParent(parent: ZooidElement<any, any, any>) {
    if (this._zooidManager === undefined) return;

    this._id = this._zooidManager.getAvailableId();
    this.commitUpdates();
  }

  elementWillDetachFromParent() {
    if (this._zooidManager === undefined || typeof this._id !== 'number') {
      return;
    }

    this._zooidManager.releaseId(this._id);
    this._id = undefined;

    this._detachAllEventHandlers();
  }

  async updateElement(): Promise<void> {
    const { _id: id, _zooidManager: zooidManager } = this;
    if (typeof id !== 'number') return;
    if (zooidManager === undefined) return;

    await zooidManager.setZooids((zooids) => {
      return zooids.map((zooid) => {
        if (zooid.id !== id) return zooid;

        return { ...zooid, ...this._attrs };
      });
    });
  }
}
