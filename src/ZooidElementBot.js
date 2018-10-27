// @flow
import ZooidElement from './ZooidElement';

import type { ZooidId, Zooid } from './types';
import type ZooidEventHandler from './ZooidEventHandler';
import type ZooidManager from './ZooidManager';

type Attribues = $Shape<$Rest<Zooid, {|id: ZooidId|}>>;
type EventHandlers = {
  onChangePosition?: ZooidEventHandler<Zooid>,
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

  update(newAttrs: Attribues, eventHandlers: EventHandlers) {
    this._attrs = newAttrs;
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
  }

  updateZooids(zooidManager: ZooidManager): Promise<void> {
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
    this._detachAllEvents();

    if (this._eventHandlers.onChangePosition === undefined) return;
    this._eventHandlers.onChangePosition.attachTo(this);
  }

  _detachAllEvents() {
    if (this._eventHandlers.onChangePosition === undefined) return;

    this._eventHandlers.onChangePosition.detach();
  }
}
