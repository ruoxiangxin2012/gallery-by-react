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
    document : PropTypes.any,
  };
  static defaultProps = {
    className: {},
    document : '',
  };

  state = {
    virtualDomJson: fromJS({
      sortChildren: [],
    }),
  };

  changeOpenStatus = (keyArray, status) => {
    const oldVirtualDom = this.state.virtualDomJson;
    console.log(oldVirtualDom.getIn(keyArray));
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
    } = this.props;
    const virtualDomJson = this.state.virtualDomJson.toJS();
    console.log(virtualDomJson);
    return (
      <div className={classnames(localStyles.panel, className)}>
        页面结构
        <button onClick={this.getVirtualDomJson}>测试</button>
        <Domtree
          virtualDomJson={virtualDomJson}
          changeOpenStatus={this.changeOpenStatus}
        />
      </div>
    );
  }
}

export default PageStructure;