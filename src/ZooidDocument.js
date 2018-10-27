// @flow
import ZooidElementBase from './ZooidElementBase';

import type { Zooid } from './types';
import type ZooidIdTracker from './ZooidIdTracker';
import type ZooidManager  from './ZooidManager';

export default class ZooidDocument extends ZooidElementBase {
  _zooidManager: ZooidManager;

  constructor(idTracker: ZooidIdTracker, zooidManager: ZooidManager) {
    super();

    this._zooidManager = zooidManager;

    this._idTracker = idTracker;
    this._sendUpdates = async () => {
      console.log('ZooidDocument._sendUpdates');
      await this._zooidManager.setZooids(
        (zooids) => this.getZooidUpdates(zooids)
      );
      return this;
    };

    this._idTracker.subscribeTo(this._zooidManager);
  }

  updateZooids(zooids: Array<Zooid>): Array<Zooid> {
    return zooids;
  }

  close() {
    this._zooidManager.close();

    if (this._idTracker === undefined) return;
    this._idTracker.unsubscribe();
  }
}
