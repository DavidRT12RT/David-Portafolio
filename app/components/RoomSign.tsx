import type * as React from "react";
import type { ReactNode } from "react";

/** Bilingual room signage: the Greek name carved large, the visitor's language beneath it. */
export default function RoomSign({
  id,
  greek,
  local,
  highlight,
  note,
  as: Tag = "h2",
  className = "",
  noteClassName = "",
}: {
  id: string;
  greek: string;
  local: ReactNode;
  highlight?: ReactNode;
  note?: ReactNode;
  as?: "h2" | "h3";
  className?: string;
  noteClassName?: string;
}) {
  return (
    <div className={className}>
      <Tag id={id} className="room-sign">
        <span
          data-slot="badge"
          lang="el"
          className="room-sign__greek"
          style={{ "--glyphs": greek.length } as React.CSSProperties}
        >
          {greek}
        </span>
        <span className="room-sign__local">
          {local}
          {highlight ? (
            <>
              {" "}
              <strong>{highlight}</strong>
            </>
          ) : null}
        </span>
      </Tag>
      {note ? <p className={`room-sign__note max-w-[46ch] ${noteClassName}`}>{note}</p> : null}
    </div>
  );
}
