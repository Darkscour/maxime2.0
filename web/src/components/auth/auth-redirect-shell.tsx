/** Silent placeholder while auth/session routing completes — no user-facing copy. */
export function AuthRedirectShell() {
  return (
    <div
      className="flex flex-1"
      aria-busy="true"
      aria-label="Loading"
    />
  );
}
