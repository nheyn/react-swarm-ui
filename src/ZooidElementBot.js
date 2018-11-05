// @flow
import ZooidElement from './ZooidElement';

import type { ZooidId, ZooidUpdates, ZooidApi } from './types';
import type ZooidEventHandlerChangePosition from './ZooidEventHandlerChangePosition';
import type ZooidEventHandlerMove from './ZooidEventHandlerMove';
import type ZooidEnvironment from './ZooidEnvironment';

export type EventHandlers = $Shape<{
  onChangePosition: ZooidEventHandlerChangePosition,
  onStartMove: ZooidEventHandlerMove,
  onEndMove: ZooidEventHandlerMove,
}>;
type NoChildren = [];

export default class ZooidElementBot
extends ZooidElement<ZooidUpdates, EventHandlers, NoChildren> {
  _zooid: void | ZooidApi;

  constructor(attrs: ZooidUpdates, eventHandlers: EventHandlers) {
    super(attrs, eventHandlers, []);

    this._zooid = undefined;
  }

  elementWillAppendChild(child: ZooidElement<any, any, any>) {
    throw new Error('Zooid element cannot have children attached');
  }

  elementDidAttachToParent(parent: ZooidElement<any, any, any>) {
    this._zooid = this.getZooid();
    this.commitUpdates();
  }

  elementWillDetachFromParent() {
    const { _zooid: zooid } = this;
    if (zooid === undefined) return;

    for (let name in this._eventHandlers) {
      this._eventHandlers[name].detachFrom(zooid);
    }

    zooid.release();
    this._zooid = undefined;
  }

  updateElement(): Promise<void> {
    this._updateEnvironment();
    this._updateEventHandlers();
    return this._updateZooid();
  }

  _updateEnvironment() {
    const { _zooidEnvironment: zooidEnvironment } = this;
    if (zooidEnvironment === undefined) return;

    //TODO, update so .setPosition(...) is the corner of .setDimentions(...)
    if (Array.isArray(this._attrs.des)) {
      zooidEnvironment.setPosition(this._attrs.des);
    }
    else {
      zooidEnvironment.resetPosition();
    }

    if (this._zooid === undefined) return;
    const { siz: size } = this._zooid.getState();
    zooidEnvironment.setDimentions([size, size]);
  }

  _updateEventHandlers() {
    const { _zooid: zooid } = this;

    for (let name in this._eventHandlers) {
      this._eventHandlers[name].attachTo(zooid);
    }
  }

  async _updateZooid(): Promise<void> {
    const { _zooid: zooid, _zooidEnvironment: zooidEnvironment } = this;
    if (zooid === undefined || zooidEnvironment === undefined) return;

    await zooid.update({
      ...this._attrs,
      des: zooidEnvironment.getPosition(),
    });
  }
}
