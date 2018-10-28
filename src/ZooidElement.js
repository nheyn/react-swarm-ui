// @flow

import type ZooidEventHandler from './ZooidEventHandler';
import type ZooidManager from './ZooidManager';
import type { Zooid } from './types';

export default class ZooidElement {
  _children: Array<ZooidElement>;
  _zooidManager: void | ZooidManager;

  constructor() {
    this._children = [];
    this._zooidManager = undefined;
  }

  // External Public API
  appendChild(child: ZooidElement) {
    if (this._children.includes(child)) {
      throw new Error('Unable append child that has already been appended');
    }
    this.elementWillAppendChild(child);

    let didAttach = false;
    child._attachParent(this, () => {
      this._children = [
        ...this._children,
        child,
      ];
      didAttach = true;
    });
    if (!didAttach) throw new Error('Child was unable to attach to its parent');

    this.commitUpdates();
    this.elementDidAppendChild(child);
  }

  removeChild(child: ZooidElement) {
    if (!this._children.includes(child)) {
      throw new Error('Unable remove child that has not been appended');
    }
    this.elementWillRemoveChild(child);

    let didDetach = false;
    child._detachParent(() => {
      this._children = this._children.filter((existingChild) => {
        if (existingChild !== child) return true;

        didDetach = true;
        return false;
      });
    });
    if (!didDetach) {
      throw new Error('Child was unable to be removed from its parent');
    }

    this.commitUpdates();
    this.elementDidRemoveChild(child);
  }

  getZooidManagerFor<T>(
    child: ZooidElement | ZooidEventHandler<T>
  ): ZooidManager {
    if (this._zooidManager === undefined) {
      throw new Error(
        'Unable to get child tracker until attached to its own parent'
      );
    }

    // TODO, update to get a tracker that will keep id in the same subtrees
    return this._zooidManager;
  }

  // Internal Subclass API
  async commitUpdates(): Promise<ZooidElement> {
    if (this._zooidManager === undefined) return this;

    await this.updateElement(this._zooidManager);

    return this;
  }

  // Methods for Subclass to override
  elementWillAppendChild(child: ZooidElement) {
    //NOTE, override in subclass to check the child can be added, throw an Error
    //      for react-reconclier to catch if not
  }

  elementDidAppendChild(child: ZooidElement) {
    //NOTE, override in subclass to make any changes after the child has
    //      been attached
  }

  elementWillRemoveChild(child: ZooidElement) {
    //NOTE, override in subclass to check the child can be removed, throw an
    //      Error for react-reconclier to catch if not
  }

  elementDidRemoveChild(child: ZooidElement) {
    //NOTE, override in subclass to make any changes after the child has
    //      been removed
  }

  elementWillAttachToParent(parent: ZooidElement) {
    //NOTE, override in subclass check parent can be attached, throw an Error
    //      for react-reconclier to catch if not
  }

  elementDidAttachToParent(parent: ZooidElement) {
    //NOTE, override in subclass to make any changes after the parent has
    //      been attached
  }

  elementWillDetachFromParent() {
    //NOTE, override in subclass check parent can be detached, throw an Error
    //      for react-reconclier to catch if not
  }

  elementDidDetachFromParent() {
    //NOTE, override in subclass to make any changes after the parent has
    //      been detached
  }

  updateElement(zooidManager: ZooidManager): any {
    //NOTE, override in subclass to perform updates to the zooids
  }

  // Private methods
  _attachParent(parent: ZooidElement, peformAttach: () => void) {
    this.elementWillAttachToParent(parent);

    peformAttach();
    this._zooidManager = parent.getZooidManagerFor(this);

    this.commitUpdates();
    this.elementDidAttachToParent(parent);
  }

  _detachParent(peformDetach: () => void) {
    this.elementWillDetachFromParent();

    this._zooidManager = undefined;
    peformDetach();

    this.commitUpdates();
    this.elementDidDetachFromParent();
  }
}
