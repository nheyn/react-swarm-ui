// @flow
import ZooidElement from './ZooidElement';

import type ZooidEnvironment  from './ZooidEnvironment';

export default class ZooidDocument extends ZooidElement<*, *, *> {
  __container: *; //So this can be re-render using the render(...)

  constructor(zooidEnvironment: ZooidEnvironment) {
    super({}, {}, []);

    this._zooidEnvironment = zooidEnvironment;
  }

  onLoad(loadFunc: () => void) {
    if (this._zooidEnvironment === undefined) {
      throw new Error('ZooidDocument not constructed correctly');
    }

    this._zooidEnvironment._zooidManager.subscribe((_, unsubscribe) => {
      unsubscribe();
      loadFunc();
    });
  }
}
