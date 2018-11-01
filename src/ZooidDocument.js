// @flow
import ZooidElement from './ZooidElement';

import type ZooidEnvironment  from './ZooidEnvironment';

export default class ZooidDocument extends ZooidElement<*, *, *> {
  constructor(zooidEnvironment: ZooidEnvironment) {
    super({}, {}, []);

    this._zooidEnvironment = zooidEnvironment;
  }
}
