interface CustomerAvatarProps {
  avatarId?: number;
  className?: string;
  label?: string;
}

const positions = [
  [0, 0],
  [33.333, 0],
  [66.667, 0],
  [100, 0],
  [0, 50],
  [33.333, 50],
  [66.667, 50],
  [100, 50],
  [0, 100],
  [33.333, 100],
  [66.667, 100],
  [100, 100],
];

export function CustomerAvatar({
  avatarId = 0,
  className = "",
  label = "Customer avatar",
}: CustomerAvatarProps) {
  const safeId = Math.max(0, Math.min(11, avatarId));
  const [x, y] = positions[safeId];
  return (
    <span
      role="img"
      aria-label={label}
      className={`block shrink-0 rounded-full bg-white bg-no-repeat ${className}`}
      style={{
        backgroundImage: "url('/moneyflow-avatar-set.png')",
        backgroundSize: "400% 300%",
        backgroundPosition: `${x}% ${y}%`,
      }}
    />
  );
}
