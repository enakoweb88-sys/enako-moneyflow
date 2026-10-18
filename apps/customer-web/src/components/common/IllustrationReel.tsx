interface IllustrationReelProps {
  source: string;
  animated?: boolean;
  frame?: number;
  className?: string;
  label: string;
}

const positions = ["0% 0%", "100% 0%", "0% 100%", "100% 100%"];

export const IllustrationReel = ({
  source,
  animated = false,
  frame = 0,
  className = "",
  label,
}: IllustrationReelProps) => (
  <div
    className={`illustration-reel ${className}`}
    role="img"
    aria-label={label}
  >
    {(animated ? positions : [positions[frame] ?? positions[0]]).map(
      (position, index) => (
        <span
          key={`${position}-${index}`}
          className={animated ? "illustration-reel-frame" : ""}
          style={{
            backgroundImage: `url('${source}')`,
            backgroundPosition: position,
            animationDelay: animated ? `${index * 1.15}s` : undefined,
          }}
        />
      ),
    )}
  </div>
);
