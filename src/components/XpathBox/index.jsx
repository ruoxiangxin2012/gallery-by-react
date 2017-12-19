import React, {
  PureComponent,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import localStyles from './XpathBox.scss'
import XpathSerch from './XpathSerch';
import XpathList from './XpathList';
import XpathChooseBox from './XpathChooseBox';
import urlSource from 'mock/pageSource.json';

class XpathBox extends PureComponent {
  static propTypes = {
    className : PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
  };
  static defaultProps = {
    className: {}
  };
 state = {
   xpathList: [],
   xpathUrl: 'http://baidu.com',
 };

 changeUrl= newUrl =>
   this.setState({
     xpathUrl: newUrl,
   });
  onAddXpath = newXpath => {
    this.setState({
      xpathList: [...this.state.xpathList, newXpath]
    })
  };
  onDelXpathList = index => {
    let newXpathList = this.state.xpathList;
    newXpathList.splice(index, 1);
    console.log(newXpathList);
    this.setState({
      xpathList: [...newXpathList],
    })
  };

  render() {
    const {
      className,
    } = this.props;
    const {
      xpathUrl,
      xpathList,
    } = this.state;
    return (
      <div className={classnames(localStyles.XpathBox, className)}>
        <div className={localStyles.header}>
          <XpathSerch
            xpathUrl={xpathUrl}
            changeUrl={this.changeUrl}
          />
        </div>
        <div className={localStyles.content}>
          <XpathChooseBox
            onAddXpath={this.onAddXpath}
            xpathUrl={urlSource.html}
            className={localStyles.leftSilder}
          />
          <XpathList
            xpathList={xpathList}
            onDelXpathList={this.onDelXpathList}
            className={localStyles.rightSilder}
          />
        </div>
      </div>
    )
  }
}

export default XpathBox;
