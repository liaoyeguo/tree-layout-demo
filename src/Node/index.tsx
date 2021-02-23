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
    this.height = FONT_SIZE + PADDING * 2;
    this.parent = parent;
  }

  drawLines(p5: p5Types) {
    if (!this.children || this.children.length === 0) return;
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

  draw(p5: p5Types) {
    p5.push();
    p5.translate(this.x + this.width / 2, this.y + this.height / 2);
    p5.rectMode(p5.CENTER);
    p5.rect(0, 0, this.width, this.height);

    p5.textAlign(p5.CENTER, p5.CENTER);
    p5.text(this.name, 0, 0);

    p5.pop();

    this.drawLines(p5);

    this.children.forEach((child) => {
      child.draw(p5);
    });
  }
}
