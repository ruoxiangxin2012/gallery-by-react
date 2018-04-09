import React, {
  PureComponent,
} from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import uuid from 'uuid/v4';
import XPath from '../../../libs/Xpath';
import localStyles from './XpathChooseBox.scss';

class XpathChooseBox extends PureComponent {
  static propTypes = {
    className : PropTypes.oneOfType([
      PropTypes.string,
      PropTypes.object,
    ]),
    xpathUrl: PropTypes.string,
    chooseXpathPageStructure: PropTypes.string,
    chooseXpath: PropTypes.string, //根据传入的xpath渲染相关元素
    isSuperClick: PropTypes.bool,
    changeChooseXpath: PropTypes.func,
    changeChooseXpathPageStructure: PropTypes.func,
    changeDocument: PropTypes.func,
    changeSuperClick: PropTypes.func,
  };
  static defaultProps = {
    className: '',
    xpathUrl: '',
    chooseXpathPageStructure: '',
    chooseXpath: '',
    isSuperClick: false,
    changeChooseXpath: () => {},
    changeChooseXpathPageStructure: () => {},
    changeDocument: () => {},
    changeSuperClick: () => {},
  };
  state = {
    maskAttr: {
      hoverRect: {
        width: 0,
        height: 0,
        top: 0,
        left: 0,
      },
      activeRects: [],
    },
    menu: {
      visible: false,
      position: {
        top: 0,
        left: 0,
      }
    },
    currentNode: '',
  };


  onIframeLoad = (e) => {
    const iframeNode = e.target || e.srcElement;
    const document = iframeNode.contentWindow.document;
    const documentHeight = document.documentElement.offsetHeight;
    iframeNode.style.height = documentHeight + 'px';
    this.props.changeDocument(document);
    document.oncontextmenu = e => {
      e.preventDefault();
      this.setState({
        menu: {
          visible: true,
          position: {
            top: e.clientY,
            left: e.clientX,
          }
        },
      })
    };
    this.xpath = new XPath(document);
    document.onmouseover = (e) => {
      e.stopPropagation();
      e.preventDefault();
      const targetAttr = this.getNodeRect(e.target);
      this.getCurrentNode(e.target);
      this.setState({
        maskAttr: {
          ...this.state.maskAttr,
          hoverRect: targetAttr,
        },
        menu: {
          visible: false,
        },
      });
    };
    document.onclick = (e) => {
      e.stopPropagation();
      e.preventDefault();
      const node = e.target;
      if (this.props.isSuperClick) {
        this.props.changeChooseXpathPageStructure(this.getElementAllXPath(node));
        this.props.changeSuperClick(false);
      } else {
        const newChooseXpath = this.getChooseXpathByXpath(this.getElementXPath(node));
        this.props.changeChooseXpath(newChooseXpath);
      }
    };
  };
  getXPather = () => this.xpath;

  getCurrentNode = node => this.setState({
    currentNode: node,
  });

  getElementXPath = element =>
    this.xpath.getElementXPath(element);
  getElementAllXPath = element =>
    this.xpath.getElementAllXPath(element);
  getElementByXPath = xpath =>
    this.xpath.getElementByXPath(xpath);

  renderElementByXpath = (xpath) => {
    let elments = this.getElementByXPath(xpath);
    const chooseMask = [];
    elments.forEach((elment, index) => {
      if (elment.nodeType !== 1) {
        let newXpath = xpath;
        newXpath = newXpath.split('/').slice(0, -1).join('/');
        elment = this.getElementByXPath(newXpath)[0];
      }
      chooseMask.push({
        key: index,
        style: this.getNodeRect(elment),
        isChoosed: true,
      });
    });
    this.setState({
      maskAttr: {
        ...this.state.maskAttr,
        activeRects: chooseMask,
      },
    })
  };

  renderElementByXpathPageStruture = (xpath) => {
    console.log(xpath);
    const elments = this.getElementByXPath(xpath)[0];
    console.log(elments);
    this.setState({
      maskAttr: {
        ...this.state.maskAttr,
        hoverRect: this.getNodeRect(elments),
      },
    })
  };

  getChooseXpathByXpath = (xpath) => {
    let elments = this.getElementByXPath(xpath);
    return {
      xpath: xpath,
      nodeValues: this.getNodeValues(elments),
    }
  };

  getNodeValues = nodes =>
    nodes.map(val => ({value: val.value || val.nodeValue || '无', key: uuid()}));

  getNodeRect = (node) => {
    const size = node.getBoundingClientRect();
    return {
      left: size.x,
      top: size.y,
      width: size.width,
      height: size.height,
    };
  };

  getText = () => {
    const currentXpath = this.getElementXPath(this.state.currentNode) + '/text()';
    const newChooseXpath = this.getChooseXpathByXpath(currentXpath);
    this.props.changeChooseXpath(newChooseXpath);
  };

  getUrl = () => {
    const currentXpath = this.getElementXPath(this.state.currentNode) + '/@href';
    const newChooseXpath = this.getChooseXpathByXpath(currentXpath);
    this.props.changeChooseXpath(newChooseXpath);
  };

  setIframeNode = (node) => {
    this.iframeNode = node;
  };

  componentWillReceiveProps(nextProps) {
    if (nextProps.chooseXpath !== this.props.chooseXpath) {
      this.renderElementByXpath(nextProps.chooseXpath);
      const newChooseXpath = this.getChooseXpathByXpath(nextProps.chooseXpath);
      this.props.changeChooseXpath(newChooseXpath);
    }
    if (nextProps.chooseXpathPageStructure !== this.props.chooseXpathPageStructure) {
      this.renderElementByXpathPageStruture(nextProps.chooseXpathPageStructure);
    }
  }

  render() {
    const {
      className,
      xpathUrl,
    } = this.props;
    const {
      maskAttr,
      menu,
    } = this.state;
    return (
      <div className={classnames(localStyles.xpathChooseBox, className)}>
        <div className={localStyles.mask} style={maskAttr.hoverRect} />
        {
          maskAttr.activeRects.map(rect => (
            <div
              className={classnames([localStyles.mask], [localStyles.choosed])}
              key={rect.key}
              style={rect.style}
            />
          ))
        }
        <iframe
          ref={this.setIframeNode}
          className={localStyles.iframe}
          src="about:blank"
          srcDoc={xpathUrl}
          frameBorder="0"
          scrolling="no"
          onLoad={this.onIframeLoad}
        />

        <div
          className={classnames(localStyles.menu, {[localStyles.hide]: !menu.visible})}
          style={menu.position}
        >
          <ul>
            <li onClick={this.getText}>提取文本</li>
            <li onClick={this.getUrl}>提取url</li>
          </ul>
        </div>
      </div>
    )
  }
}

export default XpathChooseBox;