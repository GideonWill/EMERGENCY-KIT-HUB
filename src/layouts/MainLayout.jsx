import { Outlet, useLocation } from 'react-router-dom'
import AnnouncementBar from '../components/AnnouncementBar'
import DemoModeBanner from '../components/DemoModeBanner'
import EmergencyDisclaimerBar from '../components/EmergencyDisclaimerBar'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'

export default function MainLayout() {
  const location = useLocation()
  const pageKey = `${location.pathname}${location.search}`

  return (
    <div className="flex min-h-screen flex-col">
      <AnnouncementBar />
      <DemoModeBanner />
      <Navbar />
      <main className="flex-1">
        <div key={pageKey} className="page-transition-enter">
          <Outlet />
        </div>
      </main>
      <EmergencyDisclaimerBar />
      <Footer />
    </div>
  )
}
