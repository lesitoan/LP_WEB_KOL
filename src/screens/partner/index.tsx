'use client'

import { partnerBenefits, partnerSteps, partnerTiers } from './constants'
import PartnerCtaSection from './components/PartnerCtaSection'
import PartnerHeader from './components/PartnerHeader'
import PartnerHero from './components/PartnerHero'
import PartnerStepsSection from './components/PartnerStepsSection'
import PartnerTierSection from './components/PartnerTierSection'
import PartnerToolsSection from './components/PartnerToolsSection'

export default function PartnerScreen() {
  return (
    <main className="min-h-screen overflow-hidden bg-black pt-12 max-md:pt-10 text-white space-y-20 max-md:space-y-16">
      <PartnerHeader />
      <PartnerHero tiers={partnerTiers} />
      <PartnerTierSection tiers={partnerTiers} />
      <PartnerStepsSection steps={partnerSteps} />
      <PartnerToolsSection benefits={partnerBenefits} />
      <PartnerCtaSection />
    </main>
  )
}
