import Image from "next/image";

type FigureKey = "plato" | "homer" | "discobolus" | "apollo";

/**
 * SMK's own photograph of the cast, shown only when the browser cannot draw the gallery in WebGL,
 * so every room still has its figure.
 */
export default function FigureFallback({
  figure,
  side,
}: {
  figure: FigureKey;
  side: "left" | "right" | "center";
}) {
  return (
    <Image
      src={`/statues/${figure}.webp`}
      alt=""
      aria-hidden="true"
      width={1024}
      height={1024}
      sizes="(max-width: 768px) 90vw, 46vw"
      className={`figure-fallback figure-fallback--${side}`}
    />
  );
}
