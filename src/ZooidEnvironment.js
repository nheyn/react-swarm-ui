// @flow

import type { ZooidApi } from './types';
import type ZooidIdTracker from './ZooidIdTracker';
import type ZooidManager from './ZooidManager';

export default class ZooidEnvironment {
  _zooidManager: ZooidManager;
  _zooidIdTracker: ZooidIdTracker;

  constructor(zooidManager: ZooidManager, zooidIdTracker: ZooidIdTracker) {
    this._zooidManager = zooidManager;
    this._zooidIdTracker = zooidIdTracker;

    this._zooidIdTracker.subscribeTo(this._zooidManager);
  }

  getZooid(): ZooidApi {
    const id = this._zooidIdTracker.getId();
    const getState = () => {
      const zooid = this._zooidManager.getZooids().find(
        (currZooid) => currZooid.id === id
      );
      if (zooid === undefined) {
        throw new Error(`Cannot get zooid for invalid id ${id}`);
      }

      return zooid;
    };

    return {
      id,
      getState,
      update: async (updates) => {
        let zooid;
        await this._zooidManager.setZooids((zooids) => {
          return zooids.map((currZooid) => {
            if (currZooid.id !== id) return currZooid;

            zooid = { ...currZooid, ...updates };
            return zooid;
          });
        });
        if (zooid === undefined) {
          throw new Error(`Cannot update zooid with invalid id: ${id}`);
        }

        return zooid;
      },
      subscribe: (subscriber) => {
        return this._zooidManager.subscribe(
          (_, unsubscribe) => subscriber(getState(), unsubscribe)
        );
      },
      release: () => {
        this._zooidIdTracker.releaseId(id);
      },
    }
  }

  close() {
    this._zooidIdTracker.unsubscribe();
    this._zooidManager.close();
  }
}
