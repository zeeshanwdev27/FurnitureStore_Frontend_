import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CategoryProducts() {
  const { categoryName } = useParams(); // e.g., "Sofas"
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null)
  const [category, setCategory] = useState(null); // Add state for category details

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        setLoading(true);
        const response = await axios.get(
          `http://localhost:3000/api/category/${categoryName}`
        );
        
        setProducts(response.data);
        
        // If we have products, get the category name from the first product
        if (response.data.length > 0 && response.data[0].category) {
          setCategory(response.data[0].category);
        }
      } catch (error) {
        console.error("Error fetching category products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [categoryName]);


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

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="lg:px-35 py-4 px-10">
      <h1 className="font-bold text-xl">
        {category?.name || categoryName} Collection
      </h1>
      {loading ? (
        <p className="text-gray-600">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-600">No products found in this category.</p>
      ) : (
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
                className="w-full h-48 object-cover mb-2 sm:h-36 md:h-48 lg:h-48"
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.src = "https://via.placeholder.com/300x300?text=No+Image";
                }}
              />
              <p className="text-sm text-gray-500">
                {product.category?.name || categoryName}
              </p>
              <p className="font-bold lg:text-lg sm:text-sm md:text-sm">
                {product.name}
              </p>
              <div className="text-[#885B3A]">★ ★ ★ ★ ☆</div>
              <p className="text-black font-semibold">${product.price?.toFixed(2)}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default CategoryProducts;