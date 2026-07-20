import { cn } from "@/lib/utils";
import {
  navGroupAccentEyebrowClasses,
  type NavGroupAccent,
} from "@/lib/dashboard-nav";

export function DashboardSectionEyebrow({
  accent,
  children,
  className,
}: {
  accent: NavGroupAccent;
  children: React.ReactNode;
  className?: string;
}) {
  return (
    <p
      className={cn(
        "desk-kicker",
        navGroupAccentEyebrowClasses[accent],
        className,
      )}
    >
      {children}
    </p>
  );
}
