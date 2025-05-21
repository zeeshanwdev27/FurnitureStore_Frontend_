import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";

function SearchResults() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();

  const API_BASE_URL = import.meta.env.VITE_API_URL;
  const query = new URLSearchParams(location.search).get("q");

useEffect(() => {
  const fetchData = async () => {
    if (!query) return;
    
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`${API_BASE_URL}/api/search?query=${query}`);
      const data = await response.json();
      setProducts(data.products || []);
    } catch (err) {
      console.error("Failed to fetch dashboard data:", err);
      setError("Failed to load search results");
    } finally {
      setLoading(false);
    }
  };

  fetchData();
}, [query]);

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
              <p className="text-sm text-gray-500">{product.category?.name}</p>
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
