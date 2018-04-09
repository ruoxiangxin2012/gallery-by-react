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
    chooseXpathPageStructure: PropTypes.string,
  };
  static defaultProps = {
    className: {},
    document : '',
    changeChooseXpath: () => {},
    changeSuperClick: () => {},
    isSuperClick: false,
    chooseXpathPageStructure: '',
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
    if (nextProps.chooseXpathPageStructure !== this.props.chooseXpathPageStructure) {
      this.changeDomTreeOpenStatus(nextProps.chooseXpathPageStructure);
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

  changeDomTreeOpenStatus = newXpath => {
    const XpathArray = newXpath.split('/').splice(2).map(xpath => `/${xpath}`); //去掉前面的‘’
    let newVirtualDomJson = this.state.virtualDomJson;
    const needOpenPath = this.getAllNeedOpenPath(XpathArray);
    needOpenPath.forEach(path => {
      newVirtualDomJson = newVirtualDomJson.setIn(path, true);
    });
    console.log(newVirtualDomJson.toJS());
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
        <button onClick={this.getVirtualDomJson}>测试</button>
        <button onClick={() => changeSuperClick(!isSuperClick)}>选取节点</button>
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