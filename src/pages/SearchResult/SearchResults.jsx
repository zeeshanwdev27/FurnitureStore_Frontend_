import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function SearchResults() {
    
  const [products, setProducts] = useState([]);
  const navigate = useNavigate();
  const location = useLocation();

  const query = new URLSearchParams(location.search).get("q");

  useEffect(() => {
    if (!query) return;
    fetch(`http://localhost:3000/api/search?query=${query}`)
      .then((res) => res.json())
      .then((data) => setProducts(data.products || []))
      .catch((err) => console.log(err));
  }, [query]);

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="lg:px-35 py-4 px-10">
      <h1 className="font-bold text-xl mb-4">Search Results for: "{query}"</h1>
      {products.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-6">
          {products.map((product) => (
            <div
              key={product._id}
              onClick={() => handleProductClick(product._id)}
              className="bg-white p-4 shadow rounded transition-transform duration-300 hover:shadow-lg hover:scale-105 hover:cursor-pointer"
            >
              <img
                src={product.image?.url}
                alt={product.name}
                className="w-full h-48 object-cover mb-2"
              />
              <p className="text-sm text-gray-500">{product.category}</p>
              <p className="font-bold lg:text-lg">{product.name}</p>
              <div className="text-[#885B3A]">★ ★ ★ ★ ☆</div>
              <p className="text-black font-semibold">${product.price}</p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500">No products found.</p>
      )}
    </div>
  );
}

export default SearchResults;
