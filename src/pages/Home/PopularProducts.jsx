import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function PopularProducts() {
  const [products, setProduct] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        fetch(`${API_BASE_URL}/api/products`)
          .then((res) => res.json())
          .then((data) => setProduct(data.slice(0, 4)))
          .catch((err) => console.error("Error Fetching Products", err));
      } catch (err) {
        console.error("Fetch error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };
    fetchProducts();
  }, []);

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
  if (!products.length)
    return <div className="lg:px-35 py-4 px-10">No products found</div>;

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="h-auto lg:h-[82vh] px-4 md:px-10 lg:px-[120px] py-10">
      <div className="flex flex-col bg-gray-100 px-4 md:px-8 lg:px-10 py-8 gap-6 rounded-md items-center">
        <p className="lg:text-3xl text-2xl font-bold">SHOP POPULAR</p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <div
              key={product._id}
              onClick={() => handleProductClick(product._id)}
              className="bg-white p-4 shadow rounded transition-transform duration-300 hover:shadow-lg hover:scale-105 cursor-pointer"
            >
              <img
                src={product.image?.url}
                alt={product.name}
                className="w-full h-48 sm:h-40 md:h-48 object-cover mb-2"
              />
              <p className="text-sm text-gray-500">
                {product.category?.name || "Uncategorized"}
              </p>
              <p className="font-bold text-sm md:text-base lg:text-lg">
                {product.name}
              </p>
              <div className="text-[#885B3A]">★ ★ ★ ★ ☆</div>
              <p className="text-black font-semibold">${product.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default PopularProducts;
