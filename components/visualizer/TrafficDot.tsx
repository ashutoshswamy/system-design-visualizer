import { flowFor } from "@/lib/visualizer/flow";
import type { ThemeColors } from "@/lib/visualizer/theme";
import type { NodeStatus } from "@/lib/visualizer/types";

/** A request travelling along the connection `pathId`, behaving by the statuses at both ends (see flowFor). */
export function TrafficDot({
  pathId,
  begin,
  from,
  to,
  colors,
  exportable = false,
}: {
  pathId: string;
  begin: number;
  from: NodeStatus;
  to: NodeStatus;
  colors: Pick<ThemeColors, "ink" | "bg">;
  exportable?: boolean;
}) {
  const flow = flowFor(from, to);
  if (!flow) return null;
  const dur = `${flow.dur}s`;
  const b = `${begin}s`;
  const drop = flow.kind === "drop";

  return (
    <circle
      key={`${flow.kind}-${flow.dur}`}
      r="4.5"
      opacity="0"
      className={`map-pulse ${exportable ? "" : "no-export"}`}
      style={{ fill: colors.ink, stroke: colors.bg, strokeWidth: 2, pointerEvents: "none" }}
    >
      {drop ? (
        // fades out at 72% of the way along (keyTimes must span 0..1), before reaching the down component
        <>
          <animate attributeName="opacity" values="0;1;1;0" keyTimes="0;0.07;0.88;1" dur={dur} begin={b} repeatCount="indefinite" />
          <animateMotion dur={dur} begin={b} repeatCount="indefinite" calcMode="linear" keyPoints="0;0.72" keyTimes="0;1">
            <mpath href={`#${pathId}`} />
          </animateMotion>
        </>
      ) : (
        <>
          <set attributeName="opacity" to="1" begin={b} fill="freeze" />
          <animateMotion dur={dur} begin={b} repeatCount="indefinite">
            <mpath href={`#${pathId}`} />
          </animateMotion>
        </>
      )}
    </circle>
  );
}
