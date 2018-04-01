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
      }],
      links: [],
    },
  };
  // 手动连线功能 begin========================================
  nodeSelectionAdornmentTemplate =
    this.$(go.Adornment, "Auto",
      this.$(go.Shape, { fill: null, stroke: "deepskyblue", strokeWidth: 1.5, strokeDashArray: [4, 2] }),
      this.$(go.Placeholder)
    );
  
  makePort = (name, spot, output, input) => {
    // the port is basically just a small transparent square
    return this.$(go.Shape, "Circle",
      {
        fill: null, // not seen, by default; set to a translucent gray by showSmallPorts, defined below
        stroke: null,
        desiredSize: new go.Size(7, 7),
        alignment: spot, // align the port on the main Shape
        alignmentFocus: spot, // just inside the Shape
        portId: name, // declare this object to be a "port"
        fromSpot: spot, toSpot: spot, // declare where links may connect at this port
        fromLinkable: output, toLinkable: input, // declare whether the user may draw links to/from here
        cursor: "pointer" // show a different cursor to indicate potential link point
      });
  };
  
  showSmallPorts = (node, show) => {
    node.ports.each(function(port) {
      if (port.portId !== "") { // don't change the default port, which is the big shape
        port.fill = show ? "rgba(0,0,0,.3)" : null;
      }
    });
  };
  // 手动连线功能 end========================================

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
      this.$(go.Node, "Spot",
        { locationSpot: go.Spot.Center },
        { selectable: true, selectionAdornmentTemplate: this.nodeSelectionAdornmentTemplate },
        this.$(go.Panel, "Auto",
          { name: "PANEL" },
          this.$(go.Shape,
            {
              portId: "", // the default port: if no spot on link data, use closest side
              fromLinkable: true, toLinkable: true, cursor: "pointer",
              fill: "white", // default color
              strokeWidth: 2
            },
            new go.Binding("figure", "shape").makeTwoWay(),
            new go.Binding("fill", "color").makeTwoWay()),
          this.$(go.TextBlock,
            {
              margin: 5,
              editable: true,
            },
            new go.Binding("text", "text").makeTwoWay()),
        ),
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
          ), // end Adornment
        },
        this.makePort("T", go.Spot.Top, false, true),
        this.makePort("L", go.Spot.Left, true, true),
        this.makePort("R", go.Spot.Right, true, true),
        this.makePort("B", go.Spot.Bottom, true, false),
        { // handle mouse enter/leave events to show/hide the ports
          mouseEnter: (e, node) => { this.showSmallPorts(node, true); },
          mouseLeave: (e, node) => { this.showSmallPorts(node, false); }
        }
      );
  };
  
  linkSelectionAdornmentTemplate =
    this.$(go.Adornment, "Link",
      this.$(go.Shape,
        // isPanelMain declares that this Shape shares the Link.geometry
        { isPanelMain: true, fill: null, stroke: "deepskyblue", strokeWidth: 0 }) // use selection object's strokeWidth
    );
  createLinkTemplate = () => {
    this.diagram.linkTemplate =
      this.$(go.Link,
        { selectable: true, selectionAdornmentTemplate: this.linkSelectionAdornmentTemplate,
          fromPortChanged: (a, b) => {
            console.log(a, b);
          },
          toPortChanged: (link, oldGraph, newGraph) => {}
        },
        { relinkableFrom: true, relinkableTo: true, reshapable: true },
        {
          routing: go.Link.AvoidsNodes,
          curve: go.Link.JumpOver,
          corner: 5,
          toShortLength: 4
        },
        this.$(go.Shape, // the link path shape
          { isPanelMain: true, strokeWidth: 2 }),
        this.$(go.Shape, // the arrowhead
          { toArrow: "Standard", stroke: null }),
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
          { fill: "white", stroke: "gray", strokeWidth: 2 }),
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
        this.makePort("T", go.Spot.Top, false, true),
        this.makePort("B", go.Spot.Bottom, true, false),
        { // handle mouse enter/leave events to show/hide the ports
          mouseEnter: (e, node) => { this.showSmallPorts(node, true); },
          mouseLeave: (e, node) => { this.showSmallPorts(node, false); }
        },
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
        ), // end Adornment
      },
      );
  };
  createLayout = () => {
    this.diagram.layout = this.$(
      go.LayeredDigraphLayout, {
        direction: 90,
        layerSpacing: 20,
        columnSpacing: 20,
        setsPortSpots: false,
      },
    );
  };
  
  makePort = (name, spot, output, input) => {
    // the port is basically just a small transparent square
    return this.$(go.Shape, "Circle",
      {
        fill: null, // not seen, by default; set to a translucent gray by showSmallPorts, defined below
        stroke: null,
        desiredSize: new go.Size(7, 7),
        alignment: spot, // align the port on the main Shape
        alignmentFocus: spot, // just inside the Shape
        portId: name, // declare this object to be a "port"
        fromSpot: spot, toSpot: spot, // declare where links may connect at this port
        fromLinkable: output, toLinkable: input, // declare whether the user may draw links to/from here
        cursor: "pointer" // show a different cursor to indicate potential link point
      });
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
