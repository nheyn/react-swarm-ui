// @flow

import type ZooidManager, { Zooid } from './ZooidManager';

type ZoidAttribues = $Shape<Zooid>;

export default class ZooidElement {
  _zooidManager: ZooidManager;
  _attrs:  ZoidAttribues;

  constructor(zooidManager: ZooidManager, attrs: ZoidAttribues) {
    this._zooidManager = zooidManager;
    this._attrs = attrs;
  }

  async update(newAttrs?: ZoidAttribues): Promise<ZooidElement> {
    if (newAttrs !== undefined) {
      if (newAttrs.id !== undefined) {
        throw new Error("Cannot update the ZooidElement's id");
      }

      this._attrs = newAttrs;
    }

    await this._zooidManager.setZooids((zooids) => zooids.map(
      (zooid) => {
        if (zooid.id !== this._attrs.id) return zooid;

        return { ...zooid, ...this._attrs };
      },
    ));

    return this;
  }
}
