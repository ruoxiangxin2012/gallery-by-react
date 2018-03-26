import React, {
  PureComponent,
} from 'react';
import PropTypes from 'prop-types';
import { findDOMNode } from 'react-dom';
import {
  DropTarget,
  DragSource,
} from 'react-dnd';
import flow from 'lodash/flow';
import localStyle from './card.scss';
import ItemTypes from '../dragType';

const cardSource = {
  beginDrag(props) {
    return {
      index: props.index,
    }
  },
};

const cardTarget = {
  hover(props, monitor, component) {
    const dragIndex = monitor.getItem().index;
    const hoverIndex = props.index;

    // Don't replace items with themselves
    if (dragIndex === hoverIndex) {
      return
    }

    // Determine rectangle on screen
    const hoverBoundingRect = findDOMNode(component).getBoundingClientRect();

    // Get vertical middle
    const hoverMiddleY = (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2;

    // Determine mouse position
    const clientOffset = monitor.getClientOffset();

    // Get pixels to the top
    const hoverClientY = clientOffset.y - hoverBoundingRect.top;

    // Only perform the move when the mouse has crossed half of the items height
    // When dragging downwards, only move when the cursor is below 50%
    // When dragging upwards, only move when the cursor is above 50%

    // Dragging downwards
    if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
      return
    }

    // Dragging upwards
    if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
      return
    }

    // Time to actually perform the action
    props.moveCard(dragIndex, hoverIndex);

    // Note: we're mutating the monitor item here!
    // Generally it's better to avoid mutations,
    // but it's good here for the sake of performance
    // to avoid expensive index searches.
    monitor.getItem().index = hoverIndex
  },
};

class Card extends PureComponent {
  static propTypes = {
    className : PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    title: PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.node,
    ]),
    index: PropTypes.number,
    text: PropTypes.string,
    moveCard: PropTypes.func.isRequired,
    connectDropTarget: PropTypes.func.isRequired,
    connectDragSource: PropTypes.func.isRequired,
    connectDragPreview: PropTypes.func.isRequired,
  };
  static defaultProps = {
    moveCard: () => {},
    connectDropTarget: () => {},
    connectDragSource: () => {},
    connectDragPreview: () => {},
    title: '标题',
    text: '内容',
    index: 1,
  };
  render() {
    const {
      title,
      text,
      isDragging,
      connectDropTarget,
      connectDragSource,
      connectDragPreview,
    } = this.props;
    const opacity = isDragging ? 0 : 1;
    return (
      connectDropTarget(
        connectDragPreview(
          <div style={{opacity}} className={localStyle.card}>{
            connectDragSource(<div className={localStyle.header}>{title}</div>)
          }
            <div className={localStyle.content}>{text}</div>
          </div>
        )
      )
    )
  }
}

export default flow(
  DragSource(ItemTypes.CARD, cardSource, (connect, monitor) => ({
    connectDragPreview: connect.dragPreview(),
    connectDragSource: connect.dragSource(),
    isDragging: monitor.isDragging(),
  })),
  DropTarget(ItemTypes.CARD, cardTarget, connect => ({
    connectDropTarget: connect.dropTarget(),
  }))
)(Card);
