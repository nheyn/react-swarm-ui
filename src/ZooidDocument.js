// @flow
import type ZooidElement from './ZooidElement';
import type ZooidManager, { ZooidId, Zooid } from './ZooidManager';

export type ZooidUpdate = $Shape<Zooid> & { id: ZooidId };

export default class ZooidDocument {
  _zooidManager: ZooidManager;
  _children: Array<ZooidElement>;

  //TODO, replace this
  _i: number;

  constructor(zooidManager: ZooidManager) {
    this._zooidManager = zooidManager;
    this._children = [];
    this._i = 0;
  }

  appendChild(zooidElement: ZooidElement) {
    //TODO, move this outside of this call (so it doesn't use _zooidManager.subscribers as a queue)
    if (this._zooidManager.getNumberOfZooids() === 0) {
      const unsubscribe = this._zooidManager.subscribe(() => {
        unsubscribe();

        this.appendChild(zooidElement);
      });
      return;
    }

    let childEl = this._children.find((el) => el === zooidElement);
    if (childEl === undefined) {
      this._children = [
        ...this._children,
        zooidElement,
      ];
      childEl = zooidElement;

      childEl.attachParent(
        this._getAvailableZooidId(),
        (updates) => this._updateZooid(updates)
      );
    }

    childEl.update();
  }

  _getAvailableZooidId(): number {
    const nextId = this._i;
    if (nextId > this._zooidManager.getNumberOfZooids()) {
      throw new Error(
        `Cannot render more then the available ${
          this._zooidManager.getNumberOfZooids()
        } zooids at once`
      );
    }
    else {
      this._i += 1;
    }

    return nextId;
  }

  async _updateZooid(updates: ZooidUpdate): Promise<ZooidDocument> {
    await this._zooidManager.setZooids((zooids) => zooids.map(
      (zooid) => {
        if (zooid.id !== updates.id) return zooid;

        return { ...zooid, ...updates };
      },
    ));

    return this;
  }
}
