const sharedAppearance = {
  variables: {
    colorPrimary: "#22d3ee",
    colorBackground: "#11141b",
    colorText: "#e6e8ee",
    colorTextSecondary: "#a1a1aa",
    colorInputBackground: "#0d0f14",
    colorInputText: "#e6e8ee",
    colorNeutral: "#e6e8ee",
    borderRadius: "0.75rem",
  },
  elements: {
    modalBackdrop: "bg-black/70",
    modalContent: "bg-[#11141b] border border-white/5 shadow-2xl text-zinc-100",
    card: "bg-[var(--surface)] border border-white/5 shadow-2xl text-zinc-100",
    headerTitle: "text-white",
    headerSubtitle: "text-zinc-400",
    socialButtonsBlockButton:
      "border border-white/10 hover:bg-white/5 text-zinc-100 bg-transparent",
    socialButtonsBlockButtonText: "text-zinc-100 font-medium",
    dividerLine: "bg-white/10",
    dividerText: "text-zinc-500",
    formFieldLabel: "text-sm font-medium text-zinc-200",
    formFieldInput:
      "rounded-xl border border-white/[0.1] bg-[#0a0c10] px-4 py-3 text-sm text-zinc-100 shadow-inner shadow-black/20 placeholder:text-zinc-600 focus:border-cyan-400/40 focus:ring-2 focus:ring-cyan-400/15",
    formFieldInputShowPasswordButton: "text-zinc-400",
    identityPreviewText: "text-zinc-100",
    identityPreviewEditButton: "text-cyan-400",
    formButtonPrimary:
      "bg-cyan-400 hover:bg-cyan-300 text-zinc-950 font-medium",
    formButtonReset: "text-zinc-300 hover:text-white",
    footerActionText: "text-zinc-400",
    footerActionLink: "text-cyan-400 hover:text-cyan-300",
    alternativeMethodsBlockButton: "text-zinc-100 border-white/10 hover:bg-white/5",
    otpCodeFieldInput: "text-zinc-100 border-white/10 bg-[#0d0f14]",
    formResendCodeLink: "text-cyan-400",
    navbarButton: "text-zinc-100",
    profileSectionTitleText: "text-zinc-100",
    profileSectionContent: "text-zinc-300",
    accordionTriggerButton: "text-zinc-100",
    badge: "text-zinc-100",
    formFieldHintText: "hidden",
    formFieldHintText__optional: "hidden",
  },
};

export const clerkAuthAppearance = sharedAppearance;
