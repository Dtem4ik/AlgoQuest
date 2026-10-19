/** Высота отрезка тропинки между кружками, px. */
export const TRAIL_HEIGHT = 44;
const WIDTH = 240;

interface PathTrailProps {
  /** Горизонтальные сдвиги верхнего и нижнего кружка, px. */
  from: number;
  to: number;
  /** Пройденный отрезок закрашивается цветом острова. */
  walked: boolean;
  color: string;
}

/** Отрезок тропинки между двумя уроками: плавная S-кривая от кружка к кружку. */
export function PathTrail({ from, to, walked, color }: PathTrailProps) {
  const x1 = WIDTH / 2 + from;
  const x2 = WIDTH / 2 + to;
  const mid = TRAIL_HEIGHT / 2;

  return (
    <svg
      aria-hidden
      width={WIDTH}
      height={TRAIL_HEIGHT}
      viewBox={`0 0 ${WIDTH} ${TRAIL_HEIGHT}`}
      className="pointer-events-none block overflow-visible"
    >
      <path
        d={`M ${x1} -6 C ${x1} ${mid}, ${x2} ${mid}, ${x2} ${TRAIL_HEIGHT + 6}`}
        fill="none"
        strokeWidth={walked ? 8 : 6}
        strokeLinecap="round"
        strokeDasharray={walked ? undefined : "1 14"}
        style={{ stroke: walked ? color : "var(--disabled-ink)", opacity: walked ? 0.45 : 0.5 }}
      />
    </svg>
  );
}
