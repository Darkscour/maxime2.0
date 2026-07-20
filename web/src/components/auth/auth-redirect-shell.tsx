/** Quiet placeholder while auth/session routing completes. */
export function AuthRedirectShell() {
  return (
    <div
      className="flex flex-1 items-center justify-center py-16"
      aria-busy="true"
      aria-label="Loading"
    >
      <span className="auth-redirect-pulse h-1.5 w-1.5 rounded-full bg-[var(--foreground-muted)]" />
    </div>
  );
}
