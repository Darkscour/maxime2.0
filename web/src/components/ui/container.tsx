import { cn } from "@/lib/utils";

/**
 * <Container/> — caps content to a comfortable max width with side padding.
 * Use this around every section so layout stays consistent.
 */
export function Container({
  className,
  children,
}: {
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={cn("mx-auto w-full max-w-7xl px-6 lg:px-8", className)}>
      {children}
    </div>
  );
}
