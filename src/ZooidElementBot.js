// @flow
import ZooidElement from './ZooidElement';
import ZooidEventHandlerChangePosition from './ZooidEventHandlerChangePosition';

import type { ZooidId, Zooid } from './types';
import type ZooidEventHandler from './ZooidEventHandler';
import type ZooidManager from './ZooidManager';

type Attribues = $Shape<$Rest<Zooid, {|id: ZooidId|}>>;
type EventHandlers = {
  onChangePosition?: ZooidEventHandler<Zooid>,
};

export default class ZooidElementBot extends ZooidElement {
  _attrs: Attribues;
  _eventHandlers: EventHandlers;
  _id: void | ZooidId;

  constructor(attrs: Attribues, eventHandlers: EventHandlers) {
    super();

    this._attrs = attrs;
    this._eventHandlers = eventHandlers;
    this._id = undefined;
  }

  getId(): ZooidId {
    if (typeof this._id !== 'number') {
      throw new Error('ZooidElement not correctly attached to parent');
    }

    return this._id;
  }

  update(newAttrs: Attribues, eventHandlers: EventHandlers) {
    this._attrs = newAttrs;
    this._eventHandlers = eventHandlers;
    this.commitUpdates();
  }

  elementWillAppendChild(child: ZooidElement) {
    throw new Error('Zooid element cannot have children attached');
  }

  elementDidAttachToParent(parent: ZooidElement) {
    if (this._zooidManager === undefined) {
      throw new Error('ZooidElement not correctly attached to parent');
    }

    this._id = this._zooidManager.getAvailableId();
    this.commitUpdates();
  }

  elementWillDetachFromParent() {
    if (this._zooidManager === undefined || typeof this._id !== 'number') {
      throw new Error('ZooidElement not correctly attached to parent');
    }

    this._zooidManager.releaseId(this._id);
    this._id = undefined;
  }

  updateZooids(zooidManager: ZooidManager): Promise<void> {
    this._attachAllEventHandlers();

    return this._updateZooids(zooidManager);
  }

  async _updateZooids(zooidManager: ZooidManager): Promise<void> {
    const { _id: id } = this;
    if (typeof id !== 'number') return;

    await zooidManager.setZooids((zooids) => {
      return zooids.map((zooid) => {
        if (zooid.id !== id) return zooid;

        return { ...zooid, ...this._attrs };
      });
    });
  }

  _attachAllEventHandlers() {
    if (typeof this._id !== 'number') return;

    this._detachAllEvents();

    if (this._eventHandlers.onChangePosition === undefined) return;
    this._eventHandlers.onChangePosition.attachTo(this);
  }

  _detachAllEvents() {
    if (this._eventHandlers.onChangePosition === undefined) return;

    this._eventHandlers.onChangePosition.detach();
  }
}


export function getAttrsFrom(props: Object): Attribues {
  let attrs = {};
  if (props.destination !== undefined && props.destination !== null) {
    if (typeof props.destination.right !== 'number') {
      throw new Error(
        'To define a destination, the distance from the right must be provided'
      );
    }
    if (typeof props.destination.bottom !== 'number') {
      throw new Error(
        'To define a destination, the distance from the bottom must be provided'
      );
    }

    attrs = {
      ...attrs,
      des: [props.destination.right, props.destination.bottom],
    };
  }

  if (props.color !== undefined && props.color !== null) {
    if (!Array.isArray(props.color) || props.color.length !== 3) {
      throw new Error(
        'The color must be an array of [r, b, c] colors'
      );
    }

    attrs = {
      ...attrs,
      col: props.color,
    };
  }

  return attrs;
}

export function getEventHandlersFrom(props: Object): EventHandlers {
  let eventHandlers = {};
  if (props.onChangePosition !== undefined && props.onChangePosition !== null) {
    if (typeof props.onChangePosition !== 'function') {
      throw new Error('The onChangePosition must be a function');
    }

    eventHandlers = {
      ...eventHandlers,
      onChangePosition: new ZooidEventHandlerChangePosition(
        props.onChangePosition
      ),
    };
  }

  return  eventHandlers;
}
