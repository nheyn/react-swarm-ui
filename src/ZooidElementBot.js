// @flow
import ZooidElement from './ZooidElement';

import type { ZooidId, Zooid } from './types';
import type ZooidEventHandlerChangePosition from './ZooidEventHandlerChangePosition';
import type ZooidEventHandlerMove from './ZooidEventHandlerMove';
import type ZooidManager from './ZooidManager';

export type Attribues = $Shape<$Rest<Zooid, {|id: ZooidId|}>>;
export type EventHandlers = {
  onChangePosition?: ZooidEventHandlerChangePosition,
  onStartMove?: ZooidEventHandlerMove,
  onEndMove?: ZooidEventHandlerMove,
};

export default class ZooidElementBot extends ZooidElement {
  _attrs: Attribues;
  _eventHandlers: EventHandlers;
  _id: void | ZooidId;

  constructor(attrs: Attribues, eventHandlers: EventHandlers) {
    super();

    this._attrs = attrs;
    this._eventHandlers = eventHandlers;
    this._id = undefined;
  }

  getId(): ZooidId {
    if (typeof this._id !== 'number') {
      throw new Error('ZooidElement not correctly attached to parent');
    }

    return this._id;
  }

  update(newAttrs: Attribues, eventHandlers: EventHandlers) {
    this._attrs = newAttrs;

    this._detachAllEventHandlers();
    this._eventHandlers = eventHandlers;

    this.commitUpdates();
  }

  elementWillAppendChild(child: ZooidElement) {
    throw new Error('Zooid element cannot have children attached');
  }

  elementDidAttachToParent(parent: ZooidElement) {
    if (this._zooidManager === undefined) {
      throw new Error('ZooidElement not correctly attached to parent');
    }

    this._id = this._zooidManager.getAvailableId();
    this.commitUpdates();
  }

  elementWillDetachFromParent() {
    if (this._zooidManager === undefined || typeof this._id !== 'number') {
      throw new Error('ZooidElement not correctly attached to parent');
    }

    this._zooidManager.releaseId(this._id);
    this._id = undefined;

    this._detachAllEventHandlers();
  }

  updateElement(zooidManager: ZooidManager): Promise<void> {
    this._attachAllEventHandlers();

    return this._updateZooids(zooidManager);
  }

  async _updateZooids(zooidManager: ZooidManager): Promise<void> {
    const { _id: id } = this;
    if (typeof id !== 'number') return;

    await zooidManager.setZooids((zooids) => {
      return zooids.map((zooid) => {
        if (zooid.id !== id) return zooid;

        return { ...zooid, ...this._attrs };
      });
    });
  }

  _attachAllEventHandlers() {
    if (typeof this._id !== 'number') return;

    for (let name in this._eventHandlers) {
      this._eventHandlers[name].attachTo(this);
    }
  }

  _detachAllEventHandlers() {
    for (let name in this._eventHandlers) {
      this._eventHandlers[name].detach();
    }
  }
}
