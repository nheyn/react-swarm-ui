// @flow
import type ZooidElement from './ZooidElement';
import type ZooidIdTracker, { ZooidId } from './ZooidIdTracker';
import type ZooidManager, { Zooid } from './ZooidManager';

export type ZooidUpdate = $Shape<Zooid> & { id: ZooidId };

export default class ZooidDocument {
  _zooidManager: ZooidManager;
  _idTracker: ZooidIdTracker;
  _children: Array<ZooidElement>;

  constructor(zooidManager: ZooidManager, idTracker: ZooidIdTracker) {
    this._zooidManager = zooidManager;
    this._idTracker = idTracker;
    this._children = [];

    this._idTracker.subscribeTo(this._zooidManager);
  }

  appendChild(zooidElement: ZooidElement) {
    let childEl = this._children.find((el) => el === zooidElement);
    if (childEl === undefined) {
      this._children = [
        ...this._children,
        zooidElement,
      ];
      childEl = zooidElement;

      childEl.attachParent(
        this._idTracker.getId(),
        (updates) => this._updateZooid(updates)
      );
    }

    childEl.update();
  }

  removeChild(zooidElement: ZooidElement) {
    this._children.filter((child) => {
      if (child !== zooidElement) return true;

      const oldId = child.detachParent();
      this._idTracker.giveId(oldId);

      return false;
    });
  }

  close() {
    this._idTracker.unsubscribe();
    this._zooidManager.close();
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
