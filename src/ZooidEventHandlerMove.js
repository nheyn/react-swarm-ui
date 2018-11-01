// @flow
import ZooidEventHandlerChangePosition from './ZooidEventHandlerChangePosition';

import type { ZooidState, ZooidApi } from './types';
import type ZooidManager from './ZooidManager';
import type { ZooidEventFunc } from './ZooidEventHandler';

type MoveType = 'START' | 'END';

export const MOVE_TYPE = {
  START: 'START',
  END: 'END',
};

export default class ZooidEventHandlerMove
extends ZooidEventHandlerChangePosition {
  _type: MoveType;
  _isMoving: boolean;

  constructor(onEvent: ZooidEventFunc<ZooidState>, type: MoveType) {
    super(onEvent);

    this._type = type;
    this._isMoving = false;
  }

  shouldTriggerEvent(zooid: ZooidApi): boolean {
    const hasPositionChanged = super.shouldTriggerEvent(zooid);
    const shouldBeMoving = this._shouldBeMoving(hasPositionChanged);

    let shouldEventFire;
    switch (this._type) {
      case MOVE_TYPE.START:
        shouldEventFire = !this._isMoving && shouldBeMoving;
        break;
      case MOVE_TYPE.END:
        shouldEventFire = this._isMoving && !shouldBeMoving;
        break;
      default:
        throw new Error(`Invalid MOVE_TYPE: ${this._type}`);
    }

    this._isMoving = shouldBeMoving;
    return shouldEventFire;
  }

  _shouldBeMoving(hasPositionChanged: boolean): boolean {
    if (this._isMoving && !hasPositionChanged) {
      return false;
    }
    else if (!this._isMoving && hasPositionChanged) {
      return true;
    }

    return this._isMoving;
  }
}
