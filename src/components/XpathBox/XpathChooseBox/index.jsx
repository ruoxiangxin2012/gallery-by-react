import React, {
  PureComponent,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import uuid from 'uuid/v4';
import localStyles from './XpathChooseBox.scss';

class XpathChooseBox extends PureComponent {
  static propTypes = {
    className : PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    xpathUrl: PropTypes.string,
    onAddXpath: PropTypes.func,
  };
  static defaultProps = {
    className: '',
    xpathUrl: '',
    onAddXpath: () => {},
  };
  onIframeLoad = (e) => {
    const iframeNode = e.target || e.srcElement;
    const document = iframeNode.contentWindow.document;
    document.onmouseover = (e) => {
      e.stopPropagation();
      e.preventDefault();
      const targetAttr = this.getNodeAttr(e.target);
      this.setState({
        maskAttr: {...targetAttr},
      });
    };
    document.onclick = (e) => {
      e.stopPropagation();
      e.preventDefault();
      const node = e.target;
      let text = e.target.text || '无';
      if (node.tagName.toLocaleLowerCase() === 'input') {
        text = node.value;
      }
      const xpath = {
        xpath: readXPath(node),
        text: text,
        key: uuid(),
      };
      this.props.onAddXpath(xpath);
    }
  };

  getNodeAttr = (node) => {
    let obj = node;
    let t = node.offsetTop; //获取该元素对应父容器的上边距
    let l = node.offsetLeft; //对应父容器的上边距
    //判断是否有父容器，如果存在则累加其边距
    while (obj = obj.offsetParent) {//等效 obj = obj.offsetParent;while (obj != undefined)
      t += obj.offsetTop; //叠加父容器的上边距
      l += obj.offsetLeft; //叠加父容器的左边距
    }
    return {
      left: l,
      top: t,
      width: node.clientWidth,
      height: node.clientHeight,
    };
  };

  state = {
    maskAttr: {
      width: 0,
      height: 0,
      top: 0,
      left: 0,
    },
  };

  setIframeNode = (node) => {
    this.iframeNode = node;
  };

  render() {
    const {
      className,
      xpathUrl,
    } = this.props;
    const {
      maskAttr,
    } = this.state;
    return (
      <div className={classnames(localStyles.xpathChooseBox, className)}>
        <div className={localStyles.mask} style={{...maskAttr}} />
        <iframe
          ref={this.setIframeNode}
          className={localStyles.iframe}
          srcDoc={xpathUrl}
          frameBorder="0"
          onLoad={this.onIframeLoad}
        />
      </div>
    )
  }
}

//获取xpath
const readXPath = (element) => {
  if (element.id !== "") {//判断id属性，如果这个元素有id，则显 示//*[@id="xPath"]  形式内容
    return '//*[@id=\"' + element.id + '\"]';
  }
  //这里需要需要主要字符串转译问题，可参考js 动态生成html时字符串和变量转译（注意引号的作用）
  if (element === document.body) {//递归到body处，结束递归
    return '/html/' + element.tagName.toLowerCase();
  }
  let ix = 1,//在nodelist中的位置，且每次点击初始化
    siblings = element.parentNode.childNodes;//同级的子元素

  for (let i = 0, l = siblings.length; i < l; i++) {
    let sibling = siblings[i];
    //如果这个元素是siblings数组中的元素，则执行递归操作
    if (sibling === element) {
      let xpathStr = element.tagName.toLowerCase();
      if (element.getAttribute("class")!==null){ //判断class属性，如果这个元素有class，则显 示//*[@class="xPath"]  形式内容
        xpathStr += '[@class=\"'+element.getAttribute("class")+'\"]';
      }
      return readXPath(element.parentNode) + '/' + xpathStr + '[' + (ix) + ']';
      //如果不符合，判断是否是element元素，并且是否是相同元素，如果是相同的就开始累加
    } else if (sibling.nodeType === 1 && sibling.tagName === element.tagName) {
      ix++;
    }
  }
};

export default XpathChooseBox;