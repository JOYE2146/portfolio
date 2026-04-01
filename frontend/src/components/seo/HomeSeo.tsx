import { CONTACT_PROFILE } from "@/data/contact-profile";
import { SITE_DEFAULT_DESCRIPTION, SITE_TITLE_SUFFIX } from "@/data/site-seo";
import { absoluteUrl } from "@/lib/site-url";
import { PageSeo } from "@/components/seo/PageSeo";

export function HomeSeo() {
  const title = `${CONTACT_PROFILE.fullName} · ${CONTACT_PROFILE.headline}`;
  const origin = absoluteUrl("/");

  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: CONTACT_PROFILE.fullName,
    jobTitle: CONTACT_PROFILE.headline,
    email: CONTACT_PROFILE.email,
    url: origin,
    sameAs: [
      CONTACT_PROFILE.github.url,
      CONTACT_PROFILE.linkedin.url,
      CONTACT_PROFILE.telegram.url,
    ],
    knowsAbout: [
      "React",
      "TypeScript",
      "Firebase",
      "Web development",
      "Computer networking",
    ],
  };

  const websiteLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: `${SITE_TITLE_SUFFIX} — Portfolio`,
    url: origin,
    description: SITE_DEFAULT_DESCRIPTION,
    author: { "@type": "Person", name: CONTACT_PROFILE.fullName },
  };

  const professionalLd = {
    "@context": "https://schema.org",
    "@type": "ProfessionalService",
    name: `${CONTACT_PROFILE.fullName} — Software & network engineering`,
    url: origin,
    description: SITE_DEFAULT_DESCRIPTION,
    areaServed: "Worldwide",
    availableLanguage: ["English"],
  };

  return (
    <PageSeo
      title={title}
      description={SITE_DEFAULT_DESCRIPTION}
      path="/"
      ogType="website"
      jsonLd={[personLd, websiteLd, professionalLd]}
    />
  );
}
