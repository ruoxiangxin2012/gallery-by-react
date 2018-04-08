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
    changeChooseXpath: PropTypes.func,
  };
  static defaultProps = {
    className: {},
    virtualDomJson: {
      sortChildren: [],
      children: {},
    },
    changeOpenStatus: () => {},
    changeChooseXpath: () => {},
  };

  changeOpenStatus = (keyArray, status) => {
    const newKeyArray = keyArray.concat('isOpen');
    this.props.changeOpenStatus(newKeyArray, status);
  };

  mouseOver = (e, xpaths) => {
    e.stopPropagation();
    const node = e.target;
    node.style.backgroundColor = '#CAE1E7';
    this.props.changeChooseXpath(xpaths);
    console.log(xpaths, 111);
  };
  mouseleOut = (e) => {
    const node = e.target;
    node.style.backgroundColor = 'transparent';
  };

  renderTextElement = (obj, key) => (
    <div key={key} className={classnames(localStyles.nodePanel, localStyles.textNodePanel)}>
      {obj.titleHeader}{obj.content}{obj.titleFooter}
    </div>
  );

  renderTreeNode = (obj, key) => (
    <div
      className={classnames({[localStyles.nodePanel]: true, [localStyles.closePanel]: !obj.isOpen})}
      onMouseOver={(e) => this.mouseOver(e, obj.xpathString)}
      onMouseOut={this.mouseleOut}
      key={key}
    >
      <div className={localStyles.nodePanelHeader}>
        <span
          className={classnames(obj.isOpen ? [localStyles.openIcon] : [localStyles.closeIcon])}
          onClick={() => this.changeOpenStatus(obj.keyArray, !obj.isOpen)}
        />
        {obj.isOpen ? obj.titleHeader : obj.title}
      </div>
      <div className={localStyles.nodePanelcontaner}>
        <div
          className={localStyles.nodePanelContent}
        >
          {obj.sortChildren.length > 0 ?
            obj.sortChildren.map(key =>
              this.renderMoment(obj.children[key], key)
            ) : ''
          }
          {obj.content}
        </div>
        <div className={localStyles.nodePanelfooter}>
          {obj.titleFooter}
        </div>
      </div>
    </div>
  ) ;

  renderMoment = (node, key) => {
    if (!node.content && node.sortChildren.length === 0) {
      return this.renderTextElement(node, key);
    }
    return this.renderTreeNode(node, key);
  };


  render() {
    const {
      className,
      virtualDomJson,
    } = this.props;
    const {
      sortChildren,
      children,
    } = virtualDomJson;
    console.log(children);
    return (
      <div className={classnames(localStyles.domTreePanel, className)}>
        {
          sortChildren.length > 0 ?
            sortChildren.map(key => this.renderMoment(children[key], key)) :
            ''
        }
      </div>
    );
  }
}

export default Domtree;