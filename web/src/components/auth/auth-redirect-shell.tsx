export function AuthRedirectShell({
  message = "Taking you to your account…",
}: {
  message?: string;
}) {
  return (
    <div className="flex flex-1 items-center justify-center py-24">
      <p className="text-sm text-zinc-500">{message}</p>
    </div>
  );
}
