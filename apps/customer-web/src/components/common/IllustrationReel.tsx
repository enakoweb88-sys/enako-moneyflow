import Image from "next/image";

interface IllustrationReelProps {
  source: string;
  animated?: boolean;
  frame?: number;
  className?: string;
  label: string;
}

const positions = [
  { left: "0", top: "0" },
  { left: "-100%", top: "0" },
  { left: "0", top: "-100%" },
  { left: "-100%", top: "-100%" },
];

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
          key={index}
          className={animated ? "illustration-reel-frame" : ""}
          style={{
            animationDelay: animated ? `${index * 1.15}s` : undefined,
          }}
        >
          {/* A real image element is used instead of a CSS background so the
              transparent artwork remains reliable in optimized builds. */}
          <Image
            src={source}
            alt=""
            aria-hidden="true"
            width={1254}
            height={1254}
            priority={animated}
            style={position}
          />
        </span>
      ),
    )}
  </div>
);
