// @flow
import WebSocket from "ws";

export type ZooidId = number;

type ZooidStatus = number; //TODO, replace with union

type ZooidDimentions = [number, number];

type ZooidPosition = [number, number];

type ZooidColor = [number, number, number];

export type Zooid = {
  id: number,
  siz: number,
  ang: number,
  pos: ZooidPosition,
  des: ZooidPosition,
  sta: ZooidStatus,
  her: boolean,
  col: ZooidColor,
  act: boolean,
  rea: boolean,
  vel: number,
};

type State = {
  ass: number,
  nb: number,
  dim: ZooidDimentions,
  zoo: Array<Zooid>,
};

export default class ZooidManager {
  _state: State;
  _isUpdating: boolean;
  _subscribers: Array<(zm: ZooidManager) => void>;
  _ws: void | WebSocket;

  constructor(socketUrl: string) {
    this._state = {
      ass: 0,
      nb: 0,
      dim: [0, 0],
      zoo: [],
    };
    this._isUpdating = false;
    this._subscribers = [];
    this._ws = undefined;

    const ws = new WebSocket(socketUrl);
    ws.on('open', () => {
      this._ws = ws;
      this._ws.on('message', (message) => {
        this._state = JSON.parse(message);
        this._subscribers.forEach((subscriber) => subscriber(this));
      });
    });
  }

  getTableDimentions(): ZooidDimentions {
    return this._state.dim;
  }

  getNumberOfZooids(): number {
    return this._state.nb;
  }

  setZooids(
    update: (zooids: Array<Zooid>) => Array<Zooid>
  ): Promise<Array<Zooid>> {
    return new Promise((resolve, reject) => {
      // If the socket hasn't been connected, wait for the first message
      const ws = this._ws;
      if (ws === undefined) {
        const unsubscribe = this.subscribe(() => {
          unsubscribe();
          resolve(this.setZooids(update));
        });
        return;
      }

      // If there is an update already started
      if (this._isUpdating) {
        const unsubscribe = this.subscribe(() => {
          if (this._isUpdating) return;

          unsubscribe();
          resolve(this.setZooids(update));
        });
        return;
      }

      // Peform updates
      const zoo = Array.isArray(update)? update: update(this._state.zoo);

      this._isUpdating = true;
      ws.send(JSON.stringify({ ...this._state, zoo }), (err) => {
        this._isUpdating = false;
        if (err) {
          reject(err);
          return;
        }

        const unsubscribe = this.subscribe(() => {
          unsubscribe();
          resolve(this._state.zoo);
        });
      });
    });
  }

  subscribe(subscriber: (zm: ZooidManager) => any): () => any {
    this._subscribers = [
      ...this._subscribers,
      subscriber,
    ];

    return () => {
      this._subscribers = this._subscribers.filter((sub) => sub !== subscriber);
    };
  }
}
