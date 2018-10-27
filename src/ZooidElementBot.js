// @flow
import ZooidElement from './ZooidElement';

import type { ZooidId, Zooid } from './types';

type ZoidAttribues = $Shape<$Rest<Zooid, {|id: ZooidId|}>>;

export default class ZooidElementBot extends ZooidElement {
  _attrs: ZoidAttribues;
  _id: void | ZooidId;

  constructor(attrs: ZoidAttribues) {
    super();

    this._attrs = attrs;
    this._id = undefined;
  }

  update(newAttrs: ZoidAttribues) {
    this._attrs = newAttrs;
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

  updateZooids(zooids: Array<Zooid>): Array<Zooid> {
    if (typeof this._id !== 'number') return zooids;

    const _return = zooids.map((zooid) => {
      if (zooid.id !== this._id) return zooid;

      return { ...zooid, ...this._attrs };
    });
    return _return;
  }
}
