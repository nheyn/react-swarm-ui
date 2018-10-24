// @flow
import WebSocket from "ws";

type ZooidId = number;

type ZooidStatus = number; //TODO, replace with union

type ZooidDimention = [number, number];

type ZooidPosition = [number, number];

type ZooidColor = [number, number, number];

type Zooid = {
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
  dim: ZooidDimention,
  zoo: Array<Zooid>,
};

const emptyState = {
  ass: 0,
  nb: 0,
  dim: [0, 0],
  zoo: [],
};

export default class ZooidManager {
  _state: State;
  _lastMessage: string;
  _subscribers: Array<(s: State) => void>;
  _ws: void | WebSocket;

  constructor(socketUrl: string) {
    this._state = emptyState,
    this._lastMessage = '';
    this._subscribers = [];
    this._ws = undefined;

    const ws = new WebSocket(socketUrl);
    ws.on('open', () => {
      this._ws = ws;
      this._ws.on('message', (message) => this._onMessage(message));
    });
    ws.on('error', (err) => {
      console.error(err);
      this._ws = undefined;
    });
  }

  isConnected() {
    return this._ws !== undefined;
  }

  getState(): State {
    return this._state;
  }

  setState(update: (state: State) => State): Promise<State> {
    return new Promise((resolve, reject) => {
      const ws = this._ws;
      if (ws === undefined) {
        throw new Error('Cannot setState(...) unless ws is connected');
      }

      const updatedState = update(this._state);
      ws.send(JSON.stringify(updatedState), (err) => {
        if (err) reject(err);
        else resolve(updatedState);
      });
    });
  }

  subscribe(subscriber: (state: State) => any): () => any {
    this._subscribers = [
      ...this._subscribers,
      subscriber,
    ];

    return () => {
      this._subscribers = this._subscribers.filter((sub) => sub !== subscriber);
    };
  }

  _onMessage(message: string) {
    if (message === this._lastMessage) return;
    this._lastMessage = message;

    this._state = JSON.parse(message);
    this._subscribers.forEach((subscriber) => subscriber(this.getState()));
  }
}
