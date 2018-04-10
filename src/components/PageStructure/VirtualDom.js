import {
  fromJS,
} from 'immutable';
import Xpath from '../../libs/Xpath';

class VirtualDom {
  constructor(doc) {
    this.document = doc;
    this.xpath = new Xpath(doc);
  }

  getElementType(node) {
    const nodeType = node.nodeType;
    if (nodeType === 1) {
      return 'node';
    } else if (nodeType === 3 || nodeType === 8) {
      return 'text';
    } else if (nodeType === 9) {
      console.log('本方法不支持整个document');
      return 'error';
    }
    console.log('本方法需要传入dom元素');
    return 'error';
  };

  getTitle(node) {
    let title = node.outerHTML;
    if (node.innerHTML) {
      title = node.outerHTML.replace(node.innerHTML, '...');
    }
    const titleArray = title.split('...');
    return {
      title: title,
      titleHeader: titleArray[0],
      titleFooter: titleArray[1] || '',
    }
  };

  getSelfXpath(node, parentNode) {
    const selfXpath = this.xpath.getElementAllXPath(node);
    if (parentNode) {
      const parentXpath = this.xpath.getElementAllXPath(parentNode);
      return selfXpath.replace(parentXpath, '');
    }
    return selfXpath;
  };

  getContent(node) {
    if (node.localName === 'style') {
      return node.innerText;
    }
    return node.text;
  };

  getChilrenNode(node) {
    return node.children;
  };

  getVirtualDomJson(node, parentNode, keyArray = []) {
    const newNode = node || this.document.documentElement;
    const nodeType = this.getElementType(newNode);
    const selfXpath = this.getSelfXpath(newNode, parentNode);
    if (nodeType === 'text') {
      return {
        [selfXpath]: {
          type: nodeType,
          content: node.outerHTML
        }
      };
    } else if (nodeType === 'node') {
      const childrenNode = this.getChilrenNode(newNode);
      let children = {};
      const sortChildren = [];
      const newkeyArray = keyArray.concat(selfXpath);
      for (let i = 0, l = childrenNode.length; i < l; i++) {
        const domJson = this.getVirtualDomJson(childrenNode[i], newNode, [...newkeyArray, 'children']);
        children = {
          ...children,
          ...domJson,
        };
        sortChildren.push(this.getSelfXpath(childrenNode[i], newNode, ));
      }

      return {
        [selfXpath]: {
          title: this.getTitle(newNode).title,
          titleHeader: this.getTitle(newNode).titleHeader,
          titleFooter: this.getTitle(newNode).titleFooter,
          content: this.getContent(newNode),
          isOpen: false,
          keyArray: newkeyArray,
          xpathString: this.getSelfXpath(newNode),
          children,
          sortChildren,
          isActive: false, // 用于判断该元素时候被选中，如果选中会触发相应的样式改变以及元素居中显示
        }
      }
    }
  };

  getVirtualDomFromJS() {
    return fromJS({
      ...this.getVirtualDomJson(),
    })
  }

  getVirtualDomToJS() {
    return this.getVirtualDomFromJS().toJS();
  }
}

export default VirtualDom;