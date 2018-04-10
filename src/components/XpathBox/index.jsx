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
   chooseXpathPageStructure: '', // 用于跟pageStructure联系达到相互选择功能
   openStruXpath: '', //用于控制页面节点展开的xpath
   isSuperClick: false, // 用于判断点击选中节点时触发页面节点展开还是修改xpath
 };

 changeUrl= newUrl =>
   this.setState({
     xpathUrl: newUrl,
   });
  changeChooseXpath = newChooseXpath =>
    this.setState({
      chooseXpath: newChooseXpath,
    });
  changeChooseXpathPageStructure = newChooseXpath =>
    this.setState({
      chooseXpathPageStructure: newChooseXpath,
    });
  changeOpenStruXpath = newOpenStruXpath =>
    this.setState({
      openStruXpath: newOpenStruXpath,
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

  changeSuperClick = newSuperClick =>
    this.setState({
      isSuperClick: newSuperClick,
    });

  render() {
    const {
      className,
    } = this.props;
    const {
      xpathUrl,
      chooseXpath,
      document,
      chooseXpathPageStructure,
      openStruXpath,
      isSuperClick,
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
            chooseXpathPageStructure={chooseXpathPageStructure}
            className={localStyles.leftSilder}
            isSuperClick={isSuperClick}
            changeSuperClick={this.changeSuperClick}
            changeOpenStruXpath={this.changeOpenStruXpath}
          />
          <XpathList
            chooseXpath={chooseXpath}
            changeChooseXpath={this.changeXpath}
            className={localStyles.rightSilder}
          />
        </div>
        <div className={localStyles.footer}>
          <PageStructure
            openStruXpath={openStruXpath}
            changeChooseXpath={this.changeChooseXpathPageStructure}
            document={document}
            isSuperClick={isSuperClick}
            changeSuperClick={this.changeSuperClick}
          />
        </div>
      </div>
    )
  }
}

export default XpathBox;
