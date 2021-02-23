import p5Types from "p5";

const PADDING = 20;
const FONT_SIZE = 12;

export default class Node {
  public name: string;
  public x: number = 0;
  public y: number = 0;
  public width: number = 0;
  public height: number = 0;
  public children: Node[] = [];
  public parent?: Node;

  constructor(name: string, parent?: Node) {
    this.name = name;
    this.width = 70;
    this.height = 52;
    this.parent = parent;
  }

  draw(p5: p5Types) {
    p5.push();
    p5.translate(this.x + this.width / 2, this.y + this.height / 2);

    // 画边框和name
    p5.rectMode(p5.CENTER);
    p5.rect(0, 0, this.width, this.height);
    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.text(this.name, 0, 0);

    p5.pop();

    // 画出和子节点的连线
    this.drawLines(p5);

    this.children.forEach((child) => {
      child.draw(p5);
    });
  }

  drawLines(p5: p5Types) {
    if (this.children.length === 0) return;

    p5.line(
      this.x + this.width / 2,
      this.y + this.height,
      this.x + this.width / 2,
      this.y + this.height + 10
    );

    this.children.forEach((child) => {
      this.lineTo(child, p5);
    });
  }

  lineTo(child: Node, p5: p5Types) {
    p5.line(
      this.x + this.width / 2,
      this.y + this.height + 10,
      child.x + child.width / 2,
      this.y + this.height + 10
    );

    p5.line(
      child.x + child.width / 2,
      this.y + this.height + 10,
      child.x + child.width / 2,
      child.y
    );
  }
}
