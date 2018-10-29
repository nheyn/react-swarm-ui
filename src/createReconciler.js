// @flow
import createReactReconciler from 'react-reconciler';

import ZooidElementBot from './ZooidElementBot';
import ZooidEventHandlerChangePosition from './ZooidEventHandlerChangePosition';
import ZooidEventHandlerMove, { MOVE_TYPE } from './ZooidEventHandlerMove';

import type { Attribues, EventHandlers } from './ZooidElementBot';


export default function createReconciler() {
  const rootHostContext = {};
  const childHostContext = {};

  return createReactReconciler({
    now: Date.now,
    getRootHostContext() {
      return rootHostContext;
    },
    getChildHostContext() {
      return childHostContext;
    },
    prepareForCommit() {
      //console.log('prepareForCommit');
    },
    resetAfterCommit() {
      //console.log('resetAfterCommit');
    },
    shouldSetTextContent() {
      return false;
    },
    createInstance(type, props, zooidDocument) {
      if (type !== 'zooid') {
        throw new Error('Only zooid type elements can be used');
      }

      return new ZooidElementBot(
        getAttrsFrom(props),
        getEventHandlersFrom(props)
      );
    },
    createTextInstance() {
      throw new Error('No text instances are possiable for react-swarm-ui');
    },
    finalizeInitialChildren(instance, type, props) {
      //console.log('finalizeInitialChildren');
    },
    appendInitialChild(parent, child) {
      //TODO, add 'ZooidAreaElement' class for this
      throw new Error('NYI: ZooidAreaElement');
    },
    appendChildToContainer(zooidDocument, child) {
      zooidDocument.appendChild(child).catch((err) => {
        console.error('Unable to appendChildToContainer:', err);
      });
    },
    removeChildFromContainer(zooidDocument, child) {
      zooidDocument.removeChild(child).catch((err) => {
        console.error('Unable to removeChildFromContainer:', err);
      });
    },
    getPublicInstance(...args) {
      //console.log('getPublicInstance', args);
    },
    supportsMutation: true,
    prepareUpdate(instance, type, oldProps, newProps) {
      //console.log('prepareUpdate', type);
      return true;
    },
    appendChild(parent, child) {
      //console.log('appendChild');
      parent.appendChild(child).catch((err) => {
        console.error('Unable to appendChild:', err);
      });
    },
    removeChild(parent, child) {
      //console.log('removeChild');
      parent.removeChild(child).catch((err) => {
        console.error('Unable to removeChild:', err);
      });
    },
    commitUpdate(instance, _, type, oldProps, newProps) {
      Promise.all([
        instance.updateAttrs(getAttrsFrom(newProps)),
        instance.updateEventHandlers(getEventHandlersFrom(newProps)),
      ]).catch((err) => {
        console.error('Unable to commitUpdate:', err);
      });
    },
  });
}

function getAttrsFrom(props: Object): Attribues {
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

function getEventHandlersFrom(props: Object): EventHandlers {
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

  if (props.onStartMove !== undefined && props.onStartMove !== null) {
    if (typeof props.onStartMove !== 'function') {
      throw new Error('The onStartMove must be a function');
    }

    eventHandlers = {
      ...eventHandlers,
      onStartMove: new ZooidEventHandlerMove(
        props.onStartMove,
        MOVE_TYPE.START
      ),
    };
  }

  if (props.onEndMove !== undefined && props.onEndMove !== null) {
    if (typeof props.onEndMove !== 'function') {
      throw new Error('The onEndMove must be a function');
    }

    eventHandlers = {
      ...eventHandlers,
      onEndMove: new ZooidEventHandlerMove(
        props.onEndMove,
        MOVE_TYPE.END
      ),
    };
  }

  return  eventHandlers;
}
