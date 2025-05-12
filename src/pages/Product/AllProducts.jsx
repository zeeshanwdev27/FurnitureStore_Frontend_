import React, { useEffect, useState } from 'react'
import { useNavigate } from "react-router-dom";

function AllProducts() {

  const [products, setProducts] = useState([])

  const navigate = useNavigate();

  useEffect(()=>{
    fetch("http://localhost:3000/api/all-products")
    .then((data)=> data.json())
    .then((data)=> setProducts(data))
    .catch((err)=> console.log(err))
  },[])

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className='lg:px-35 py-4 px-10'>
      <h1 className='font-bold text-xl'>All Products</h1>
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-6">
    {products.map((product) => (

      <div key={product._id} onClick={()=> handleProductClick(product._id)} className="bg-white p-4 shadow rounded transition-transform duration-300 hover:shadow-lg hover:scale-105 hover:cursor-pointer">
        <img
          src={product.image?.url}
          alt={product.name}
          className="w-full h-48 object-cover mb-2 sm:h-36 md:h-48 lg:h-48"
        />
        <p className="text-sm text-gray-500">{product.category}</p>
        <p className="font-bold lg:text-lg sm:text-sm md:text-sm">{product.name}</p>
        <div className="text-[#885B3A]">★ ★ ★ ★ ☆</div>
        <p className="text-black font-semibold">${product.price}</p>
      </div>

    ))}
  </div>
  </div>

  )
}

export default AllProducts
