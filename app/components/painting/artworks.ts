import type { LayerSpec } from "./painting-renderer";

/** A painting the site shows full screen, with the depth map that gives it parallax. */
export interface Artwork {
  /** Files: /paintings/{slug}-{width}.webp and /paintings/{slug}-depth.webp. */
  slug: string;
  widths: number[];
  /** Width over height of the painting as delivered. */
  aspect: number;
  /** A tone close to the painting's own, shown until it arrives. */
  tone: string;
  /**
   * An animated painting: the canvas draws its figures, cut out of it, over the painting without
   * them (/paintings/{slug}-plate-{width}.webp, with /paintings/{slug}-plate-depth.webp), from
   * /paintings/{slug}-layer-{name}.webp. The plain image keeps the whole painting.
   */
  plate?: number[];
  layers?: (LayerSpec & { name: string })[];
  /** The plate keeps the painting's own depth map (/paintings/{slug}-depth.webp). */
  sharedDepth?: boolean;
}

export const ARTWORKS = {
  // Thomas Cole, The Course of Empire: The Consummation of Empire, 1836. New-York Historical Society.
  // Its seven painted clouds were lifted off the sky (LaMa painted the sky back behind them) so they
  // can drift across it; at rest they sit exactly where Cole put them.
  consummation: {
    slug: "consummation",
    widths: [1280, 1920, 2560, 3840],
    aspect: 7784 / 5277,
    tone: "#c9beb6",
    plate: [1920, 2560, 3840],
    sharedDepth: true,
    layers: [
      { name: "cloud0", rect: [0.3581, 0.02, 0.5565, 0.1026], depth: 0.008, pivot: [0.4573, 0.0613], mask: "sky" },
      { name: "cloud1", rect: [0.2852, 0.3096, 0.3661, 0.3577], depth: 0.008, pivot: [0.3256, 0.3337], mask: "sky" },
      { name: "cloud2", rect: [0.1841, 0.1348, 0.2372, 0.2113], depth: 0.008, pivot: [0.2107, 0.173], mask: "sky" },
      { name: "cloud3", rect: [0.7461, 0.4368, 0.7794, 0.5063], depth: 0.008, pivot: [0.7628, 0.4716], mask: "sky" },
      { name: "cloud4", rect: [0.0333, 0.1856, 0.0898, 0.2151], depth: 0.008, pivot: [0.0616, 0.2004], mask: "sky" },
      { name: "cloud5", rect: [0.2966, 0.1168, 0.3346, 0.1498], depth: 0.008, pivot: [0.3156, 0.1333], mask: "sky" },
      { name: "cloud6", rect: [0.7984, 0.4045, 0.8357, 0.4341], depth: 0.008, pivot: [0.8171, 0.4193], mask: "sky" },
    ],
  },
  // Francisco Bayeu, Olympus: The Fall of the Giants, 1764 (sketch for a Royal Palace ceiling). Museo del Prado.
  olympus: { slug: "bayeu-olympus", widths: [1280, 1920, 2560, 2953], aspect: 2953 / 1612, tone: "#685c4b" },
  // Peter Paul Rubens, The Battle of the Amazons, c. 1618. Alte Pinakothek, Munich.
  amazons: { slug: "rubens-amazons", widths: [1280, 1920, 2560, 3000], aspect: 3000 / 2195, tone: "#725e3f" },
  // Camillo Miola, The Oracle, 1880. The J. Paul Getty Museum (Open Content).
  oracle: { slug: "miola-oracle", widths: [1280, 1920, 2560, 3840], aspect: 8511 / 6434, tone: "#4f3a2b" },
  // Jacob Jordaens, The Fall of the Giants, 1636–1638. Museo del Prado. Its giants were cut out with
  // SAM and the rocks behind them painted back with LaMa, so each can move on its own.
  giants: {
    slug: "jordaens-giants",
    widths: [1280, 1920, 2560, 3051],
    aspect: 3051 / 1915,
    tone: "#5a4e3f",
    plate: [1280, 1920, 2560, 3051],
    layers: [
      { name: "fallers", rect: [0.216, 0.1117, 0.4743, 0.5556], depth: 0.08, pivot: [0.34, 0.33] },
      { name: "screamer", rect: [0.8007, 0.0601, 0.981, 0.3619], depth: 0.22, pivot: [0.88, 0.3] },
      { name: "holder", rect: [0.845, 0.211, 1, 0.5039], depth: 0.325, pivot: [0.93, 0.5] },
      { name: "lifter", rect: [0, 0.0475, 0.2553, 0.8167], depth: 0.296, pivot: [0.14, 0.64] },
      { name: "crushed", rect: [0.5916, 0.6141, 1, 0.9629], depth: 0.461, pivot: [0.8, 0.95] },
      { name: "atlas", rect: [0.3543, 0, 0.8378, 0.9603], depth: 0.495, pivot: [0.6, 0.95] },
      { name: "diver", rect: [0, 0.5211, 0.3812, 0.9896], depth: 0.375, pivot: [0.2, 0.75] },
    ],
  },
  // Frederic Edwin Church, The Parthenon, 1871. The Metropolitan Museum of Art (Open Access, CC0).
  parthenon: { slug: "church-parthenon", widths: [1280, 1920, 2560, 3719], aspect: 3719 / 2252, tone: "#716146" },
} satisfies Record<string, Artwork>;
