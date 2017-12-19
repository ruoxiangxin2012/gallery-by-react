import React, {
  PureComponent,
} from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';

const style = {
  border: '1px dashed gray',
  backgroundColor: 'white',
  padding: '0.5rem 1rem',
  marginRight: '1.5rem',
  marginBottom: '1.5rem',
  cursor: 'move',
  float: 'left',
};
const boxSource = {
  beginDrag: props =>{
    console.log(1);
    return {
      name: props.name,
    }
  },

  endDrag: (props, monitor) => {
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();

    if (dropResult) {
      alert(`You dropped ${item.name} into ${dropResult.name}!`) // eslint-disable-line no-alert
    }
  },
};

class DragSourceNode extends PureComponent {
  static propTypes = {
    className : PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    connectDragSource: PropTypes.func.isRequired,
    isDragging: PropTypes.bool.isRequired,
    name: PropTypes.string.isRequired,
  };
  static defaultProps = {
    className: '',
  };
  render() {
    const {
      isDragging,
    } = this.props;
    const { name } = this.props;
    const opacity = isDragging ? 0.4 : 1;
    return (
      <div style={{ ...style, opacity }}>{name}</div>
    )
  }
}

export default DragSource('demo', boxSource , (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))(DragSourceNode);
