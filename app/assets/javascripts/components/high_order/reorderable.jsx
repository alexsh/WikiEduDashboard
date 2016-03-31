import React from 'react';
import { findDOMNode } from 'react-dom';
import { flow } from 'lodash';
import { DragSource, DropTarget } from 'react-dnd';

// This component is used for components which function both as draggable
// items and also as their own "drop targets". As of 8/12/2015 the Block
// component is the only implementation of this concept.

// An overview of React-DnD, explaining the concepts summarized below
// http://gaearon.github.io/react-dnd/docs-overview.html

// param {React Component} Component - The component to be given reorderable properties
// param {String} Type - The kind of data model represented by the Component
// param {String} MoveFunction - The name of the function (in the props) to run when an item is moved
export default function (Component, Type, MoveFunction) {
  console.log('reorderable');
  let Reorderable = null;
  // These functions allow us to modify how the
  // draggable component reacts to drag-and-drop events
  const dragSourceSpec = {
    beginDrag(props) {
      document.body.classList.add('unselectable');
      return {
        props,
        item: props[Type],
        originalIndex: props.index
      };
    },
    isDragging(props, monitor) {
      return props[Type].id === monitor.getItem().item.id;
    },
    canDrag(props) {
      if (props.canDrag !== null) {
        return props.canDrag;
      }
      return true;
    },
    endDrag() {
      return document.body.classList.remove('unselectable');
    }
  };

  // Returns props to inject into the draggable component
  const sourceConnect = (connect, monitor) => {
    return {
      connectDragSource: connect.dragSource(),
      connectDragPreview: connect.dragPreview(),
      isDragging: monitor.isDragging()
    };
  };
  const dragTargetSpec = {
    hover: (props, monitor) => {
      const item = monitor.getItem().item;
      const adjacent = Math.abs(item.order - props[Type].order) <= 1;
      if (item.id === props[Type].id || props.animating && adjacent) {
        return;
      }
      props[MoveFunction](item, props[Type], monitor.getItem().originalIndex);
    }
  };
  // Returns props to inject into the drag target component
  const targetConnect = (connect) => ({ connectDropTarget: connect.dropTarget() });

  // Simple wrapper for rendering the passed Component as draggable or not
  Reorderable = React.createClass({
    displayName: 'Reorderable',
    propTypes: {
      canDrag: React.PropTypes.bool,
      connectDropTarget: React.PropTypes.func,
      connectDragPreview: React.PropTypes.func,
      connectDragSource: React.PropTypes.func,
    },
    render() {
      if (this.props.canDrag) {
        const ref = (instance) => {
          this.props.connectDropTarget(findDOMNode(instance));
          this.props.connectDragSource(findDOMNode(instance), { dropEffect: 'move' });
          this.props.connectDragPreview(findDOMNode(instance));
        };
        return <Component {...this.props} ref={ref} />;
      }
      return <Component {...this.props} />;
    }
  });

  return flow(
    DragSource(Type, dragSourceSpec, sourceConnect),
    DropTarget(Type, dragTargetSpec, targetConnect)
  )(Reorderable);
}
