let canvas;
let grid;

const CELL_DRAW_SIZE = 50;
const MAP_SIZE = 10;

const SIDE = {
  LEFT: "LEFT",
  RIGHT: "RIGHT",
  BOTTOM: "BOTTOM"
};

function setup() {
  canvas = createCanvas(windowWidth, windowHeight);

  grid = new Grid();

  grid.setup({ size: MAP_SIZE });
  // }

  // function draw() {
  background("#121212");
  stroke("#fff");

  grid.draw();
}

// class Connection {
//   constructor({ from = Node, to = Node } = {}) {
//     this.from = from;
//     this.to = to;
//   }
// }

let idCounter = 0;

class Node {
  constructor({ x = 0, y = 0 } = {}) {
    this._id = idCounter++;

    this.x = x;
    this.y = y;

    this.connections = [];
  }

  draw() {
    push();

    stroke(Math.random() > 0.5 ? "#f00" : "#0f0");

    // rect(
    //   this.x * CELL_DRAW_SIZE,
    //   this.y * CELL_DRAW_SIZE,
    //   CELL_DRAW_SIZE - 1,
    //   CELL_DRAW_SIZE - 1
    // );

    const padding = 2;

    const topPoint = {
      x: this.x * CELL_DRAW_SIZE + CELL_DRAW_SIZE / 2,
      y: this.y * CELL_DRAW_SIZE + padding
    };

    const leftPoint = {
      x: this.x * CELL_DRAW_SIZE + padding,
      y: this.y * CELL_DRAW_SIZE + CELL_DRAW_SIZE - padding
    };

    const rightPoint = {
      x: this.x * CELL_DRAW_SIZE + CELL_DRAW_SIZE - padding,
      y: this.y * CELL_DRAW_SIZE + CELL_DRAW_SIZE - padding
    };

    // draw left
    line(topPoint.x, topPoint.y, leftPoint.x, leftPoint.y);

    // draw right
    line(topPoint.x, topPoint.y, rightPoint.x, rightPoint.y);

    // draw bottom
    line(leftPoint.x, leftPoint.y, rightPoint.x, rightPoint.y);

    pop();
  }

  getConnection(side) {
    return this.connections.find(connection => connection.side === side);
  }

  getSiblingLeft() {
    const connection = this.getConnection(SIDE.LEFT);

    if (connection) return connection.sibling;
  }

  getSiblingRight() {
    const connection = this.getConnection(SIDE.RIGHT);

    if (connection) return connection.sibling;
  }

  getSiblingBottom() {
    const connection = this.getConnection(SIDE.BOTTOM);

    if (connection) return connection.sibling;
  }
}

class Grid {
  constructor() {
    /** @type Node[] */
    this.nodes = [];
  }

  setup({ size = 0 } = {}) {
    this.generate({ size });
    this.connectNodes();
  }

  generate({ size = 0 } = {}) {
    let y = 0;

    for (let s = 0; s < size; s++) {
      for (let v = 0; v <= y * 2; v++) {
        const x = v / 2 + (size - y) / 2;

        console.log(x);

        const node = new Node({ x, y });

        this.nodes.push(node);
      }

      y++;
    }

    console.log(this.nodes);
  }

  getNode({ x, y }) {
    return this.nodes.find(node => node.x === x && node.y === y);
  }

  connectNodes() {
    for (const node of this.nodes) {
      if (node.getSiblingLeft() === undefined) {
        const sibling = this.getNode({
          x: node.x - 1,
          y: node.y
        });

        if (sibling)
          node.connections.push({ side: SIDE.LEFT, sibling: sibling });
      }
      if (node.getSiblingRight() === undefined) {
        const sibling = this.getNode({
          x: node.x + 1,
          y: node.y
        });

        if (sibling)
          node.connections.push({ side: SIDE.RIGHT, sibling: sibling });
      }

      if (node.getSiblingBottom() === undefined) {
        const sibling = this.getNode({
          x: node.x,
          y: node.y + 1
        });

        if (sibling)
          node.connections.push({ side: SIDE.BOTTOM, sibling: sibling });
      }
    }
  }

  draw() {
    for (const node of this.nodes) {
      node.draw();
    }
  }
}
