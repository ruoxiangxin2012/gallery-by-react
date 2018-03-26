import React, {
  PureComponent,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import localStyles from './XpathList.scss'

class XpathList extends PureComponent {
  static propTypes = {
    className : PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    chooseXpath: PropTypes.object,
    onDelXpathList: PropTypes.func,
    changeChooseXpath: PropTypes.func,
  };
  static defaultProps = {
    className: '',
    chooseXpath: {
      xpath: '',
      nodeValues: [],
    },
    changeChooseXpath: () => {},
  };
  changeChooseXpath = e =>
    this.props.changeChooseXpath(e.target.value);

  render() {
    const {
      className,
      chooseXpath,
    } = this.props;
    return (
      <ul className={classnames(localStyles.XpathList, className)}>
        <li className={localStyles.xpathTitle}>xpath路径</li>
        <li className={localStyles.xpathListItem}>
          <span className={localStyles.label}>xpath:</span>
          <input
            className={localStyles.input}
            value={chooseXpath.xpath}
            onChange={this.changeChooseXpath}
            type="text"
          />
        </li>
        <li className={localStyles.xpathListItem}>
          <span className={localStyles.label}>采集:</span>
          <ul className={localStyles.detail}>
            {
              chooseXpath.nodeValues.map(val => (
                <li className={localStyles.detailItem} key={val.key}>{val.value}</li>
              ))
            }
          </ul>
        </li>
      </ul>
    )
  }
}

export default XpathList;