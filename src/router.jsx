import { createBrowserRouter } from 'react-router-dom'
import RootLayout   from './components/layout/RootLayout'
import Home         from './pages/Home'
import AboutPage    from './pages/AboutPage'
import ServicesPage from './pages/ServicesPage'
import PortfolioPage     from './pages/PortfolioPage'
import CaseStudiesPage   from './pages/CaseStudiesPage'
import CaseStudyDetail   from './pages/CaseStudyDetail'
import IndustriesPage    from './pages/IndustriesPage'
import NotFound     from './pages/NotFound'

const router = createBrowserRouter([
  {
    path:    '/',
    element: <RootLayout />,
    children: [
      { index: true,          element: <Home /> },
      { path: 'about',        element: <AboutPage /> },
      { path: 'services',     element: <ServicesPage /> },
      { path: 'portfolio',    element: <PortfolioPage /> },
      { path: 'case-studies',        element: <CaseStudiesPage /> },
      { path: 'case-studies/:slug',  element: <CaseStudyDetail /> },
      { path: 'industries',    element: <IndustriesPage /> },
      { path: '*',            element: <NotFound /> },
    ],
  },
])

export default router
