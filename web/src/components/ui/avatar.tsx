/**
 * Procedural gradient avatar used in the recruitment portal.
 * Avoids needing real player images for the demo. Each player's `avatarHue`
 * is just a number 0–360 that picks a unique hue.
 */
export function GradientAvatar({
  hue,
  label,
  size = 48,
}: {
  hue: number;
  label: string;
  size?: number;
}) {
  const initials = label
    .replace(/[^a-zA-Z0-9]/g, "")
    .slice(0, 2)
    .toUpperCase();
  return (
    <div
      className="flex shrink-0 items-center justify-center rounded-full font-semibold text-zinc-950"
      style={{
        width: size,
        height: size,
        background: `linear-gradient(135deg, hsl(${hue} 90% 65%) 0%, hsl(${(hue + 60) % 360} 90% 55%) 100%)`,
        fontSize: size * 0.35,
      }}
      aria-label={label}
    >
      {initials}
    </div>
  );
}
