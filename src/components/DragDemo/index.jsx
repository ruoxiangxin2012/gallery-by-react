import React, {
  PureComponent,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import HTML5Backend from 'react-dnd-html5-backend';
import { DragDropContext } from 'react-dnd';
import localStyles from './DragDemo.scss'
import DragSourceNode from './dragSource';
import DragTargetNode from './dragTarget';

class XpathBox extends PureComponent {
  static propTypes = {
    className : PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
  };
  static defaultProps = {
    className: '',
  };
  render(){
    const {
      className,
    } = this.props;
    return (
      <div className={classnames(localStyles.panel, className)}>
        <DragTargetNode />
        <DragSourceNode name="1" />
        <DragSourceNode name="3" />
        <DragSourceNode name="fas" />
        <DragSourceNode name="fa" />
        <DragSourceNode name="Glass" />
      </div>
    )
  }
}

export default DragDropContext(HTML5Backend)(XpathBox);
