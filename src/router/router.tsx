import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CatalogPage from '../features/catalog/pages/CatalogPage'
import CartPage from '../features/checkout/pages/CartPage'
import CheckoutPage from '../features/checkout/pages/CheckoutPage';
import OrdersPage from '../features/orders/pages/OrdersPage';
import OrderDetailPage from '../features/orders/pages/OrderDetailPage';
import LoginPage from '../features/login/pages/LoginPage';
import RegisterPage from '../features/login/pages/RegisterPage';
import ProtectedRoute from './components/ProtectedRoute';
import ProfilePage from '../features/user/pages/ProfilePage';
import PaymentPage from '../features/checkout/pages/PaymentPage';
import PaymentFeedbackPage from '../features/checkout/pages/PaymentFeedbackPage';

import Navbar from '../shared/components/navbar'
import Footer from '../shared/components/Footer'

export default function Router() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="flex-grow flex flex-col w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-lg">
        <Routes>

          {/* Rutas Públicas */}
          <Route path="/" element={<CatalogPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />

          {/* Rutas Privadas */}
          <Route element={<ProtectedRoute />}>
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/payment/:id" element={<PaymentPage />} />
            <Route path="/payment/feedback/:id" element={<PaymentFeedbackPage />} />
            <Route path="/mis-pedidos" element={<OrdersPage />} />
            <Route path="/pedidos/:id" element={<OrderDetailPage />} />
            <Route path="/perfil" element={<ProfilePage />} />
          </Route>

        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}