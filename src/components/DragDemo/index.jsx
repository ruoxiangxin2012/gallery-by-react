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
  render(){
    const {
      className,
    } = this.props;
    return (
      <div className={classnames(localStyles.panel, className)}>
        <div style={{ overflow: 'hidden', clear: 'both' }}>
          <DragTargetNode />
        </div>
        <div style={{ overflow: 'hidden', clear: 'both' }}>
          <DragSourceNode name="Glass" />
          <DragSourceNode name="Banana" />
          <DragSourceNode name="Paper" />
        </div>
      </div>
    )
  }
}

export default DragDropContext(HTML5Backend)(DragBox);
