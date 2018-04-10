import React, {
  PureComponent,
} from 'react';
import {
  fromJS,
} from 'immutable';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import VirtualDom from './VirtualDom';
import Domtree from './Domtree';
import localStyles from './pageStructure.scss';


class PageStructure extends PureComponent {
  static propTypes = {
    className : PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    changeChooseXpath: PropTypes.func,
    changeSuperClick: PropTypes.func,
    document : PropTypes.any,
    isSuperClick: PropTypes.bool,
    openStruXpath: PropTypes.string,
  };
  static defaultProps = {
    className: {},
    document : '',
    changeChooseXpath: () => {},
    changeSuperClick: () => {},
    isSuperClick: false,
    openStruXpath: '',
  };

  state = {
    virtualDomJson: fromJS({
      sortChildren: [],
    }),
  };

  changeOpenStatus = (keyArray, status) => {
    const oldVirtualDom = this.state.virtualDomJson;
    const newVirtualDom = oldVirtualDom.setIn(keyArray, status);
    this.setState({
      virtualDomJson: newVirtualDom,
    })
  };

  componentDidMount() {
    this.virtualDom = new VirtualDom(this.props.document);
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.document !== this.props.document) {
      this.virtualDom = new VirtualDom(nextProps.document);
    }
    if (nextProps.openStruXpath !== this.props.openStruXpath) {
      this.changeDomTreeOpenStatus(nextProps.openStruXpath);
    }
  };

  getVirtualDomJson = () =>
    this.setState({
      virtualDomJson: this.virtualDom.getVirtualDomFromJS(),
    });

  getAllNeedOpenPath = (xpathArray) => {
    const needOpenPath = [];
    let newPath = ['/html'];
    xpathArray.map(xpath => {
      newPath = newPath.concat(['children', xpath]);
      needOpenPath.push([...newPath, 'isOpen']);
    });
    return needOpenPath;
  };

  changeDomTreeActiveStatus = (virtualDomJson, newActivePath) => {
    let newVirtualDomJson = virtualDomJson;
    if (this.lastActivePath && this.lastActivePath !== '') {
      newVirtualDomJson = virtualDomJson.setIn(this.lastActivePath, false);
    }
    newVirtualDomJson = newVirtualDomJson.setIn(newActivePath, true);
    this.lastActivePath = newActivePath;
    return newVirtualDomJson;
  };

  changeDomTreeOpenStatus = newXpath => {
    const XpathArray = newXpath.split('/').splice(2).map(xpath => `/${xpath}`); //去掉前面的‘’
    let newVirtualDomJson = this.state.virtualDomJson;
    const needOpenPath = this.getAllNeedOpenPath(XpathArray);
    needOpenPath.forEach(path => {
      newVirtualDomJson = newVirtualDomJson.setIn(path, true);
    });
    const needActiveDomPath = needOpenPath.pop();
    needActiveDomPath.splice(-1, 1, 'isActive');
    newVirtualDomJson = this.changeDomTreeActiveStatus(newVirtualDomJson, needActiveDomPath);
    this.setState({
      virtualDomJson: newVirtualDomJson,
    });
  };

  render() {
    const {
      className,
      changeChooseXpath,
      isSuperClick,
      changeSuperClick,
    } = this.props;
    const virtualDomJson = this.state.virtualDomJson.toJS();
    return (
      <div className={classnames(localStyles.panel, className)}>
        <div className={localStyles.panelHeader}>
          <button onClick={this.getVirtualDomJson}>测试</button>
          <button onClick={() => changeSuperClick(!isSuperClick)}>选取节点</button>
        </div>
        <Domtree
          changeChooseXpath={changeChooseXpath}
          virtualDomJson={virtualDomJson['/html']}
          changeOpenStatus={this.changeOpenStatus}
        />
      </div>
    );
  }
}

export default PageStructure;