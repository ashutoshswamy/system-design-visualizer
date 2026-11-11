import { NODE_H, NODE_TYPES, NODE_W, STATUS_COLOR } from "@/lib/visualizer/constants";
import type { ThemeColors } from "@/lib/visualizer/theme";
import type { NodeStatus, NodeType } from "@/lib/visualizer/types";
import { NodeGlyph } from "./icons";

const GLYPH_INK = "#12151c";
const MAX_CHARS = 22;
const LABEL_W = 94; // room between the roundel and the right edge

export const BODY_FONT = "var(--font-dm-sans), ui-sans-serif, system-ui, sans-serif";

/** One component drawn as a transit station: line-colored outline, enamel roundel, label, status lamp.
 * Pure presentation, shared by the editor canvas and the landing map. Styling goes through `style`
 * so both literal hex (export-safe) and CSS var() values work. */
export function Station({
  type,
  label,
  status,
  colors,
  selected = false,
  multi = false,
  onStatusClick,
  children,
}: {
  type: NodeType;
  label: string;
  status: NodeStatus;
  colors: ThemeColors;
  selected?: boolean;
  multi?: boolean;
  onStatusClick?: () => void;
  children?: React.ReactNode;
}) {
  const color = NODE_TYPES[type].color;
  const text = label.length > MAX_CHARS ? `${label.slice(0, MAX_CHARS - 1)}…` : label;

  return (
    <>
      {(selected || multi) && (
        <rect
          x="-5"
          y="-5"
          width={NODE_W + 10}
          height={NODE_H + 10}
          rx="16"
          style={{ fill: "none", stroke: colors.ink, strokeWidth: 2, strokeDasharray: multi ? "5 4" : undefined }}
          className="no-export"
        />
      )}
      <rect
        width={NODE_W}
        height={NODE_H}
        rx="12"
        style={{ fill: colors.panel2, stroke: color, strokeWidth: 2.5 }}
      />
      <circle cx="30" cy={NODE_H / 2} r="17" fill={color} />
      <g transform={`translate(${30 - 10}, ${NODE_H / 2 - 10}) scale(${20 / 24})`}>
        <NodeGlyph type={type} color={GLYPH_INK} strokeWidth={2} />
      </g>
      <text
        x="56"
        y={NODE_H / 2}
        dominantBaseline="central"
        fontSize="14"
        fontWeight="600"
        textLength={text.length > 11 ? LABEL_W : undefined}
        lengthAdjust="spacingAndGlyphs"
        style={{ fill: colors.text, fontFamily: BODY_FONT }}
      >
        {text}
      </text>
      <circle cx={NODE_W - 14} cy="14" r="6" style={{ fill: STATUS_COLOR[status], stroke: colors.panel2, strokeWidth: 2 }} />
      {onStatusClick && (
        <circle
          cx={NODE_W - 14}
          cy="14"
          r="12"
          fill="transparent"
          onPointerDown={(e) => e.stopPropagation()}
          onClick={(e) => {
            e.stopPropagation();
            onStatusClick();
          }}
          style={{ cursor: "pointer" }}
        >
          <title>{`Status: ${status}. Click to change.`}</title>
        </circle>
      )}
      {children}
    </>
  );
}
