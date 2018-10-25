// @flow

import type { ZooidUpdate } from './ZooidDocument';
import type { ZooidId } from './ZooidIdTracker';
import type { Zooid } from './ZooidManager';

type ZoidAttribues = $Shape<$Rest<Zooid, {|id: ZooidId|}>>;

export default class ZooidElement {
  _attrs:  ZoidAttribues;
  _id: void | ZooidId;
  _elementDidUpdate: () => Promise<ZooidElement>;

  constructor(attrs: ZoidAttribues) {
    this._attrs = attrs;
    this._id = undefined;
    this._elementDidUpdate = () => Promise.resolve(this);
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

  detachParent(): number {
    const id = this._id;
    if (typeof id !== 'number') {
      throw new Error('Unable to detachParent(..) element with no parent');
    }

    this._id = undefined;
    this._elementDidUpdate = () => Promise.resolve(this);

    return id;
  }
}
