// Shared state between the DOM rooms and the WebGL gallery. Plain mutable data read every frame,
// so scroll and pointer never trigger React renders.

export type FigureId = "plato" | "homer" | "discobolus" | "apollo";
/** Every room the sun reaches: the painting's entrance, the five figures and the works under their portico. */
export type RoomId = FigureId | "hero" | "works";

export interface RoomState {
  /** 0 while the room is still in haze, 1 when the visitor stands in it. */
  light: number;
  /** 0 when the room enters from below, 1 when it has left above. */
  progress: number;
  /** The room's top and bottom edges in viewport pixels, and the viewport height. */
  top: number;
  bottom: number;
  viewport: number;
}

export const gallery = {
  pointer: { x: 0, y: 0, active: false },
  rooms: {} as Partial<Record<RoomId, RoomState>>,
  /** Set by the canvas so DOM events can request a frame. */
  invalidate: () => {},
  reducedMotion: false,
  /** How far each painting has dissolved into the ground's haze (0 clear, 1 gone), keyed by its frame. */
  paintings: new WeakMap<Element, number>(),
};

export function roomState(id: RoomId): RoomState {
  let state = gallery.rooms[id];
  if (!state) {
    state = { light: 0, progress: 0, top: Infinity, bottom: Infinity, viewport: 1 };
    gallery.rooms[id] = state;
  }
  return state;
}
