import ContentSection from '../components/ContentSection'
import Hero from '../components/Hero'

export default function About() {
  return (
    <>
      <Hero
        eyebrow="About Tobin Emergency Kit Hub"
        title="Science-minded wellness"
        titleAccent="for real life"
        subtitle="We are a demo company built to showcase a clean React + Tailwind storefront. Replace this narrative with your mission, credentials, and compliance story."
        primaryCta={{ to: '/shop', label: 'Browse products' }}
        secondaryCta={{ to: '/contact', label: 'Get in touch' }}
        image="https://images.unsplash.com/photo-1582719471384-894fbb16e074?w=1200&q=80"
        imageAlt="Modern clinic reception"
        reversed
      />

      <ContentSection
        eyebrow="Our approach"
        title="Evidence-informed, patient-first"
        body={
          <>
            <p>
              Content sections alternate imagery and copy so the page breathes — similar to long-form
              medical brand pages.
            </p>
            <p>
              Use this block for quality sourcing, lab testing, advisory boards, or manufacturing
              transparency.
            </p>
          </>
        }
        cta={{ to: '/membership', label: 'Membership benefits' }}
        image="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1000&q=80"
        imageAlt="Healthcare professional"
        imageLeft
      />

      <ContentSection
        eyebrow="Responsibility"
        title="Clear communication, always"
        body={
          <>
            <p>
              Disclaimer-style content often lives near the footer on reference sites. Here it is
              modeled as a dedicated section for readability.
            </p>
            <p>
              Nothing on this demo site constitutes medical advice. Always seek a qualified clinician
              for personal decisions.
            </p>
          </>
        }
        image="https://images.unsplash.com/photo-1526256262350-7da7584cf5a1?w=1000&q=80"
        imageAlt="Team collaboration"
        imageLeft={false}
        mutedBg
      />
    </>
  )
}
