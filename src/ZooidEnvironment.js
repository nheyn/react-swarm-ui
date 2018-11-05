// @flow

import type { ZooidApi, ZooidDimentions, ZooidPosition } from './types';
import type ZooidIdTracker from './ZooidIdTracker';
import type ZooidManager from './ZooidManager';

export default class ZooidEnvironment {
  _zooidManager: ZooidManager;
  _zooidIdTracker: ZooidIdTracker;
  _zooidDimentions: ZooidDimentions;
  _zooidPosition: ZooidPosition;
  _parent: void | ZooidEnvironment;

  constructor(
    zooidManager: ZooidManager,
    zooidIdTracker: ZooidIdTracker,
    zooidDimentions: ZooidDimentions,
    zooidPosition: ZooidPosition,
    parentEnvironment?: ZooidEnvironment
  ) {
    this._zooidManager = zooidManager;
    this._zooidIdTracker = zooidIdTracker;
    this._zooidDimentions = zooidDimentions;
    this._zooidPosition = zooidPosition;
    this._parent = parentEnvironment;

    this._zooidIdTracker.subscribeTo(this._zooidManager);
  }

  getChildEnvironment(): ZooidEnvironment {
    return new ZooidEnvironment(
      this._zooidManager,
      this._zooidIdTracker,
      this._zooidDimentions,
      [0, 0],
      this
    );
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

  getDimentions(): ZooidDimentions {
    return this._zooidDimentions;
  }

  getPosition(): ZooidPosition {
    if (this._parent === undefined) return this._zooidPosition;
    const parentPosition = this._parent.getDimentions();

    return [
      parentPosition[0] + this._zooidPosition[0],
      parentPosition[1] + this._zooidPosition[1]
    ];
  }

  setDimentions(zooidDimentions: ZooidDimentions) {
    this._zooidDimentions = zooidDimentions
  }

  setPosition(zooidPosition: ZooidPosition) {
    this._zooidPosition = zooidPosition
  }

  resetDimentions() {
    if (this._parent === undefined) return;

    this._zooidDimentions = this._parent._zooidDimentions;
  }

  resetPosition() {
    if (this._parent === undefined) return;

    this._zooidPosition = this._parent._zooidPosition;
  }

  close() {
    this._zooidIdTracker.unsubscribe();
    this._zooidManager.close();
  }
}
