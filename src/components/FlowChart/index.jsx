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
        from: 4,
      },{
        to: 4,
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
  createGroupNode = (e, obj) => {
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
      group: nodedata.key,
      isGroup: chooseAction.type === ACTION.CYCLE.type,
    };
    this.addNodes([newNode]);
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
          contextMenu: this.$(go.Adornment, "Vertical", // that has one button
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
        { routing: go.Link.Orthogonal, corner: 10 },
        this.$(go.Shape), // the link shape
        this.$(go.Shape, // the arrowhead
          { toArrow: "OpenTriangle"}),
      )
  };
  
  randomGroup = () => {};

  createGroupTemplate = () => {
    this.diagram.groupTemplate =
      this.$(go.Group, "Auto",
        { // define the group's internal layout
          layout: this.$( go.LayeredDigraphLayout, {
            direction: 90,
            layerSpacing: 25,
            columnSpacing: 25,
          }),
          // the group begins unexpanded;
          // upon expansion, a Diagram Listener will generate contents for the group
          isSubGraphExpanded: true,
          // when a group is expanded, if it contains no parts, generate a subGraph inside of it
          // subGraphExpandedChanged: function(group) {
          //   if (group.memberParts.count === 0) {
          //     this.randomGroup(group.data.key);
          //   }
          // }
        },
        this.$(go.Shape, "Rectangle",
          { fill: null, stroke: "gray", strokeWidth: 2 }),
        this.$(go.Panel, "Vertical",
          { defaultAlignment: go.Spot.Left, margin: 4 },
          this.$(go.Panel, "Horizontal",
            { defaultAlignment: go.Spot.Top },
            // the SubGraphExpanderButton is a panel that functions as a button to expand or collapse the subGraph
            this.$("SubGraphExpanderButton"),
            this.$(go.TextBlock,
              {
                font: "Bold 14px Sans-Serif",
                margin: 5,
                editable: true,
              },
              new go.Binding("text", "text").makeTwoWay())
          ),
          // create a placeholder to represent the area where the contents of the group are
          this.$(go.Placeholder,
            { padding: new go.Margin(0, 10) }),
          ),
        {
          contextMenu:     // define a context menu for each node
            this.$(go.Adornment, "Vertical", // that has one button
              this.$("ContextMenuButton",
                this.$(go.TextBlock, ACTION.OPENPAGE.text),
                { click: this.createGroupNode }),
              this.$("ContextMenuButton",
                this.$(go.TextBlock, ACTION.CLICK.text),
                { click: this.createGroupNode }),
              this.$("ContextMenuButton",
                this.$(go.TextBlock, ACTION.CYCLE.text),
                { click: this.createGroupNode }),
              this.$("ContextMenuButton",
                this.$(go.TextBlock, ACTION.GETDATA.text),
                { click: this.createGroupNode })
              // more ContextMenuButtons would go here
            ) // end Adornment
        }
        );
  };

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
        initialContentAlignment: go.Spot.TopCenter, // center Diagram contents
        initialAutoScale: go.Diagram.UniformToFill,
      },
      );
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

  save = () => {
    console.log(this.diagram.model.toJson())
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
          style={{width:'100%', height: 800 , backgroundColor: '#DAE4E4'}}
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
        <div onClick={this.save}> 保存</div>
      </div>
    );
  }
}

export default FlowChart;
