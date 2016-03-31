import React from 'react';
import Reorderable from '../high_order/reorderable.jsx';

const OrderableBlock = React.createClass({
  displayName: 'OrderableBlock',

  propTypes: {
    title: React.PropTypes.string.isRequired,
    kind: React.PropTypes.string.isRequired,
    disableUp: React.PropTypes.bool.isRequired,
    disableDown: React.PropTypes.bool.isRequired,
    canDrag: React.PropTypes.bool.isRequired,
    onDrag: React.PropTypes.func.isRequired,
    onMoveUp: React.PropTypes.func.isRequired,
    onMoveDown: React.PropTypes.func.isRequired
  },

  render() {
    return (
      <div className="block block--orderable">
        <h4 className="block-title">{this.props.title}</h4>
        <p>{this.props.kind}</p>
        <button onClick={this.props.onMoveDown} className="button border" aria-label="Move block down" disabled={this.props.disableDown}><i className="icon icon-arrow-down" /></button>
        <button onClick={this.props.onMoveUp} className="button border" aria-label="Move block up" disabled={this.props.disableUp}><i className="icon icon-arrow-up" /></button>
      </div>
    );
  }
});

export default Reorderable(OrderableBlock, 'block', 'onDrag');
