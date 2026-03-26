import Hero          from '../components/sections/Hero'
import Taglines      from '../components/sections/Taglines'
import Services      from '../components/sections/Services'
import Portfolio     from '../components/sections/Portfolio'
import CaseStudies   from '../components/sections/CaseStudies'
import WhyUs         from '../components/sections/WhyUs'
import About         from '../components/sections/About'
import EinsteinOrbit from '../components/sections/EinsteinOrbit'
import Industries    from '../components/sections/Industries'
import Team          from '../components/sections/Team'
import Contact       from '../components/sections/Contact'

export default function Home() {
  return (
    <main>
      <Hero />
      {/* This wrapper sits above the fixed hero (z-index: 1 > hero's -10).
          Its white background acts as a curtain so the hero only shows
          through the transparent hero-clip area, not the rest of the page. */}
      <div className="relative z-[1] bg-white">
        <Taglines />
        <Services />
        <Portfolio />
        <CaseStudies />
        <WhyUs />
        <About />
        <EinsteinOrbit />
        {/* <Industries /> */}
        <Team />
        <Contact />
      </div>
    </main>
  )
}
