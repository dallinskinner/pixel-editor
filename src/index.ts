import "reset-css";
import { Artboard, ColorPicker } from "./classes";
import { State, Color } from "./interfaces";

function handleMouseDownOrMouseMove(
  e: MouseEvent,
  artboard: Artboard,
  color: Color
) {
  const { offsetX, offsetY } = e;
  e.preventDefault();

  artboard.drawPixel({ x: offsetX, y: offsetY }, color);
}

function main() {
  const state: State = {
    isDrawing: false,
    color: { r: 0, g: 0, b: 0, a: 1 }
  };

  const canvas: HTMLCanvasElement | null = document.querySelector("#canvas");
  if (!canvas) {
    alert("No canvas found");
    return;
  }

  const context = canvas.getContext("2d");

  if (!context) {
    alert("Unable to get drawing context");
    return;
  }

  const artboard = new Artboard(canvas, context);

  canvas.addEventListener("mousedown", (e) => {
    handleMouseDownOrMouseMove(e, artboard, state.color);
    state.isDrawing = true;
  });

  canvas.addEventListener("mousemove", (e) => {
    if (state.isDrawing) {
      handleMouseDownOrMouseMove(e, artboard, state.color);
    }
  });

  canvas.addEventListener("mouseup", () => {
    state.isDrawing = false;
  });

  const colorPickerElement = document.querySelector("#color-picker");

  if (!colorPickerElement) {
    alert("Could not mount colorPicker");
    return;
  }

  const colorPicker = new ColorPicker(
    colorPickerElement,
    (color) => (state.color = color)
  );
}

main();
