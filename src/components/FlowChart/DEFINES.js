export const SHAPE = {
  ROUNDEDRECTANGLE: 'RoundedRectangle', //圆角矩形
  ELLIPSE: 'Ellipse', // 椭圆
  RECTANGLE: 'Rectangle', // 方角矩形
  TRIANGLE: 'Triangle', // 三角形
  DIAMOND: 'Diamond', // 菱形
};

export const ACTION = {
  CLICK: { text: '点击', type: 'CLICK' },
  OPENPAGE: { text: '打开网页', type: 'OPENPAGE' },
  GETDATA: { text: '收集数据', type: 'GETDATA' },
};

export const NODES = {
  CLICK: {
    TYPE: ACTION.CLICK.type,
    COLOR: '#D99',
    SHAPE: SHAPE.ROUNDEDRECTANGLE,
  },
  OPENPAGE: {
    TYPE: ACTION.OPENPAGE.type,
    COLOR: '#799',
    SHAPE: SHAPE.ELLIPSE,
  },
  GETDATA: {
    TYPE: ACTION.GETDATA.type,
    COLOR: '#997',
    SHAPE: SHAPE.TRIANGLE,
  }
};