// @flow
import ZooidElementBot from './ZooidElementBot';
import ZooidEventHandler from './ZooidEventHandler';

import type { ZooidPosition, ZooidState, ZooidApi } from './types';
import type ZooidElement from './ZooidElement'
import type { ZooidEvent } from './ZooidEventHandler';
import type ZooidEnvironment from './ZooidEnvironment';

export default class ZooidEventHandlerChangePosition
extends ZooidEventHandler<ZooidState> {
  _pos: void | ZooidPosition;

  onEventDidAttach(zooid: ZooidApi) {
    const { pos } = zooid.getState();
    this._pos = pos;
  }

  onEventDidDetach(zooid: ZooidApi) {
    this._pos = undefined;
  }

  shouldTriggerEvent(zooid: ZooidApi): boolean {
    const { _pos: currPos } = this;
    if (!Array.isArray(currPos)) return false;

    const { pos: nextPos, siz: size } = zooid.getState();
    this._pos = nextPos;

    const posDiffX = Math.abs(nextPos[0] - currPos[0]);
    const posDiffY = Math.abs(nextPos[1] - currPos[1]);
    const minDiff = size / 2;

    return posDiffX > minDiff || posDiffY > minDiff;
  }

  createEvent(zooid: ZooidApi): ZooidEvent<ZooidState> {
    return zooid.getState();
  }
}
