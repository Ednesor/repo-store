import { BrowserRouter, Routes, Route } from 'react-router-dom'
import CatalogPage from '../features/catalog/pages/CatalogPage'
import ProductDetailPage from '../features/catalog/pages/ProductDetailPage'
import CartPage from '../features/checkout/pages/CartPage'

export default function Router() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<CatalogPage />} />
        <Route path="/product/:id" element={<ProductDetailPage />} />
        <Route path="/cart" element={<CartPage />} />
      </Routes>
    </BrowserRouter>
  )
}