import { Outlet } from 'react-router-dom'
import Navbar  from './Navbar'
import Footer  from './Footer'
import LabTube from '../ui/LabTube'

export default function RootLayout() {
  return (
    <>
      <Navbar />
      <LabTube />
      <Outlet />
      <Footer />
    </>
  )
}
