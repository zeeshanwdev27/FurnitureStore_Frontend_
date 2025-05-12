import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import { useNavigate } from "react-router-dom";

function CategoryProducts() {
  const { categoryName } = useParams(); // e.g., "Sofas"
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategoryProducts = async () => {
      try {
        const response = await axios.get(
          `http://localhost:3000/api/category/${categoryName}`
        );
        console.log(response);
        
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching category products:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchCategoryProducts();
  }, [categoryName]);

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="lg:px-35 py-4 px-10">
      <h1 className="font-bold text-xl">{categoryName} Collection</h1>
      {loading ? (
        <p className="text-gray-600">Loading products...</p>
      ) : products.length === 0 ? (
        <p className="text-gray-600">No products found in this category.</p>
      ) : (
        
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 py-6">
        {products.map((product) => (
          <div
            key={product._id}
            onClick={()=> handleProductClick(product._id)}
            className="bg-white p-4 shadow rounded transition-transform duration-300 hover:shadow-lg hover:scale-105 hover:cursor-pointer"
          >
            <img
              src={product.image?.url}
              alt={product.name}
              className="w-full h-48 object-cover mb-2 sm:h-36 md:h-48 lg:h-48"
            />
            <p className="text-sm text-gray-500">{product.category}</p>
            <p className="font-bold lg:text-lg sm:text-sm md:text-sm">
              {product.name}
            </p>
            <div className="text-[#885B3A]">★ ★ ★ ★ ☆</div>
            <p className="text-black font-semibold">${product.price}</p>
          </div>
        ))}
      </div>
      )
    }
    </div>
  );
  
}

export default CategoryProducts;
