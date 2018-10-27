// @flow
import ZooidElement from './ZooidElement';

import type { Zooid } from './types';
import type ZooidManager  from './ZooidManager';

export default class ZooidDocument extends ZooidElement {
  constructor(zooidManager: ZooidManager) {
    super();

    this._zooidManager = zooidManager;
  }
}
