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
    const childrenNode = this.getChilrenNode(node);
    let children = {};
    const sortChildren = [];
    const selfXpath = this.getSelfXpath(node, parentNode);
    const newkeyArray = keyArray.concat(selfXpath);
    for (let i = 0, l = childrenNode.length; i < l; i++) {
      const domJson = this.getVirtualDomJson(childrenNode[i], node, [...newkeyArray, 'children']);
        children = {
        ...children,
        ...domJson,
      };
      sortChildren.push(this.getSelfXpath(childrenNode[i], node, ));
    }

    return {
      [selfXpath]: {
        title: this.getTitle(node).title,
        titleHeader: this.getTitle(node).titleHeader,
        titleFooter: this.getTitle(node).titleFooter,
        content: this.getContent(node),
        isOpen: false,
        keyArray: newkeyArray,
        children,
        sortChildren,
      }
    }
  };

  getVirtualDomFromJS() {
    return fromJS({
      ...this.getVirtualDomJson(this.document.head),
      ...this.getVirtualDomJson(this.document.body),
      sortChildren: [this.getSelfXpath(this.document.head),this.getSelfXpath(this.document.body)]
    })
  }

  getVirtualDomToJS() {
    return this.getVirtualDomFromJS().toJS();
  }
}

export default VirtualDom;