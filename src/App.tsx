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

interface INodeConfig {
  name: string;
  children?: INodeConfig[];
}

const createTree = (root: INodeConfig, parent?: Node) => {
  const node = new Node(root.name, parent);
  node.children = (root.children || []).map((child) => createTree(child, node));
  return node;
};

export default class App extends Component {
  root?: Node;
  setup = (p5: p5Types, canvasParentRef: Element) => {
    p5.createCanvas(
      Math.max(window.innerWidth, 960),
      Math.max(window.innerHeight, 1000)
    ).parent(canvasParentRef);

    this.root = createTree(root);
    layout(this.root);
  };

  draw = (p5: p5Types) => {
    p5.background("#eee");

    this.root!.draw(p5);
    p5.noLoop();
  };

  render() {
    return <Sketch setup={this.setup as any} draw={this.draw as any} />;
  }
}
