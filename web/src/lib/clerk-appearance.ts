const sharedAppearance = {
  layout: {
    unsafe_disableDevelopmentModeWarnings: true,
  },
  variables: {
    colorPrimary: "#b84a1b",
    colorBackground: "#f7f7f8",
    colorText: "#0c0c0e",
    colorTextSecondary: "#5a5d66",
    colorInputBackground: "#ececef",
    colorInputText: "#0c0c0e",
    colorNeutral: "#0c0c0e",
    borderRadius: "0px",
  },
  elements: {
    modalBackdrop: "bg-[rgba(12,12,14,0.45)]",
    modalContent:
      "bg-[#f7f7f8] border border-[#c9ccd3] shadow-none text-[#0c0c0e] rounded-none",
    card: "bg-transparent border-0 shadow-none text-[var(--foreground)] rounded-none",
    headerTitle: "text-[var(--foreground)] font-medium tracking-tight",
    headerSubtitle: "text-[var(--foreground-muted)]",
    socialButtonsBlockButton:
      "border border-[var(--border)] hover:border-[var(--foreground)] hover:bg-[var(--background)] text-[var(--foreground)] bg-transparent rounded-none",
    socialButtonsBlockButtonText: "text-[var(--foreground)] font-medium",
    dividerLine: "bg-[var(--border)]",
    dividerText: "text-[var(--foreground-muted)]",
    formFieldLabel: "text-sm font-medium text-[var(--foreground)]",
    formFieldInput:
      "rounded-none border border-[var(--border)] bg-[var(--background)] px-4 py-3 text-sm text-[var(--foreground)] placeholder:text-[var(--foreground-subtle)] focus:border-[var(--accent)] focus:ring-2 focus:ring-[color-mix(in_srgb,var(--accent)_15%,transparent)]",
    formFieldInputShowPasswordButton: "text-[var(--foreground-muted)]",
    identityPreviewText: "text-[var(--foreground)]",
    identityPreviewEditButton: "text-[var(--accent)]",
    formButtonPrimary:
      "bg-[var(--foreground)] hover:bg-[var(--accent)] text-[var(--background)] hover:text-[var(--accent-ink)] font-medium rounded-none",
    formButtonReset: "text-[var(--foreground-muted)] hover:text-[var(--foreground)]",
    footerActionText: "text-[var(--foreground-muted)]",
    footerActionLink: "text-[var(--accent)] hover:text-[var(--accent-strong)]",
    alternativeMethodsBlockButton:
      "text-[var(--foreground)] border-[var(--border)] hover:bg-[var(--background)] rounded-none",
    otpCodeFieldInput:
      "text-[var(--foreground)] border-[var(--border)] bg-[var(--background)] rounded-none",
    formResendCodeLink: "text-[var(--accent)]",
    navbarButton: "text-[var(--foreground)]",
    profileSectionTitleText: "text-[var(--foreground)]",
    profileSectionContent: "text-[var(--foreground-muted)]",
    accordionTriggerButton: "text-[var(--foreground)]",
    badge: "text-[var(--foreground)]",
    formFieldHintText: "hidden",
    formFieldHintText__optional: "hidden",
    footer: "hidden",
    footerPages: "hidden",
    footerAction: "hidden",
  },
};

export const clerkAuthAppearance = sharedAppearance;
