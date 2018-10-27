// @flow
import ZooidElementBase from './ZooidElementBase';

import type { ZooidId, Zooid } from './types';

type ZoidAttribues = $Shape<$Rest<Zooid, {|id: ZooidId|}>>;

export default class ZooidElement extends ZooidElementBase {
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

  elementWillAppendChild(child: ZooidElementBase) {
    throw new Error('Zooid element cannot have children attached');
  }

  elementDidAttachToParent(parent: ZooidElementBase) {
    console.log('elementWillDetachFromParent');

    if (this._idTracker === undefined) {
      throw new Error('ZooidElement not correctly attached to parent');
    }

    this._id = this._idTracker.getId();
  }

  elementWillDetachFromParent() {
    if (this._idTracker === undefined || typeof this._id !== 'number') {
      throw new Error('ZooidElement not correctly attached to parent');
    }

    this._idTracker.giveId(this._id);
    this._id = undefined;
  }

  updateZooids(zooids: Array<Zooid>): Array<Zooid> {
    if (typeof this._id !== 'number') {
      throw new Error(
        'Unable to update zooid element before attached to parent'
      );
    }

    return zooids.map((zooid) => {
      if (zooid.id !== this._id) return zooid;

      return { ...zooid, ...this._attrs };
    });
  }
}
