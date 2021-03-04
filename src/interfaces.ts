export interface Color {
  r: number;
  g: number;
  b: number;
  a: number;
}

export interface Point {
  x: number;
  y: number;
}

export interface State {
  isDrawing: boolean;
  color: Color;
}
