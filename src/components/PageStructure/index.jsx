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
    document : PropTypes.any,
  };
  static defaultProps = {
    className: {},
    document : '',
    changeChooseXpath: () => {},
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
  };

  getVirtualDomJson = () =>
    this.setState({
      virtualDomJson: this.virtualDom.getVirtualDomFromJS(),
    });

  render() {
    const {
      className,
      changeChooseXpath,
    } = this.props;
    const virtualDomJson = this.state.virtualDomJson.toJS();
    return (
      <div className={classnames(localStyles.panel, className)}>
        页面结构
        <button onClick={this.getVirtualDomJson}>测试</button>
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