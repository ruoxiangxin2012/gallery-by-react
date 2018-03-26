import React, {
  PureComponent,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import update from 'immutability-helper';
import localStyles from './dragDnd.scss';
import Card from './Card';

class DragBox extends PureComponent {
  static propTypes = {
    className : PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
  };
  static defaultProps = {
    className: '',
  };

  state = {
    list: [
      {
        title: 'box1',
        text: '我是一颗什么是石头',
        key: 1,
      },
      {
        title: 'box2',
        text: '我要飞得更高',
        key: 2,
      },
    ]
  };

  moveCard = (dragIndex, hoverIndex) => {
    const {
      list,
    } = this.state;
    const dragCard = list[dragIndex];
    this.setState(
      update(this.state, {
        list: {
          $splice: [[dragIndex, 1], [hoverIndex, 0, dragCard]],
        },
      }),
    )
  };

  render(){
    const {
      className,
    } = this.props;
    const {
      list,
    } = this.state;
    return (
      <div className={classnames(localStyles.panel, className)}>
        {
          list.map((val, i) => (
            <Card
              {...val}
              index={i}
              moveCard={this.moveCard}
            />
          ))
        }
      </div>
    )
  }
}

export default DragDropContext(HTML5Backend)(DragBox);
