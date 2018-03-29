import React, {
  PureComponent,
} from 'react';
import {
  NODES,
  ACTION,
} from "./DEFINES";
import uuid from 'uuid/v4';
// import myStyle from './flowChart.scss';

const go = window.go;
class FlowChart extends PureComponent {
  $ = go.GraphObject.make;
  state = {
    modeData: {
      nodes: [{
        text: '打开页面',
        type: 'OPENPAGE',
        key: 1,
      },{
        text: '点击',
        type: 'CLICK',
        key: 2,
        group: 4,
      },{
        text: '获取数据',
        type: 'GETDATA',
        key: 3,
      },{
        text: '循环',
        type: 'CYCLE',
        key: 4,
        isGroup: true,
      }],
      links: [{
        to: 1,
        from: 2,
      },{
        to: 2,
        from: 3,
      },],
    },
  };

  formatNode = (node) => ({
    ...node,
    color: NODES[node.type].COLOR,
    shape: NODES[node.type].SHAPE,
  });

  formatDatas = ({nodes, links}) => ({
    links,
    nodes: nodes.map(node => this.formatNode(node)),
  });

  createNode = (e, obj) => {
    const newKey = uuid();
    const contextmenu = obj.part;
    const nodedata = contextmenu.data;
    const buttontext = obj.elt(1).text;
    const chooseActionKey = Object.keys(ACTION)
      .filter(key =>
        ACTION[key].text === buttontext)[0];
    const chooseAction = ACTION[chooseActionKey];
    const newNode = {
      text: chooseAction.text,
      type: chooseAction.type,
      key: newKey,
      group: nodedata.group,
      isGroup: chooseAction.type === ACTION.CYCLE.type,
    };
    const newLink = {
      to: newKey,
      from: nodedata.key,
    };
    this.addNodes([newNode]);
    this.addLinks([newLink]);
  };

  addNodes(nodes) {
    nodes.forEach(node =>
      this.diagram.model.addNodeData(this.formatNode(node)));

    this.diagram.rebuildParts();
  }

  addLinks(links) {
    links.forEach(link =>
      this.diagram.model.addLinkData(link));

    this.diagram.rebuildParts();
  };

  createNodeTemplate = () => {
    this.diagram.nodeTemplate =
      this.$(go.Node, "Auto",
        this.$(go.Shape,
          new go.Binding("figure", "shape").makeTwoWay(),
          new go.Binding("fill", "color").makeTwoWay()),
        this.$(go.TextBlock,
          {
            margin: 5,
            editable: true,
          },
          new go.Binding("text", "text").makeTwoWay()),
        {
          contextMenu:     // define a context menu for each node
            this.$(go.Adornment, "Vertical", // that has one button
              this.$("ContextMenuButton",
                this.$(go.TextBlock, ACTION.OPENPAGE.text),
                { click: this.createNode }),
            this.$("ContextMenuButton",
              this.$(go.TextBlock, ACTION.CLICK.text),
                { click: this.createNode }),
            this.$("ContextMenuButton",
              this.$(go.TextBlock, ACTION.CYCLE.text),
                { click: this.createNode }),
              this.$("ContextMenuButton",
              this.$(go.TextBlock, ACTION.GETDATA.text),
                { click: this.createNode })
              // more ContextMenuButtons would go here
            ) // end Adornment
        }
      );
  };

  createLinkTemplate = () => {
    this.diagram.linkTemplate =
      this.$(go.Link,
        this.$(go.Shape), // the link shape
        this.$(go.Shape, // the arrowhead
          { toArrow: "OpenTriangle", fill: null }),
      )
  };

  createGroupTemplate = () => {
    this.diagram.groupTemplate =
      this.$(go.Group,
        "Vertical",
        {
          selectionObjectName: "PANEL",
          locationObjectName: "PANEL",
        },
        this.$(go.TextBlock,
          {
            font: "bold 14px sans-serif",
            isMultiline: false, // don't allow newlines in text
            editable: true // allow in-place editing by user
          },
          new go.Binding("text", "text").makeTwoWay(),
          new go.Binding("stroke", "color")),
        this.$(go.Panel, "Auto",
          { name: "PANEL" },
          this.$(go.Shape,
            new go.Binding("figure", "shape").makeTwoWay(),
            new go.Binding("fill", "color").makeTwoWay()),
          this.$(go.Placeholder, { margin: 10, background: "transparent" })
        ),
        )};

  setModal = (data = {}) => {
    const formatData = this.formatDatas(data);

    this.diagram.model = new go.GraphLinksModel(
      formatData.nodes,
      formatData.links,
    );
  };

  createDiagram = () => {
    this.diagram = this.$(go.Diagram, this.myDiagramNode,
      {
        initialContentAlignment: go.Spot.Center, // center Diagram contents
        "undoManager.isEnabled": true, // enable Ctrl-Z to undo and Ctrl-Y to redo
        "commandHandler.archetypeGroupData": { text: "Group", isGroup: true, color: "blue" },
      });
  };
  createLayout = () => {
    this.diagram.layout = this.$(
      go.LayeredDigraphLayout, {
        direction: 90,
        layerSpacing: 25,
        columnSpacing: 25,
      },
    );
  };

  componentDidMount() {
    this.createDiagram();
    this.createLayout();
    this.createNodeTemplate();
    this.createLinkTemplate();
    this.createGroupTemplate();
    this.setModal(this.state.modeData);
  }

  render() {
    return (
      <div>
        <div
          ref={(node) => { this.myDiagramNode = node; }}
          style={{width:'100%', height:400, backgroundColor: '#DAE4E4'}}
        />

        {/*<div*/}
          {/*className={myStyle.menuPanel}*/}
          {/*ref={(node) => { this.menuNode = node }}*/}
        {/*>*/}
          {/*<ul className={myStyle.menu}>*/}
            {/*<li className={myStyle.menuItem}>打开网页</li>*/}
            {/*<li className={myStyle.menuItem}>点击</li>*/}
            {/*<li className={myStyle.menuItem}>获取数据</li>*/}
          {/*</ul>*/}
        {/*</div>*/}
      </div>
    );
  }
}

export default FlowChart;
