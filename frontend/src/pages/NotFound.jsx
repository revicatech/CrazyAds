import { Link } from 'react-router-dom'
import { useLang } from '../context/LanguageContext'
import { t } from '../services/i18n'

export default function NotFound() {
  const { lang } = useLang()

  return (
    <main className="min-h-screen flex flex-col items-center justify-center gap-4">
      <h1 className="font-display text-8xl text-brand-red">404</h1>
      <p className="text-xl">{t('notfound_title', lang)}</p>
      <Link to="/" className="underline text-brand-red">{t('notfound_link', lang)}</Link>
    </main>
  )
}
