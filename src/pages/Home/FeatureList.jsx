import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function FeatureList() {
  const [products, setProduct] = useState([]);
  const navigate = useNavigate()

  useEffect(() => {
    fetch("http://localhost:3000/api/products")
      .then((res) => res.json())
      .then((data) => setProduct(data.slice(0, 8)))
      .catch((err) => console.error("Error Fetching Products", err));
  }, []);

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="h-80vh bg-gray-100 lg:px-35 py-15">

      <div className="flex flex-col justify-center items-center gap-5 lg:px-0 px-6">
        <p className="lg:text-3xl text-2xl font-bold">FEATURED ITEMS</p>
        <ul className="flex justify-center items-center gap-5 font-medium px-4 lg:px-0 lg:text-md md:text-sm text-xs">
          <li className="hover:cursor-pointer hover:text-[#885B3A]">HOT ITEMS</li>
          <li className="hover:cursor-pointer hover:text-[#885B3A]">BEST SELLERS</li>
          <li className="hover:cursor-pointer hover:text-[#885B3A]">ON SALE</li>
          <li className="hover:cursor-pointer hover:text-[#885B3A]">NEW ARRIVALS</li>
        </ul>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 p-6">
        {products.map((product) => (

          <div key={product._id} onClick={()=>handleProductClick(product._id)} className="bg-white p-4 shadow rounded transition-transform duration-300 hover:shadow-lg hover:scale-105 hover:cursor-pointer">
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
  );
}

export default FeatureList;
