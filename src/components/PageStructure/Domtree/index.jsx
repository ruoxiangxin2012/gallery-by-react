import React, {
  PureComponent,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import localStyles from '../pageStructure.scss';

class Domtree extends PureComponent {
  static propTypes = {
    className : PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    virtualDomJson: PropTypes.object,
    changeOpenStatus: PropTypes.func,
  };
  static defaultProps = {
    className: {},
    virtualDomJson: {
      sortChildren: [],
    },
    changeOpenStatus: () => {},
  };

  changeOpenStatus = (keyArray, status) => {
    const newKeyArray = keyArray.concat('isOpen');
    console.log(newKeyArray);
    this.props.changeOpenStatus(newKeyArray, status);
  };

  mouseOver = (e) => {
    const node = e.target;
    node.style.backgroundColor = '#CAE1E7';
  };
  mouseleOut = (e) => {
    const node = e.target;
    node.style.backgroundColor = 'transparent';
  };

  renderTreeNode = (Object, key) => (
    <div className={classnames({[localStyles.nodePanel]: true, [localStyles.closePanel]: !Object.isOpen})} key={key}>
      <div className={localStyles.nodePanelHeader}>
        <span
          className={classnames(Object.isOpen ? [localStyles.openIcon] : [localStyles.closeIcon])}
          onClick={() => this.changeOpenStatus(Object.keyArray, !Object.isOpen)}
        />
        {Object.isOpen ? Object.titleHeader : Object.title}
      </div>
      <div className={localStyles.nodePanelcontaner}>
        <div
          className={localStyles.nodePanelContent}
          onMouseOver={this.mouseOver}
          onMouseOut={this.mouseleOut}
        >
          {Object.sortChildren.length > 0 ?
            Object.sortChildren.map(key =>
              this.renderTreeNode(Object.children[key], key)
            ) : ''
          }
          {Object.content}
        </div>
        <div className={localStyles.nodePanelfooter}>
          {Object.titleFooter}
        </div>
      </div>
    </div>
  ) ;


  render() {
    const {
      className,
      virtualDomJson,
    } = this.props;
    const {
      sortChildren,
    } = virtualDomJson;
    return (
      <div className={classnames(localStyles.domTreePanel, className)}>
        {
          sortChildren.length > 0 ?
            sortChildren.map(key => this.renderTreeNode(virtualDomJson[key], key)) :
            ''
        }
      </div>
    );
  }
}

export default Domtree;