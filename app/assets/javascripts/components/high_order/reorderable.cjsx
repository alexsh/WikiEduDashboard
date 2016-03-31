React             = require 'react'
RDnD              = require 'react-dnd'
{ findDOMNode }   = require 'react-dom'
DragSource        = RDnD.DragSource
DropTarget        = RDnD.DropTarget

# This component is used for components which function both as draggable
# items and also as their own "drop targets". As of 8/12/2015 the Block
# component is the only implementation of this concept.

# An overview of React-DnD, explaining the concepts summarized below
# http://gaearon.github.io/react-dnd/docs-overview.html

# param {React Component} Component - The component to be given reorderable properties
# param {String} Type - The kind of data model represented by the Component
# param {String} MoveFunction - The name of the function (in the props) to run when an item is moved
module.exports = (Component, Type, MoveFunction) ->

  console.log 'in reorderable'
  # These functions allow us to modify how the
  # draggable component reacts to drag-and-drop events
  dragSourceSpec =
    beginDrag: (props) ->
      document.body.classList.add('unselectable')
      props: props
      item: props[Type],
      originalIndex: props.index
    isDragging: (props, monitor) ->
      props[Type].id == monitor.getItem().item.id
    canDrag: (props, monitor) ->
      if props.canDrag?
        props.canDrag
      else
        true
    endDrag: ->
      document.body.classList.remove('unselectable')

  # Returns props to inject into the draggable component
  sourceConnect = (connect, monitor) ->
    connectDragSource: connect.dragSource()
    connectDragPreview: connect.dragPreview()
    isDragging: monitor.isDragging()


  # Returns props to inject into the drag target component
  targetConnect = (connect, monitor) ->
    connectDropTarget: connect.dropTarget()

  # Simple wrapper for rendering the passed Component as draggable or not
  Reorderable = React.createClass
    displayName: 'Reorderable'
    render: ->
      `<Component {...this.props} />`

