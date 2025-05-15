// Updated AllProducts.jsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";

function AllProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch("http://localhost:3000/api/all-products")
        const data = await response.json()
        if (!response.ok) throw new Error(data.error || "Failed to fetch products")
        setProducts(data)
      } catch (err) {
        console.error("Fetch error:", err)
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchProducts()
  }, [])

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  if (loading) return <div className='lg:px-35 py-4 px-10'>Loading products...</div>
  if (error) return <div className='lg:px-35 py-4 px-10 text-red-500'>Error: {error}</div>
  if (!products.length) return <div className='lg:px-35 py-4 px-10'>No products found</div>

  return (
    <div className='lg:px-35 py-4 px-10'>
      <h1 className='font-bold text-xl'>All Products</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-6">
        {products.map((product) => (
          <div 
            key={product._id} 
            onClick={() => handleProductClick(product._id)} 
            className="bg-white p-4 shadow rounded transition-transform duration-300 hover:shadow-lg hover:scale-105 hover:cursor-pointer"
          >
            <img
              src={product.image?.url || 'https://via.placeholder.com/300'}
              alt={product.name}
              className="w-full h-48 object-cover mb-2 sm:h-36 md:h-48 lg:h-48"
              onError={(e) => {
                e.target.onerror = null
                e.target.src = 'https://via.placeholder.com/300'
              }}
            />
            <p className="text-sm text-gray-500">
              {product.category?.name || 'Uncategorized'}
            </p>
            <p className="font-bold lg:text-lg sm:text-sm md:text-sm">
              {product.name}
            </p>
            <div className="text-[#885B3A]">★ ★ ★ ★ ☆</div>
            <p className="text-black font-semibold">
              ${product.price?.toFixed(2) || '0.00'}
            </p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default AllProducts