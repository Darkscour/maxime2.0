import type { ReactNode } from "react";
import { cn } from "@/lib/utils";

type ProfileAvatarProps = {
  src?: string | null;
  alt?: string;
  /** Shown when `src` is empty — usually a letter or icon. */
  fallback?: ReactNode;
  size?: number;
  className?: string;
  imgClassName?: string;
};

/**
 * Circular profile crop. Any aspect-ratio photo fills the circle via object-fit: cover.
 */
export function ProfileAvatar({
  src,
  alt = "",
  fallback,
  size = 40,
  className,
  imgClassName,
}: ProfileAvatarProps) {
  return (
    <span
      className={cn("profile-avatar", className)}
      style={{ width: size, height: size }}
    >
      {src ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={src} alt={alt} className={imgClassName} />
      ) : (
        fallback
      )}
    </span>
  );
}
