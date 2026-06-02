import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CatalogPage from '../features/catalog/pages/CatalogPage'
import CartPage from '../features/checkout/pages/CartPage'
import CheckoutPage from '../features/checkout/pages/CheckoutPage';
import OrdersPage from '../features/orders/pages/OrdersPage';
import OrderDetailPage from '../features/orders/pages/OrderDetailPage';
import LoginPage from '../features/login/pages/LoginPage';
import RegisterPage from '../features/login/pages/RegisterPage';

import Navbar from '../shared/components/navbar'
import Footer from '../shared/components/Footer'

export default function Router() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="flex-grow flex flex-col w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-lg">
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/cart" element={<CartPage />} />
          {/* //TODO : Feature pendiente - Las rutas /checkout y /mis-pedidos están sin protección de autenticación porque el store todavía no tiene su AuthStore implementado. Está planificado agregarlo. Mientras tanto, el backend expone endpoints `/pedidos/publico` para que el store funcione en modo MVP. */}
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/mis-pedidos" element={<OrdersPage />} />
          <Route path="/pedidos/:id" element={<OrderDetailPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}