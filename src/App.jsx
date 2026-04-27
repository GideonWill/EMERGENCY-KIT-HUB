import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetails from './pages/ProductDetails'
import About from './pages/About'
import Contact from './pages/Contact'
import Membership from './pages/Membership'
import Consultation from './pages/Consultation'
import SpiritualGuidance from './pages/SpiritualGuidance'
import WellnessHub from './pages/WellnessHub'
import Manual from './pages/Manual'
import Institutional from './pages/Institutional'
import Cart from './pages/Cart'
import CheckoutSuccess from './pages/CheckoutSuccess'
import Login from './pages/Login'
import Register from './pages/Register'
import Tracking from './pages/Tracking'
import NotFound from './pages/NotFound'
import AdminDashboard from './pages/AdminDashboard'
import ResetPassword from './pages/ResetPassword'

export default function App() {
  return (
    <Routes>
      <Route path="/admin/orders" element={<AdminDashboard />} />
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/membership" element={<Membership />} />
        <Route path="/consultation" element={<Consultation />} />
        <Route path="/wellness" element={<WellnessHub />} />
        <Route path="/manual" element={<Manual />} />
        <Route path="/spiritual-guidance" element={<SpiritualGuidance />} />
        <Route path="/institutional" element={<Institutional />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/checkout/success" element={<CheckoutSuccess />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/reset-password" element={<ResetPassword />} />
        <Route path="/tracking" element={<Tracking />} />
        <Route path="*" element={<NotFound />} />
      </Route>
    </Routes>
  )
}
