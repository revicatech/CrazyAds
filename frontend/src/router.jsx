import { createBrowserRouter } from 'react-router-dom'
import RootLayout   from './components/layout/RootLayout'
import Home         from './pages/Home'
import AboutPage    from './pages/AboutPage'
import ServicesPage from './pages/ServicesPage'
import PortfolioPage     from './pages/PortfolioPage'
import CaseStudiesPage   from './pages/CaseStudiesPage'
import CaseStudyDetail   from './pages/CaseStudyDetail'
import IndustriesPage    from './pages/IndustriesPage'
import EventsListPage   from './pages/EventsListPage'
import EventDetail      from './pages/EventDetail'
import NotFound     from './pages/NotFound'

// Admin
import AdminLayout              from './components/admin/AdminLayout'
import ProtectedRoute           from './components/admin/ProtectedRoute'
import LoginPage                from './pages/admin/LoginPage'
import LandingEditorPage        from './pages/admin/LandingEditorPage'
import AdminServicesPage        from './pages/admin/ServicesPage'
import AdminIndustriesPage      from './pages/admin/IndustriesPage'
import AdminPortfolioPage       from './pages/admin/PortfolioPage'
import AdminPortfolioCategoriesPage from './pages/admin/PortfolioCategoriesPage'
import AdminCaseStudiesPage     from './pages/admin/CaseStudiesPage'
import AdminCaseCategoriesPage  from './pages/admin/CaseCategoriesPage'
import AdminTeamPage            from './pages/admin/TeamPage'
import AdminWhyUsPage           from './pages/admin/WhyUsPage'
import AdminEventsPage          from './pages/admin/EventsPage'

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
      { path: 'events',            element: <EventsListPage /> },
      { path: 'events/:id',        element: <EventDetail /> },
      { path: '*',            element: <NotFound /> },
    ],
  },
  // Admin login (public)
  {
    path: '/admin/login',
    element: <LoginPage />,
  },
  // Admin panel (protected)
  {
    path: '/admin',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AdminLayout />,
        children: [
          { index: true,                    element: <LandingEditorPage /> },
          { path: 'services',               element: <AdminServicesPage /> },
          { path: 'industries',             element: <AdminIndustriesPage /> },
          { path: 'portfolio',              element: <AdminPortfolioPage /> },
          { path: 'portfolio-categories',   element: <AdminPortfolioCategoriesPage /> },
          { path: 'case-studies',           element: <AdminCaseStudiesPage /> },
          { path: 'case-categories',        element: <AdminCaseCategoriesPage /> },
          { path: 'team',                   element: <AdminTeamPage /> },
          { path: 'why-us',                 element: <AdminWhyUsPage /> },
          { path: 'events',                 element: <AdminEventsPage /> },
        ],
      },
    ],
  },
])

export default router
