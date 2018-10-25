// @flow

import type { ZooidUpdate } from './ZooidDocument';
import type { ZooidId, Zooid } from './ZooidManager';

type ZoidAttribues = $Shape<$Rest<Zooid, {|id: ZooidId|}>>;

export default class ZooidElement {
  _attrs:  ZoidAttribues;
  _id: void | ZooidId;
  _elementDidUpdate: () => Promise<ZooidElement>;

  constructor(attrs: ZoidAttribues) {
    this._attrs = attrs;
    this.detachParent();
  }

  update(newAttrs?: ZoidAttribues): Promise<ZooidElement> {
    if (newAttrs !== undefined) this._attrs = newAttrs;

    return this._elementDidUpdate();
  }

  attachParent(
    id: ZooidId,
    elementDidUpdate: (updates: ZooidUpdate) => Promise<any>
  ) {
    this._id = id;
    this._elementDidUpdate = async () => {
      if (typeof this._id !== 'number') return this;
      if (typeof this._elementDidUpdate !== 'function') return this;

      await elementDidUpdate({ id: this._id, ...this._attrs });
      return this;
    };
  }

  detachParent() {
    this._id = undefined;
    this._elementDidUpdate = () => Promise.resolve(this);
  }
}
