import type { FigureId } from "@/app/lib/gallery";

/** Where a figure stands on screen: center in NDC (-1..1) and height as a share of the viewport. */
export interface Placement {
  x: number;
  y: number;
  h: number;
}

export interface FigureConfig {
  id: FigureId;
  model: string;
  desktop: Placement;
  portrait: Placement;
  /** Yaw in radians as the room's progress goes from 0 to 1. */
  yaw: [number, number];
  /** Side the sun comes from: 1 is the visitor's right. */
  keySide: 1 | -1;
  /** Strength of the baked surface detail (normal map scale). */
  relief?: number;
  /** Plinth footprint relative to the figure's height; it always reaches the bottom of the view. */
  plinth?: { w: number; d: number };
  /** Ground at the figure's base that catches its shadow (only the shadow shows). */
  floor?: boolean;
  /** Named points in the figure's normalized space (height 1, base at 0) for leader lines. */
  anchors?: Record<string, [number, number, number]>;
}

export const FIGURES: FigureConfig[] = [
  {
    id: "plato",
    model: "/models/plato.glb",
    desktop: { x: 0.5, y: -0.12, h: 0.64 },
    portrait: { x: 0, y: 0.44, h: 0.36 },
    yaw: [-0.55, -0.1],
    keySide: 1,
    plinth: { w: 0.62, d: 0.55 },
  },
  {
    id: "homer",
    model: "/models/homer.glb",
    desktop: { x: -0.56, y: -0.1, h: 0.5 },
    portrait: { x: 0, y: 0.46, h: 0.3 },
    yaw: [0.5, 0.05],
    keySide: -1,
    plinth: { w: 0.7, d: 0.6 },
  },
  {
    id: "discobolus",
    model: "/models/discobolus.glb",
    desktop: { x: 0, y: -0.07, h: 0.8 },
    portrait: { x: 0, y: 0.44, h: 0.38 },
    yaw: [-0.7, 0.7],
    keySide: 1,
    floor: true,
    // Measured on the scan's visible surface (normalized: height 1, base at 0, front +Z).
    anchors: {
      head: [0.25, 0.765, 0.11],
      hand: [-0.274, 0.939, 0.143],
      torso: [0.055, 0.65, 0.03],
      base: [-0.014, 0.0435, 0.12],
    },
  },
  {
    // Athena, goddess of wisdom, keeps the room where the AI is shown at work.
    id: "athena",
    model: "/models/athena.glb",
    desktop: { x: -0.48, y: -0.12, h: 0.74 },
    portrait: { x: 0, y: 0.45, h: 0.34 },
    yaw: [0.42, -0.16],
    keySide: -1,
    relief: 1.4,
    plinth: { w: 0.62, d: 0.56 },
  },
  {
    id: "apollo",
    model: "/models/apollo.glb",
    desktop: { x: 0.52, y: -0.05, h: 0.9 },
    portrait: { x: 0, y: 0.44, h: 0.38 },
    yaw: [-0.35, 0.1],
    keySide: 1,
  },
];

/** The works room: one Ionic column per project, each with its panel and its own shaft of sun. */
export const COLONNADE = {
  plates: [
    "/projects/plates/solomon.webp",
    "/projects/plates/kapli.webp",
    "/projects/plates/scaleflow.webp",
    "/projects/plates/advance.webp",
  ],
  /** Screenshot proportions (width / height). */
  aspect: 1.72,
  // The panels hang low enough that each one's shaft of sun can be seen falling from the roof.
  desktop: { gap: 0.36, panel: 0.26, panelTop: 0.23 },
  portrait: { gap: 0.92, panel: 0.8, panelTop: 0.25 },
};
