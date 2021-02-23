import React, { Component } from "react";
import Sketch from "react-p5";
import p5Types from "p5";
import Node from "./Node";
import layout from "./layout";

const root: INodeConfig = {
  name: "lv1-1",
  children: [
    {
      name: "lv2-1",
      children: [
        {
          name: "lv3-1",
          children: [
            {
              name: "lv4-1",
            },
            {
              name: "lv4-2",
            },
          ],
        },
        {
          name: "lv3-2",
          children: [
            {
              name: "lv4-3",
              children: [
                {
                  name: "lv5-1",
                  children: [
                    {
                      name: "lv6-1",
                    },
                  ],
                },
                {
                  name: "lv5-2",
                },
              ],
            },
            {
              name: "lv4-4",
              children: [
                {
                  name: "lv5-3",
                  children: [
                    {
                      name: "lv6-2",
                    },
                  ],
                },
                {
                  name: "lv5-4",
                },
              ],
            },
          ],
        },
      ],
    },
    {
      name: "lv2-2",
    },
    {
      name: "lv2-3",
      children: [
        {
          name: "lv3-3",
        },
        {
          name: "lv3-4",
          children: [
            {
              name: "lv4-5",
            },
          ],
        },
      ],
    },
  ],
};
// const root = {
//   name: "lv1-1",
//   children: [
//     {
//       name: "lv2-1",
//       children: [
//         {
//           name: "lv3-1",
//         },
//         {
//           name: "lv3-2",
//           children: [
//             {
//               name: "lv4-1",
//             },
//             {
//               name: "lv4-2",
//               children: [
//                 {
//                   name: "lv5-1",
//                 },
//                 {
//                   name: "lv5-2",
//                   children: [
//                     {
//                       name: "lv6-1",
//                     },
//                     {
//                       name: "lv6-2",
//                     },
//                   ],
//                 },
//               ],
//             },
//           ],
//         },
//       ],
//     },
//     {
//       name: "lv2-2",
//       children: [
//         {
//           name: "lv3-3",
//         },
//       ],
//     },
//     {
//       name: "lv2-3",
//       children: [
//         {
//           name: "lv3-4",
//         },
//         {
//           name: "lv3-5",
//           children: [
//             {
//               name: "lv4-3",
//               children: [
//                 {
//                   name: "lv5-3",
//                   children: [
//                     {
//                       name: "lv6-3",
//                     },
//                     {
//                       name: "lv6-4",
//                     },
//                   ],
//                 },
//                 {
//                   name: "lv5-4",
//                 },
//               ],
//             },
//             {
//               name: "lv4-4",
//             },
//           ],
//         },
//       ],
//     },
//   ],
// };

interface INodeConfig {
  name: string;
  children?: INodeConfig[];
}

const createTree = (root: INodeConfig, p5: p5Types, parent?: Node) => {
  const node = new Node(root.name, parent);
  node.children = (root.children || []).map((child) =>
    createTree(child, p5, node)
  );
  return node;
};

export default class App extends Component {
  root?: Node;
  setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(
      Math.max(window.innerWidth, 960),
      window.innerHeight
    ).parent(canvasParentRef);

    this.root = createTree(root, p5);
  };

  draw = (p5: p5Types) => {
    p5.background("#eee");
    layout(this.root!);
    this.root!.draw(p5);
    p5.noLoop();
  };

  render() {
    return <Sketch setup={this.setup as any} draw={this.draw as any} />;
  }
}
