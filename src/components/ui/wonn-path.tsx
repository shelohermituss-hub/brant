export type WonnMemberStatus = "paid" | "wait" | "late" | "upcoming";

export interface WonnMember {
  position: number;
  status: WonnMemberStatus;
}

interface WonnPathProps {
  members: WonnMember[];
  beneficiaryPosition: number;
  potAmount: string;
  beneficiaryName: string;
}

const STATUS_FILL: Record<WonnMemberStatus, string> = {
  paid: "var(--color-paid)",
  wait: "var(--color-wait)",
  late: "var(--color-late)",
  upcoming: "var(--color-gray-300)",
};

const COLS = 4;
const WIDTH = 320;
const MARGIN_X = 36;
const MARGIN_Y = 30;
const ROW_HEIGHT = 80;
const NODE_R = 17;

const round = (n: number) => Math.round(n * 100) / 100;

interface Point {
  x: number;
  y: number;
}

function getPoints(count: number): Point[] {
  const colSpacing = COLS > 1 ? (WIDTH - MARGIN_X * 2) / (COLS - 1) : 0;

  return Array.from({ length: count }, (_, i) => {
    const row = Math.floor(i / COLS);
    const reversed = row % 2 === 1;
    let colInRow = i % COLS;
    if (reversed) colInRow = COLS - 1 - colInRow;

    return {
      x: round(MARGIN_X + colInRow * colSpacing),
      y: round(MARGIN_Y + row * ROW_HEIGHT),
    };
  });
}

function toPathData(points: Point[]) {
  return points.map((p, i) => `${i === 0 ? "M" : "L"} ${p.x},${p.y}`).join(" ");
}

/**
 * Route serpentine du wonn : chaque nœud = une main (le tour d'un membre),
 * reliés par une ligne — verte pour le trajet déjà parcouru, grise en
 * pointillé pour ce qui reste. Remplace l'ancien cercle SVG (voir
 * DESIGN.md §5) — même API (members/beneficiaryPosition/potAmount/
 * beneficiaryName), forme différente.
 */
export function WonnPath({ members, beneficiaryPosition, potAmount, beneficiaryName }: WonnPathProps) {
  const points = getPoints(members.length);
  const rows = Math.ceil(members.length / COLS);
  const height = MARGIN_Y * 2 + (rows - 1) * ROW_HEIGHT;

  const beneficiaryIndex = members.findIndex((m) => m.position === beneficiaryPosition);
  const traveled = beneficiaryIndex >= 0 ? points.slice(0, beneficiaryIndex + 1) : [];
  const remaining = beneficiaryIndex >= 0 ? points.slice(beneficiaryIndex) : points;

  return (
    <div className="flex flex-col items-center gap-3 px-4">
      <div className="flex flex-col items-center gap-0.5 text-center">
        <p className="text-[1.6rem] leading-none font-bold text-ink">{potAmount}</p>
        <p className="text-[0.9rem] text-ink-secondary">{beneficiaryName}</p>
      </div>

      <svg viewBox={`0 0 ${WIDTH} ${height}`} className="w-full max-w-[360px]" aria-hidden="true">
        {remaining.length > 1 && (
          <path
            d={toPathData(remaining)}
            fill="none"
            stroke="var(--color-border-strong)"
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeDasharray="1 10"
          />
        )}
        {traveled.length > 1 && (
          <path
            d={toPathData(traveled)}
            fill="none"
            stroke="var(--color-green)"
            strokeWidth={4}
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        )}

        {members.map(({ position, status }, i) => {
          const { x, y } = points[i];
          const isBeneficiary = position === beneficiaryPosition;
          const isFirst = i === 0;
          const isLast = i === members.length - 1;

          return (
            <g key={position}>
              {isBeneficiary && (
                <circle cx={x} cy={y} r={NODE_R + 9} fill="var(--color-soley)" opacity={0.3} />
              )}
              <circle
                cx={x}
                cy={y}
                r={isBeneficiary ? NODE_R + 3 : NODE_R}
                fill={isBeneficiary ? "var(--color-soley)" : STATUS_FILL[status]}
                stroke="var(--color-surface)"
                strokeWidth={3}
              />
              <text
                x={x}
                y={y}
                textAnchor="middle"
                dominantBaseline="central"
                fontSize={12}
                fontWeight={700}
                fill="white"
              >
                {position}
              </text>
              {isFirst && (
                <text
                  x={x}
                  y={y + NODE_R + 15}
                  textAnchor="middle"
                  fontSize={9}
                  fontWeight={600}
                  fill="var(--color-ink-secondary)"
                >
                  Kòmanse
                </text>
              )}
              {isLast && (
                <text
                  x={x}
                  y={y + NODE_R + 15}
                  textAnchor="middle"
                  fontSize={9}
                  fontWeight={600}
                  fill="var(--color-ink-secondary)"
                >
                  Fini
                </text>
              )}
            </g>
          );
        })}
      </svg>
    </div>
  );
}
