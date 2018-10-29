// @flow

import type ZooidEventHandler from './ZooidEventHandler';
import type ZooidManager from './ZooidManager';
import type { Zooid } from './types';

export default class ZooidElement<
  AS: $ReadOnly<{}>,
  ES: $ReadOnly<$Shape<{[key: string]: ZooidEventHandler<any>}>>,
  CN: $ReadOnlyArray<ZooidElement<any, any, any>>
>  {
  _attrs: AS;
  _eventHandlers: ES;
  _children: CN;
  _zooidManager: void | ZooidManager;

  constructor(attrs: AS, eventHandlers: ES, children: CN) {
    this._attrs = attrs;
    this._eventHandlers = eventHandlers;
    this._children = children;
    this._zooidManager = undefined;
  }

  // External Public API
  updateAttrs(newAttrs: AS): Promise<ZooidElement<AS, ES, CN>> {
    this._attrs = newAttrs;
    return this.commitUpdates();
  }

  updateEventHandlers(eventHandlers: ES): Promise<ZooidElement<AS, ES, CN>> {
    this._detachAllEventHandlers();
    this._eventHandlers = eventHandlers;

    return this.commitUpdates();
  }

  async appendChild(child: ZooidElement<any, any, any>): Promise<ZooidElement<AS, ES, CN>> {
    if (this._children.includes(child)) {
      throw new Error('Unable append child that has already been appended');
    }
    this.elementWillAppendChild(child);

    let didAttach = false;
    await child._attachParent(this, () => {
      this._children = [
        ...this._children,
        child,
      ];
      didAttach = true;
    });
    if (!didAttach) throw new Error('Child was unable to attach to its parent');

    await this.commitUpdates();
    this.elementDidAppendChild(child);

    return this;
  }

  async removeChild(child: ZooidElement<any, any, any>): Promise<ZooidElement<AS, ES, CN>> {
    if (!this._children.includes(child)) {
      throw new Error('Unable remove child that has not been appended');
    }
    this.elementWillRemoveChild(child);

    let didDetach = false;
    await child._detachParent(() => {
      this._children = this._children.filter((existingChild) => {
        if (existingChild !== child) return true;

        didDetach = true;
        return false;
      });
    });
    if (!didDetach) {
      throw new Error('Child was unable to be removed from its parent');
    }

    await this.commitUpdates();
    this.elementDidRemoveChild(child);

    return this;
  }

  // Internal Subclass API
  async commitUpdates(): Promise<ZooidElement<AS, ES, CN>> {
    if (this._zooidManager === undefined) return this;

    this._attachAllEventHandlers();
    await this.updateElement();

    return this;
  }

  // Methods for Subclass to override
  elementWillAppendChild(child: ZooidElement<any, any, any>) {
    //NOTE, override in subclass to check the child can be added, throw an Error
    //      for react-reconclier to catch if not
  }

  elementDidAppendChild(child: ZooidElement<any, any, any>) {
    //NOTE, override in subclass to make any changes after the child has
    //      been attached
  }

  elementWillRemoveChild(child: ZooidElement<any, any, any>) {
    //NOTE, override in subclass to check the child can be removed, throw an
    //      Error for react-reconclier to catch if not
  }

  elementDidRemoveChild(child: ZooidElement<any, any, any>) {
    //NOTE, override in subclass to make any changes after the child has
    //      been removed
  }

  elementWillAttachToParent(parent: ZooidElement<any, any, any>) {
    //NOTE, override in subclass check parent can be attached, throw an Error
    //      for react-reconclier to catch if not
  }

  elementDidAttachToParent(parent: ZooidElement<any, any, any>) {
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

  updateElement(): any {
    //NOTE, override in subclass to perform updates to the zooids
  }

  // Private methods
  async _attachParent(
    parent: ZooidElement<any, any, any>,
    peformAttach: () => void
  ): Promise<ZooidElement<AS, ES, CN>>  {
    this.elementWillAttachToParent(parent);

    peformAttach();
    this._zooidManager = parent._zooidManager;

    await this.commitUpdates();
    this.elementDidAttachToParent(parent);

    return this;
  }

  async _detachParent(
    peformDetach: () => void
  ): Promise<ZooidElement<AS, ES, CN>>  {
    this.elementWillDetachFromParent();

    this._zooidManager = undefined;
    peformDetach();

    await this.commitUpdates();
    this.elementDidDetachFromParent();

    return this;
  }

  _attachAllEventHandlers() {
    for (let name in this._eventHandlers) {
      this._eventHandlers[name].attachTo(this);
    }
  }

  _detachAllEventHandlers() {
    for (let name in this._eventHandlers) {
      this._eventHandlers[name].detach();
    }
  }
}
