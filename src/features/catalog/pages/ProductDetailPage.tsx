import { useParams } from 'react-router-dom'

export default function ProductDetailPage() {
  const { id } = useParams()

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold">Detalle del Producto</h1>
      <p className="mt-2 text-gray-600">Producto ID: {id}</p>
    </div>
  )
}