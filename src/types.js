// @flow
export type ZooidId = number;

export type ZooidStatus = number; //TODO, replace with union

export type ZooidDimentions = [number, number];

export type ZooidPosition = [number, number];

export type ZooidColor = [number, number, number];

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
