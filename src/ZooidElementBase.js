// @flow
import type ZooidIdTracker from './ZooidIdTracker';
import type { Zooid } from './types';

export default class ZooidElementBase {
  _children: Array<ZooidElementBase>;
  _idTracker: void | ZooidIdTracker;
  _sendUpdates: void | () => Promise<ZooidElementBase>;

  constructor() {
    this._children = [];
    this._idTracker = undefined;
    this._sendUpdates = undefined;
  }

  // External Public API
  appendChild(child: ZooidElementBase) {
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

  removeChild(child: ZooidElementBase) {
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

  // Internal Subclass API
  async commitUpdates(): Promise<ZooidElementBase> {
    if (typeof this._sendUpdates !== 'function') return this;

    await this._sendUpdates();
    return this;
  }

  getZooidUpdates(zooids: Array<Zooid>): Array<Zooid> {
    return this.updateZooids(
      this._children.reduce(
        (currZooids, child) => child.getZooidUpdates(currZooids),
        zooids
      )
    );
  }

  // Methods for Subclass to override
  elementWillAppendChild(child: ZooidElementBase) {
    //NOTE, override in subclass to check the child can be added, throw an Error
    //      for react-reconclier to catch if not
  }

  elementDidAppendChild(child: ZooidElementBase) {
    //NOTE, override in subclass to make any changes after the child has
    //      been attached
  }

  elementWillRemoveChild(child: ZooidElementBase) {
    //NOTE, override in subclass to check the child can be removed, throw an
    //      Error for react-reconclier to catch if not
  }

  elementDidRemoveChild(child: ZooidElementBase) {
    //NOTE, override in subclass to make any changes after the child has
    //      been removed
  }

  elementWillAttachToParent(parent: ZooidElementBase) {
    //NOTE, override in subclass check parent can be attached, throw an Error
    //      for react-reconclier to catch if not
  }

  elementDidAttachToParent(parent: ZooidElementBase) {
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

  updateZooids(zooids: Array<Zooid>): Array<Zooid> {
    //NOTE, override in subclass with all the updates it performs to the zooids

    throw new Error('The updateZooids(...) method must be overriden');
  }

  // Private methods
  _attachParent(parent: ZooidElementBase, peformAttach: () => void) {
    this.elementWillAttachToParent(parent);

    peformAttach();

    this._idTracker = parent._getChildIdTracker(this);
    this._sendUpdates = () => parent.commitUpdates();

    this.elementDidAttachToParent(parent);
  }

  _detachParent(peformDetach: () => void) {
    this.elementWillDetachFromParent();

    this._idTracker = undefined;
    this._sendUpdates = undefined;

    peformDetach();

    this.elementDidDetachFromParent();
  }

  _getChildIdTracker(child: ZooidElementBase): ZooidIdTracker {
    if (this._idTracker === undefined) {
      throw new Error(
        'Unable to get child tracker until attached to its own parent'
      );
    }

    // TODO, update to get a tracker that will keep id in the same subtrees
    return this._idTracker;
  }
}
