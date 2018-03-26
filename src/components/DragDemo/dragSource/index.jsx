import React, {
  PureComponent,
} from 'react';
import PropTypes from 'prop-types';
import { DragSource } from 'react-dnd';
import ItemTypes from '../dragType';

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
  beginDrag(props) {
    return {
      name: props.name,
    }
  },

  endDrag(props, monitor) {
    const item = monitor.getItem();
    const dropResult = monitor.getDropResult();
    console.log(dropResult);

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
      connectDragSource,
    } = this.props;
    const { name } = this.props;
    const opacity = isDragging ? 0.4 : 1;
    return (
      connectDragSource(<div style={{ ...style, opacity }}>{name}</div>)
    )
  }
}

export default DragSource(ItemTypes.BOX, boxSource , (connect, monitor) => ({
  connectDragSource: connect.dragSource(),
  isDragging: monitor.isDragging(),
}))(DragSourceNode);
