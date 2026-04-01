/**
 * Single source for contact, footer, resume, and PDF copy.
 * Override LinkedIn via `VITE_LINKEDIN_URL` in `.env`.
 */
const linkedinFromEnv =
  typeof import.meta.env.VITE_LINKEDIN_URL === "string"
    ? import.meta.env.VITE_LINKEDIN_URL.trim()
    : "";

export const CONTACT_PROFILE = {
  fullName: "Yoseph Bedasa",
  shortName: "Yoseph",
  headline: "Full-stack web developer & network engineer",
  tagline:
    "I build fast, accessible web apps (React, TypeScript, Firebase) and care about clear architecture, performance, and reliable delivery.",
  email: "yosephbedasa85@gmail.com",
  location: "Open to remote opportunities",
  github: {
    url: "https://github.com/JOYE2146",
    handle: "JOYE2146",
  },
  telegram: {
    url: "https://t.me/Jomanth",
    handle: "@Jomanth",
  },
  linkedin: {
    url: linkedinFromEnv || "https://www.linkedin.com/in/yoseph-bedasa",
    /** Update env or this fallback to your real profile URL */
    label: "LinkedIn",
  },
  resumePdfFileName: "Yoseph-Bedasa-Resume.pdf",
} as const;

export type SocialLink = {
  id: string;
  label: string;
  href: string;
  description: string;
};

export const SOCIAL_LINKS: SocialLink[] = [
  {
    id: "github",
    label: "GitHub",
    href: CONTACT_PROFILE.github.url,
    description: `Code and projects · ${CONTACT_PROFILE.github.handle}`,
  },
  {
    id: "linkedin",
    label: CONTACT_PROFILE.linkedin.label,
    href: CONTACT_PROFILE.linkedin.url,
    description: "Professional background & recommendations",
  },
  {
    id: "telegram",
    label: "Telegram",
    href: CONTACT_PROFILE.telegram.url,
    description: `Quick messages · ${CONTACT_PROFILE.telegram.handle}`,
  },
  {
    id: "email",
    label: "Email",
    href: `mailto:${CONTACT_PROFILE.email}`,
    description: CONTACT_PROFILE.email,
  },
];

export function isEmailJsConfigured(): boolean {
  return Boolean(
    import.meta.env.VITE_EMAILJS_SERVICE_ID?.trim() &&
      import.meta.env.VITE_EMAILJS_TEMPLATE_ID?.trim() &&
      import.meta.env.VITE_EMAILJS_PUBLIC_KEY?.trim()
  );
}
