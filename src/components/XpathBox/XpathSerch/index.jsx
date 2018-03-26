import React, {
  PureComponent,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import localStyles from './XpathSerch.scss'

class XpathSerch extends PureComponent {
  static propTypes = {
    className : PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    xpathUrl: PropTypes.string,
    changeUrl: PropTypes.func,
  };
  static defaultProps = {
    className: '',
    xpathUrl: '',
    changeUrl: () => {}
  };
  state = {
    newUrl: this.props.xpathUrl,
  };
  onSerch = () =>
    this.props.changeUrl(this.state.newUrl);
  onChangeNewUrl = (e) => {
    this.setState({
      newUrl: e.target.value,
    })
  };
  render() {
    const {
      className,
    } = this.props;
    const {
      newUrl,
    } = this.state;
    return (
      <div className={classnames(localStyles.XpathSerch, className)}>
        <div className={localStyles.tipBtn}>URL</div>
        <div className={localStyles.serchInput} >
          <input
            onChange={this.onChangeNewUrl}
            type="text"
            value={newUrl}
          />
        </div>
        <div
          onClick={() => this.onSerch()}
          className={localStyles.serchBtn}
        >搜索</div>
      </div>
    )
  }
}

export default XpathSerch;