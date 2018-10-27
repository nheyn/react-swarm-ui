// @flow
import ZooidElementBase from './ZooidElementBase';

import type { Zooid } from './types';
import type ZooidManager  from './ZooidManager';

export default class ZooidDocument extends ZooidElementBase {
  constructor(zooidManager: ZooidManager) {
    super();

    this._zooidManager = zooidManager;
  }

  updateZooids(zooids: Array<Zooid>): Array<Zooid> {
    return zooids;
  }
}
