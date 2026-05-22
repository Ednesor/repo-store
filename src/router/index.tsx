import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CatalogPage from '../features/catalog/pages/CatalogPage'
import ProductDetailPage from '../features/catalog/pages/ProductDetailPage'
import CartPage from '../features/checkout/pages/CartPage'
import CheckoutPage from '../features/checkout/pages/CheckoutPage';
import OrdersPage from '../features/orders/pages/OrdersPage';

import Navbar from '../shared/components/navbar'
import Footer from '../shared/components/Footer'

export default function Router() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="flex-grow flex flex-col w-full max-w-7xl mx-auto px-margin-mobile md:px-margin-desktop py-lg">
        <Routes>
          <Route path="/" element={<CatalogPage />} />
          <Route path="/product/:id" element={<ProductDetailPage />} />
          <Route path="/cart" element={<CartPage />} />
          <Route path="/checkout" element={<CheckoutPage />} />
          <Route path="/mis-pedidos" element={<OrdersPage />} />
        </Routes>
      </main>
      <Footer />
    </BrowserRouter>
  )
}