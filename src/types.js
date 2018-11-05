// @flow
export type ZooidId = number;

export type ZooidStatus = number; //TODO, replace with union

export type ZooidDimentions = [number, number];

export type ZooidPosition = [number, number];

export type ZooidColor = [number, number, number];

export type ZooidState = {
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

export type ZooidsState = {
  ass: number,
  nb: number,
  dim: ZooidDimentions,
  zoo: Array<ZooidState>,
};export type Unsubscribe = () => any;

export type ZooidUpdates = $Shape<$Rest<ZooidState, {|id: ZooidId|}>>;

export type ZooidApi = {
  id: ZooidId,
  getState: () => ZooidState,
  update: (updates: ZooidUpdates) => Promise<ZooidState>,
  subscribe: (subscriber: Subscriber<ZooidState>) => Unsubscribe,
  release: Unsubscribe,
};

export type Subscriber<T> = (t: T, unsub: Unsubscribe) => any;
