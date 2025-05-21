// Updated AllProducts.jsx
import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";

function AllProducts() {
  const [products, setProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  

  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true)
        const response = await fetch(`${API_BASE_URL}/api/all-products`)
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

  if (loading) {
    return (
      <div className="p-8 flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-[#885B3A]"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error}
        </div>
      </div>
    );
  }
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