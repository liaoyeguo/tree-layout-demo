interface INode {
  name: string;
  parent?: INode;
  x: number;
  y: number;
  width: number;
  height: number;
  children: INode[];
}

const layoutY = (node: INode, y: number = 0, levelGap: number = 0) => {
  node.y = y;
  node.children.forEach((child) => {
    layoutY(child, y + node.height + levelGap, levelGap);
  });
};

const findLeftSubling = (node: INode) => {
  const parent = node.parent;
  if (!parent) return undefined;

  const idx = parent.children.findIndex((child) => child === node);
  if (idx > 0) return parent.children[idx - 1];
  return undefined;
};

const layoutX = (
  node: INode,
  { nodeGap, treeGap }: { nodeGap: number; treeGap: number }
) => {
  const modifies = new Map<INode, number>();
  const rightMostAtLv = new Map<number, INode>();
  const leftNeighbors = new Map<INode, INode>();
  const threads = new Map<INode, INode>();

  const findLeftMostChildAtLv = (node: INode, lv: number): any => {
    if (lv === 0) return node;
    for (let i = 0; i < node.children.length; i++) {
      const child = node.children[i];
      const res = findLeftMostChildAtLv(child, lv - 1);
      if (res) {
        // console.log(node.name, res.name);
        return res;
      }
    }
  };

  const pushApart = (
    node: INode,
    lastLeftMostRef: any,
    lastRightMostRef: any,
    leftMostRef: any,
    rightMostRef: any
  ) => {
    const nextNodeOnContour = (node: INode, isRight = false) => {
      if (node.children && node.children.length > 0) {
        return node.children[isRight ? node.children.length - 1 : 0];
      } else {
        return threads.get(node);
      }
    };

    let leftNeighbor: INode | undefined = findLeftSubling(node);
    if (!leftNeighbor) return;

    leftNeighbor = nextNodeOnContour(leftNeighbor, true);
    let child: INode | undefined = nextNodeOnContour(node);

    let depth = 1;

    while (child && leftNeighbor) {
      let leftNeighborX = leftNeighbor.x;
      let childX = child.x;

      let i = depth;
      let leftAncestor: INode = leftNeighbor;
      let chilAncestor: INode = child;

      while (i-- > 0 && leftAncestor.parent && chilAncestor.parent) {
        leftAncestor = leftAncestor.parent;
        chilAncestor = chilAncestor.parent;

        leftNeighborX += modifies.get(leftAncestor) || 0;
        childX += modifies.get(chilAncestor) || 0;
      }

      const modify = leftNeighborX + leftNeighbor.width + treeGap - childX;

      if (modify > 0) {
        modifies.set(node, modifies.get(node)! + modify);
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

            modifies.set(
              commonParent.children[j],
              modifies.get(commonParent.children[j])! + distanceJ
            );
          }
        }
      }

      child = nextNodeOnContour(child);
      leftNeighbor = nextNodeOnContour(leftNeighbor, true);
      depth++;
    }

    if (child) {
      threads.set(lastLeftMostRef.node, child);
      lastLeftMostRef.node = leftMostRef.node;
      lastRightMostRef.node = rightMostRef.node;
    } else if (leftNeighbor) {
      threads.set(rightMostRef.node, leftNeighbor);
    }
    // let child = parent;

    // let depth = 0;
    // while (child) {
    //   depth++;
    //   const leftNeighbor = leftNeighbors.get(child);
    //   if (leftNeighbor) {
    //     let leftNeighborX = leftNeighbor.x;
    //     let childX = child.x;

    //     let i = depth;
    //     let leftAncestor = leftNeighbor;
    //     let chilAncestor = child;
    //     while (--i) {
    //       leftAncestor = leftAncestor.parent!;
    //       chilAncestor = chilAncestor.parent!;
    //       leftNeighborX += modifies.get(leftAncestor) || 0;
    //       childX += modifies.get(chilAncestor) || 0;
    //     }

    //     const modify = leftNeighborX + leftNeighbor.width + treeGap - childX;

    //     console.log(
    //       parent.name,
    //       modify,
    //       leftNeighbor.name,
    //       leftNeighborX,
    //       child.name,
    //       childX,
    //       leftAncestor.name,
    //       chilAncestor.name
    //     );

    //     if (modify > 0) {
    //       // console.log(leftNeighbor.name, child.name, modify, leftNeighborX, childX, leftAncestor.x, chilAncestor.x);
    //       modifies.set(parent, modifies.get(parent)! + modify);
    //       parent.x += modify;

    //       const commonParent = leftAncestor.parent!;
    //       const leftAncestorIndex = commonParent?.children.indexOf(
    //         leftAncestor
    //       );
    //       const childIndex = commonParent?.children.indexOf(chilAncestor);
    //       const nodeBetweenCount = childIndex - leftAncestorIndex - 1;

    //       if (nodeBetweenCount) {
    //         for (let j = leftAncestorIndex + 1; j < childIndex; j++) {
    //           const distanceJ =
    //             (modify / (nodeBetweenCount + 1)) * (j - leftAncestorIndex);
    //           commonParent.children[j].x += distanceJ;

    //           modifies.set(
    //             commonParent.children[j],
    //             modifies.get(commonParent.children[j])! + distanceJ
    //           );
    //         }
    //       }
    //     }
    //   }

    //   child = findLeftMostChildAtLv(parent, depth);
    // }
  };

  const setXAndModify = (node: INode) => {
    const letfSubling = findLeftSubling(node);
    // 计算 node 节点的位置。
    if (letfSubling) node.x = letfSubling.x + letfSubling.width + nodeGap;
    else node.x = node.x || 0;

    // 如果不是叶节点，计算modify
    if (node.children && node.children.length > 0) {
      const mid =
        (node.children[0].x + node.children[node.children.length - 1].x) / 2;

      const modify = node.x - mid;
      modifies.set(node, modify);
    }
  };

  const setThread = () => {};

  const postTravel = (
    node: INode,
    lv: number,
    lastLeftMostRef: any = {},
    lastRightMostRef: any = {}
  ) => {
    const leftMostRef: any = {};
    const rightMostRef: any = {};
    if (node.children && node.children.length > 0) {
      // 计算子树的位置，此时不考虑其他子树
      node.children.forEach((child) =>
        postTravel(child, lv + 1, leftMostRef, rightMostRef)
      );
    } else {
      leftMostRef.node = node;
      rightMostRef.node = node;
    }

    // console.log(
    //   node.name,
    //   lastLeftMostRef.node?.name,
    //   lastRightMostRef.node?.name,
    //   leftMostRef.node?.name,
    //   rightMostRef.node?.name
    // );
    // 设置 node 的 x 和 modify
    setXAndModify(node);
    pushApart(
      node,
      lastLeftMostRef,
      lastRightMostRef,
      leftMostRef,
      rightMostRef
    );
    setThread();
  };
  const preTravel = (node: INode, accModfiy: number = 0) => {
    if (accModfiy) node.x += accModfiy;
    console.log(node.name, node.height);
    node.children.forEach((child) =>
      preTravel(child, modifies.get(node)! + accModfiy)
    );
  };

  postTravel(node, 0);

  preTravel(node);
};

const layout = (
  node: INode,
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
