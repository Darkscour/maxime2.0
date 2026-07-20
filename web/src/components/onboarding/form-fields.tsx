import { cn } from "@/lib/utils";
import { fieldClassName } from "@/lib/form-styles";

export function FormField({
  label,
  hint,
  children,
  className,
  required,
}: {
  label: string;
  hint?: string;
  children: React.ReactNode;
  className?: string;
  required?: boolean;
}) {
  return (
    <label className={cn("block", className)}>
      <span className="text-sm font-medium text-[var(--foreground)]">
        {label}
        {required && <span className="text-red-600"> *</span>}
      </span>
      {hint ? (
        <span className="mt-0.5 block text-xs text-[var(--foreground-muted)]">
          {hint}
        </span>
      ) : (
        <span className="mt-0.5 block min-h-4" aria-hidden />
      )}
      <div className="mt-2">{children}</div>
    </label>
  );
}

export function TextInput(props: React.InputHTMLAttributes<HTMLInputElement>) {
  return <input className={fieldClassName} {...props} />;
}

export function TextArea(props: React.TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea
      className={cn(fieldClassName, "min-h-[96px] resize-y")}
      {...props}
    />
  );
}

export function SelectInput(props: React.SelectHTMLAttributes<HTMLSelectElement>) {
  return <select className={fieldClassName} {...props} />;
}

export function FormError({ message }: { message?: string }) {
  if (!message) return null;
  return (
    <p className="rounded-none border border-red-600/30 bg-red-50 px-3 py-2 text-sm text-red-800">
      {message}
    </p>
  );
}

export function StepHeader({
  step,
  title,
  subtitle,
}: {
  step: string;
  title: string;
  subtitle: string;
}) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">
        {step}
      </p>
      <h1 className="font-heading mt-3 text-3xl font-semibold tracking-tight text-[var(--foreground)] sm:text-4xl">
        {title}
      </h1>
      <p className="mt-3 max-w-xl text-sm leading-7 text-[var(--foreground-muted)] sm:text-base">
        {subtitle}
      </p>
    </div>
  );
}
