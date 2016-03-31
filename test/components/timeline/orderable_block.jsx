import '../../testHelper';

import React from 'react';
import ReactDOM from 'react-dom';
import ReactTestUtils from 'react-addons-test-utils';
import OrderableBlock from '../../../app/assets/javascripts/components/timeline/orderable_block.jsx';

OrderableBlock.__Rewire__('Reorderable', (...args) => {
  console.log('orderable');
  args[0];
});

describe('OrderableBlock', () => {
  describe('render', () => {
    const noOp = () => {};
    const TestOrderableBlock = ReactTestUtils.renderIntoDocument(
      <OrderableBlock
        title="This is a block"
        kind="computer"
        disableUp
        disableDown
        canDrag
        onDrag={noOp}
        onMoveUp={noOp}
        onMoveDown={noOp}
      />
    );
    it('contains an h4 with the title', () => {
      const headline = ReactTestUtils.findRenderedDOMComponentWithTag(TestOrderableBlock, 'h4');
      const h4 = ReactDOM.findDOMNode(headline);
      return expect(h4.textContent).to.eq('This is a block');
    });
  });
});

OrderableBlock.__ResetDependency__('Reorderable');
