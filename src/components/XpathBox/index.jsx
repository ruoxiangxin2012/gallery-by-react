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
import PageStructure from '../PageStructure';

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
   chooseXpath: {
     xpath: '',
     nodeValues: [],
   },
   document: '', // 用于传递给页面结构组件
 };

 changeUrl= newUrl =>
   this.setState({
     xpathUrl: newUrl,
   });
  changeChooseXpath = newChooseXpath =>
    this.setState({
      chooseXpath: newChooseXpath,
    });
  changeXpath = xpath =>
    this.setState({
      chooseXpath: {
        ...this.state.chooseXpath,
        xpath: xpath,
      },
    });

  changeDocument = newDocument =>
    this.setState({
      document: newDocument,
    });

  render() {
    const {
      className,
    } = this.props;
    const {
      xpathUrl,
      chooseXpath,
      document,
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
            changeChooseXpath={this.changeChooseXpath}
            changeDocument={this.changeDocument}
            xpathUrl={urlSource.html}
            chooseXpath={chooseXpath.xpath}
            className={localStyles.leftSilder}
          />
          <XpathList
            chooseXpath={chooseXpath}
            changeChooseXpath={this.changeXpath}
            className={localStyles.rightSilder}
          />
        </div>
        <div className={localStyles.footer}>
          <PageStructure document={document} />
        </div>
      </div>
    )
  }
}

export default XpathBox;
