import { Color, Point } from "./interfaces";

export class Img {
  width: number;
  height: number;
  pixels: Color[][];

  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.pixels = [];

    for (let x = 0; x < width; x++) {
      this.pixels[x] = [];

      for (let y = 0; y < height; y++) {
        this.pixels[x][y] = { r: 255, g: 255, b: 255, a: 1 };
      }
    }
  }

  setPixel({ x, y }: Point, color: Color) {
    this.pixels[x][y] = color;
  }
}

export class Artboard {
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  image = new Img(30, 30);
  zoom = 20;

  constructor(canvas: HTMLCanvasElement, context: CanvasRenderingContext2D) {
    this.canvas = canvas;
    this.context = context;

    canvas.width = document.body.clientWidth;
    canvas.height = document.body.clientHeight;

    this.draw();
  }

  drawPixel(point: Point, color: Color) {
    const { r, g, b, a } = color;
    const { x, y } = point;

    const absoluteX = Math.floor(x / this.zoom);
    const absoluteY = Math.floor(y / this.zoom);

    if (absoluteX >= this.image.width || absoluteY >= this.image.height) {
      return;
    }

    this.image.setPixel({ x: absoluteX, y: absoluteY }, color);

    this.context.fillStyle = `rgba(${r}, ${g}, ${b}, ${a})`;
    this.context.fillRect(
      absoluteX * this.zoom,
      absoluteY * this.zoom,
      this.zoom,
      this.zoom
    );

    if (this.zoom > 4) {
      this.context.strokeStyle = "#ddd";
      this.context.strokeRect(
        absoluteX * this.zoom,
        absoluteY * this.zoom,
        this.zoom,
        this.zoom
      );
    }
  }

  draw() {
    this.image.pixels.forEach((row, x) => {
      row.forEach((_, y) => {
        this.drawPixel(
          { x: x * this.zoom, y: y * this.zoom },
          this.image.pixels[x][y]
        );
      });
    });
  }
}

export class ColorPicker {
  static activeClass = "ui-color-button--active";

  element: Element;
  setColor: (color: Color) => void;
  colors: Color[] = [
    { r: 0, g: 0, b: 0, a: 1 },
    { r: 255, g: 255, b: 255, a: 1 },
    { r: 255, g: 0, b: 0, a: 1 },
    { r: 0, g: 255, b: 0, a: 1 },
    { r: 0, g: 0, b: 255, a: 1 }
  ];

  constructor(element: Element, setColor: (color: Color) => void) {
    this.element = element;
    this.setColor = setColor;

    this.mount();
  }

  mount() {
    this.colors.forEach((color) => {
      const button = document.createElement("button");
      button.addEventListener("click", (e: MouseEvent) => {
        this.setColor(color);

        document
          .querySelectorAll(`.${ColorPicker.activeClass}`)
          .forEach((button) =>
            button.classList.remove(ColorPicker.activeClass)
          );

        if (e.currentTarget) {
          (e.currentTarget as HTMLButtonElement).classList.add(
            ColorPicker.activeClass
          );
        }
      });
      button.innerHTML = `<span style="background-color: rgba(${color.r}, ${color.g}, ${color.b}, ${color.a})" class="color-button"></span>`;
      this.element.appendChild(button);
    });
  }
}
