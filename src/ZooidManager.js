// @flow

import type WebSocket from 'ws';
import type {
  ZooidId,
  ZooidStatus,
  ZooidDimentions,
  ZooidPosition,
  ZooidColor,
  ZooidState,
  ZooidsState,
  Unsubscribe,
  Subscriber,
} from './types';

export default class ZooidManager {
  _ws: void | WebSocket;
  _state: ZooidsState;
  _subscribers: Array<() => void>;
  _isUpdating: bool;
  _nextUpdate: void | (zooids: Array<ZooidState>) => Array<ZooidState>;

  constructor(ws: WebSocket) {
    this._ws = undefined;
    this._state = {
      ass: 0,
      nb: 0,
      dim: [0, 0],
      zoo: [],
    };
    this._subscribers = [];
    this._isUpdating = false;
    this._nextUpdate = undefined;

    ws.on('open', () => {
      this._ws = ws;
      this._ws.on('message', (message) => {
        this._state = JSON.parse(message);
        if (this._state.nb < 1) return;

        this._subscribers.forEach((subscriber) => subscriber());
      });
    });
  }

  getTableDimentions(): ZooidDimentions {
    return this._state.dim;
  }

  getNumberOfZooids(): number {
    return this._state.nb;
  }

  getZooids(): Array<ZooidState> {
    return this._state.zoo;
  }

  setZooids(
    update: (zooids: Array<ZooidState>) => Array<ZooidState>
  ): Promise<Array<ZooidState>> {
    return new Promise((resolve, reject) => {
      // If there is an update already started
      if (this._isUpdating) {
        const queuedUpdates = this._nextUpdate;
        if (typeof queuedUpdates === 'function') {
          this._nextUpdate = (zooids) => update(queuedUpdates(zooids))
        }
        else {
          this._nextUpdate = update;
        }
        return;
      }
      this._isUpdating = true;

      // If the socket hasn't been connected, wait for the first message
      const ws = this._ws;
      if (ws === undefined) {
        this._nextUpdate = update;
        this.subscribe((_, unsubscribe) => {
          unsubscribe();
          resolve(this.setZooids((zooids) => zooids));
        });
        return;
      }

      // Peform updates
      const zoo = Array.isArray(update)? update: update(this._state.zoo);
      ws.send(JSON.stringify({ ...this._state, zoo }), (err) => {
        if (err) {
          reject(err);
          return;
        }

        // Wait for updated _state
        setTimeout(() => {
          this.subscribe((_, unsubscribe) => {
            unsubscribe();
            resolve(this._state.zoo);

            // 'Unlock' setZooids(...)
            const nextUpdate = this._nextUpdate;
            this._nextUpdate = undefined;
            this._isUpdating = false;

            // Peform all updates waiting in the queue
            if (typeof nextUpdate === 'function') this.setZooids(nextUpdate);
          });
        }, 1000 / 60);
      });
    });
  }

  subscribe(subscriber: Subscriber<ZooidManager>): Unsubscribe {
    let wrappedSubscriber;
    let unsubscribe = () => {};
    wrappedSubscriber = () => {
      subscriber(this, unsubscribe);
    };
    unsubscribe = () => {
      this._subscribers = this._subscribers.filter(
        (sub) => sub !== wrappedSubscriber
      );
    };

    this._subscribers = [
      ...this._subscribers,
      wrappedSubscriber,
    ];
    return unsubscribe;
  }

  close() {
    if (this._ws === undefined) return;

    this._ws.close();
  }
}
