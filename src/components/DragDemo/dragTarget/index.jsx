import React, {
  PureComponent,
} from 'react';
import PropTypes from 'prop-types';
import { DropTarget } from 'react-dnd';

const boxTarget = {
  drop() {
    return { name: 'Dustbin' }
  },
};
const style = {
  height: '12rem',
  width: '12rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  color: 'white',
  padding: '1rem',
  textAlign: 'center',
  fontSize: '1rem',
  lineHeight: 'normal',
  float: 'left',
};
class DragTargetNode extends PureComponent {
  static propTypes = {
    className : PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    isOver: PropTypes.bool.isRequired,
    canDrop: PropTypes.bool.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
  };
  static defaultProps = {
    className: '',
  };
  render() {
    const {
      isOver,
      canDrop,
    } = this.props;
    const isActive = canDrop && isOver;
    let backgroundColor = '#222';
    if (isActive) {
      backgroundColor = 'darkgreen'
    } else if (canDrop) {
      backgroundColor = 'darkkhaki'
    }
    return (
      <div style={{ ...style, backgroundColor }}>
        {isActive ? 'Release to drop' : 'Drag a box here'}
      </div>
    )
  }
}

export default DropTarget('demo', boxTarget, (connect, monitor) => ({
  connectDropTarget: connect.dropTarget(),
  isOver: monitor.isOver(),
  canDrop: monitor.canDrop(),
}))(DragTargetNode);
