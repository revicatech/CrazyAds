import { Link } from 'react-router-dom'
import { useLang } from '../../context/LanguageContext'
import { t } from '../../services/i18n'
import { useRevealOnScroll } from '../../hooks/useRevealOnScroll'
import useFetch from '../../hooks/useFetch'
import { fetchCaseStudies } from '../../services/api'
import { CASE_STUDIES as CASE_STUDIES_STATIC } from '../../data/caseStudies'
import '../cssComponents/CaseStudies.css'

const METRIC_LABEL_KEYS = {
  'Brand Recall': 'case_metric_brand_recall',
  'Impressions': 'case_metric_impressions',
  'App Downloads': 'case_metric_app_downloads',
  'Lead Generation': 'case_metric_lead_gen',
  'Views (Digital)': 'case_metric_views',
  'Shortlisted': 'case_metric_shortlisted',
  'Franchise Inquiries': 'case_metric_franchise',
  'Trending Lebanon': 'case_metric_trending',
  'Media Coverage': 'case_metric_media',
}

function CaseRow({ item, lang }) {
  const { ref, isVisible } = useRevealOnScroll(0.1)

  return (
    <Link to={`/case-studies/${item.slug}`} ref={ref} className={`case-row cs-reveal-up${isVisible ? ' in' : ''}`} style={{ textDecoration: 'none', color: 'inherit' }}>
      <div className="case-image">
        <img src={item.image} alt={item.title} />
      </div>
      <div className="case-content">
        <div className="case-tag">{t(`case_tag_${item.id}`, lang)}</div>
        <h3 className="case-title">{item.title}</h3>
        <p className="case-desc">{t(`case_desc_${item.id}`, lang)}</p>
        <div className="case-metrics">
          {item.metrics.map(m => (
            <div key={m.label}>
              <div className="metric-num">{m.num}</div>
              <div className="metric-label">{t(METRIC_LABEL_KEYS[m.label] || m.label, lang)}</div>
            </div>
          ))}
        </div>
      </div>
    </Link>
  )
}

export default function CaseStudies() {
  const { lang } = useLang()
  const { ref: headerRef, isVisible: headerVisible } = useRevealOnScroll(0.1)
  const { data: CASE_STUDIES } = useFetch(fetchCaseStudies, CASE_STUDIES_STATIC)

  return (
    <section className="case-studies-section" id="cases">
      <div
        ref={headerRef}
        className={`case-header-row cs-reveal-up${headerVisible ? ' in' : ''}`}
      >
        <div className="cs-section-label">{t('cs_section_label', lang)}</div>
        <h2 className="cs-portfolio-title">{t('cs_section_title_1', lang)}<br />{t('cs_section_title_2', lang)}</h2>
      </div>

      {CASE_STUDIES.map(item => (
        <CaseRow key={item._id} item={item} lang={lang} />
      ))}
    </section>
  )
}
