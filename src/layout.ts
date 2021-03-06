// interface Node {
//   name: string;
//   parent?: Node;
//   x: number;
//   y: number;
//   width: number;
//   height: number;
//   children: Node[];
// }
import Node from "./Node";

const layoutY = (node: Node, y: number = 0, levelGap: number = 0) => {
  node.y = y;
  node.children.forEach((child) => {
    layoutY(child, y + node.height + levelGap, levelGap);
  });
};

const findLeftSubling = (node: Node) => {
  const parent = node.parent;
  if (!parent) return undefined;

  const idx = parent.children.findIndex((child) => child === node);
  if (idx > 0) return parent.children[idx - 1];
  return undefined;
};

const layoutX = (
  node: Node,
  { nodeGap, treeGap }: { nodeGap: number; treeGap: number }
) => {
  const pushApart = (
    node: Node,
    lastLeftMostRef: any,
    lastRightMostRef: any,
    leftMostRef: any,
    rightMostRef: any
  ) => {
    const nextNodeOnContour = (node: Node, isRight = false) => {
      if (node.children && node.children.length > 0) {
        return node.children[isRight ? node.children.length - 1 : 0];
      } else {
        return node.thread;
      }
    };

    let leftNeighbor: Node | undefined = findLeftSubling(node);
    if (!leftNeighbor) {
      // 没有兄弟节点就不需要比较了
      lastLeftMostRef.node = node;
      lastRightMostRef.node = node;
      return;
    }

    leftNeighbor = nextNodeOnContour(leftNeighbor, true);
    let child: Node | undefined = nextNodeOnContour(node);

    let depth = 1;

    let t = [node.name];
    while (child && leftNeighbor) {
      let leftNeighborX = leftNeighbor.x;
      let childX = child.x;

      t.push(child.name);

      let i = depth;
      let leftAncestor: Node = leftNeighbor;
      let chilAncestor: Node = child;

      while (i-- > 0 && leftAncestor.parent && chilAncestor.parent) {
        leftAncestor = leftAncestor.parent;
        chilAncestor = chilAncestor.parent;

        leftNeighborX += leftAncestor.modify;
        childX += chilAncestor.modify;
      }

      const modify = leftNeighborX + leftNeighbor.width + treeGap - childX;

      if (modify > 0) {
        node.modify += modify;
        node.x += modify;

        // apportion
        const commonParent = leftAncestor.parent;
        if (!commonParent) continue;
        const leftAncestorIndex = commonParent.children.indexOf(leftAncestor);
        const childIndex = commonParent.children.indexOf(chilAncestor);
        const nodeBetweenCount = childIndex - leftAncestorIndex - 1;

        if (nodeBetweenCount) {
          for (let j = leftAncestorIndex + 1; j < childIndex; j++) {
            const distanceJ =
              (modify / (nodeBetweenCount + 1)) * (j - leftAncestorIndex);
            commonParent.children[j].x += distanceJ;
            commonParent.children[j].modify += distanceJ;
          }
        }
      }

      child = nextNodeOnContour(child);
      leftNeighbor = nextNodeOnContour(leftNeighbor, true);
      depth++;
    }

    if (child) {
      lastLeftMostRef.node.thread = child;
      lastLeftMostRef.node = leftMostRef.node;
      lastRightMostRef.node = rightMostRef.node;
    } else if (leftNeighbor) {
      rightMostRef.node.thread = leftNeighbor;
    }
  };

  const initXAndModify = (node: Node) => {
    const letfSubling = findLeftSubling(node);
    // 计算 x。
    if (letfSubling) node.x = letfSubling.x + letfSubling.width + nodeGap;
    else node.x = node.x || 0;

    // 如果不是叶节点，计算modify。
    if (node.children && node.children.length > 0) {
      const mid =
        (node.children[0].x + node.children[node.children.length - 1].x) / 2;

      const modify = node.x - mid;
      node.modify = modify;
    }
  };

  const postTravel = (
    node: Node,
    lv: number,
    lastLeftMostRef: any = {},
    lastRightMostRef: any = {}
  ) => {
    const leftMostRef: any = { node };
    const rightMostRef: any = { node };
    if (node.children && node.children.length > 0) {
      // 计算子树的位置，此时不考虑其他子树
      node.children.forEach((child) => {
        postTravel(child, lv + 1, leftMostRef, rightMostRef);
      });
    }

    initXAndModify(node);
    pushApart(
      node,
      lastLeftMostRef,
      lastRightMostRef,
      leftMostRef,
      rightMostRef
    );
  };
  const preTravel = (node: Node, accModfiy: number = 0) => {
    if (accModfiy) node.x += accModfiy;
    node.children.forEach((child) => preTravel(child, node.modify + accModfiy));
  };

  postTravel(node, 0);

  preTravel(node);
};

const layout = (
  node: Node,
  {
    levelGap,
    nodeGap,
    treeGap,
  }: { levelGap: number; nodeGap: number; treeGap: number } = {
    levelGap: 30,
    nodeGap: 20,
    treeGap: 60,
  }
) => {
  node.x = (window.innerWidth - node.width) / 2;
  layoutY(node, 100, levelGap);
  layoutX(node, { nodeGap, treeGap });
};

export default layout;
