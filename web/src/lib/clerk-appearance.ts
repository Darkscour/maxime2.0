const sharedAppearance = {
  layout: {
    unsafe_disableDevelopmentModeWarnings: true,
    socialButtonsPlacement: "top" as const,
    socialButtonsVariant: "blockButton" as const,
  },
  variables: {
    colorPrimary: "#0c0c0e",
    colorBackground: "transparent",
    colorText: "#0c0c0e",
    colorTextSecondary: "#5a5d66",
    colorInputBackground: "#ececef",
    colorInputText: "#0c0c0e",
    colorNeutral: "#0c0c0e",
    borderRadius: "0px",
    spacingUnit: "0.9rem",
  },
  elements: {
    modalBackdrop: "bg-[rgba(12,12,14,0.45)]",
    modalContent:
      "bg-[var(--surface)] border border-[var(--border)] shadow-none text-[var(--foreground)] rounded-none",
    rootBox: "w-full max-w-none shadow-none",
    cardBox: "w-full max-w-none overflow-visible shadow-none bg-transparent border-0 p-0",
    card: "w-full max-w-none overflow-visible bg-transparent border-0 shadow-none text-[var(--foreground)] rounded-none gap-4 p-0",
    main: "gap-4 overflow-visible p-0",
    scrollBox: "overflow-visible max-h-none",
    headerTitle: "text-[var(--foreground)] font-medium tracking-tight",
    headerSubtitle: "text-[var(--foreground-muted)]",
    socialButtons: "gap-2.5",
    socialButtonsBlockButton:
      "h-11 border border-[var(--border)] bg-[var(--background)] text-[var(--foreground)] shadow-none transition-colors hover:border-[var(--foreground)] hover:bg-[var(--surface)] rounded-none",
    socialButtonsBlockButtonText: "text-[var(--foreground)] text-sm font-medium",
    dividerRow: "my-1",
    dividerLine: "bg-[var(--border)]",
    dividerText: "text-xs text-[var(--foreground-muted)]",
    formFieldLabel: "text-sm font-medium text-[var(--foreground)]",
    formFieldInput:
      "h-11 rounded-none border border-[var(--border)] bg-[var(--background)] px-3.5 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] shadow-none focus:border-[var(--foreground)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--foreground)_8%,transparent)]",
    formFieldInputShowPasswordButton: "text-[var(--foreground-muted)]",
    identityPreviewText: "text-[var(--foreground)]",
    identityPreviewEditButton: "text-[var(--accent)]",
    formButtonPrimary:
      "h-11 bg-[var(--foreground)] text-[var(--background)] shadow-none hover:bg-[var(--accent)] hover:text-[var(--accent-ink)] font-medium rounded-none transition-colors",
    formButtonReset: "text-[var(--foreground-muted)] hover:text-[var(--foreground)]",
    alternativeMethodsBlockButton:
      "h-11 text-[var(--foreground)] border border-[var(--border)] bg-[var(--background)] hover:border-[var(--foreground)] hover:bg-[var(--surface)] rounded-none",
    otpCodeFieldInput:
      "text-[var(--foreground)] border-[var(--border)] bg-[var(--background)] rounded-none",
    formResendCodeLink: "text-[var(--accent)]",
    navbarButton: "text-[var(--foreground)]",
    profileSectionTitleText: "text-[var(--foreground)]",
    profileSectionContent: "text-[var(--foreground-muted)]",
    accordionTriggerButton: "text-[var(--foreground)]",
    badge: "text-[var(--foreground)]",
    formFieldHintText__optional: "hidden",
    footer: "!hidden",
    footerPages: "!hidden",
    footerAction: "!hidden",
    footerActionText: "!hidden",
    footerActionLink: "!hidden",
    footerPagesLink: "!hidden",
  },
};

export const clerkAuthAppearance = sharedAppearance;
