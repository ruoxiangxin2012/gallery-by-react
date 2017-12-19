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
    xpathList: PropTypes.array,
    onDelXpathList: PropTypes.func,
  };
  static defaultProps = {
    className: '',
    xpathList: [],
    onDelXpathList: () => {},
  };

  render() {
    const {
      className,
      xpathList,
      onDelXpathList,
    } = this.props;
    return (
      <ul className={classnames(localStyles.XpathList, className)}>
        <li className={localStyles.xpathTitle}>xpath路径</li>
        {
          xpathList.map((val, index) => (
            <li className={localStyles.xpathListItem} key={val.key}>
              <div className={localStyles.itemTitle}>
                {val.text}
                <span
                  onClick={() => onDelXpathList(index)}
                  className={localStyles.delBtn}
                >X</span>
              </div>
              <div className={localStyles.itemContent}>
                {val.xpath}
              </div>
              </li>
          ))
        }
      </ul>
    )
  }
}

export default XpathList;