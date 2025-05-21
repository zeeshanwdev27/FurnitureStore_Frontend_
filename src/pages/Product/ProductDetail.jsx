import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext";

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [suggested, setSuggested] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { addToCart } = useCart();
  const navigate = useNavigate();
  const API_BASE_URL = import.meta.env.VITE_API_URL;

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        
        // Fetch main product
        const productResponse = await fetch(`${API_BASE_URL}/api/product/${id}`);
        if (!productResponse.ok) {
          throw new Error('Failed to fetch product');
        }
        const productData = await productResponse.json();
        setProduct(productData);

        // Fetch suggested products
        if (productData.category) {
          const suggestedResponse = await fetch(
            `${API_BASE_URL}/api/category/${productData.category._id || productData.category}`
          );
          if (!suggestedResponse.ok) {
            throw new Error('Failed to fetch suggested products');
          }
          const suggestedData = await suggestedResponse.json();
          setSuggested(suggestedData.filter(p => p._id !== id));
        }
      } catch (err) {
        console.error("Error:", err);
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    addToCart({
      ...product,
      quantity: 1 // Default quantity when adding to cart
    });
  };

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
  if (error) return <div className="p-10 text-red-500">Error: {error}</div>;
  if (!product) return <div className="p-10">Product not found</div>;

  return (
    <div className="lg:px-35 py-5 px-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Product Image */}
        <div className="w-full h-80 flex items-center justify-center overflow-hidden rounded mb-2 bg-white">
          <img
            src={product.image?.url || 'https://via.placeholder.com/500'}
            alt={product.name}
            className="max-w-full max-h-full object-contain"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = 'https://via.placeholder.com/500';
            }}
          />
        </div>

        {/* Product Info */}
        <div>
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <p className="text-sm text-gray-500 mb-2">
            {product.category?.name || 'Uncategorized'}
          </p>
          <p className="text-[#885B3A]">★ ★ ★ ★ ☆</p>
          <p className="text-lg font-semibold mt-2">
            ${product.price?.toFixed(2) || '0.00'}
          </p>
          <p className="mt-4 text-gray-700">
            {product.description || 'No description available'}
          </p>

          <button
            onClick={handleAddToCart}
            className="mt-6 bg-black text-white px-6 py-2 rounded hover:bg-[#885B3A] transition hover:cursor-pointer"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Suggested Products */}
      {suggested.length > 0 && (
        <div className="mt-16 mb-16">
          <h3 className="text-xl font-semibold mb-4">You may also like</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {suggested.map((item) => (
              <div
                key={item._id}
                onClick={() => handleProductClick(item._id)}
                className="bg-white p-4 rounded shadow hover:shadow-lg transition cursor-pointer"
              >
                <img
                  src={item.image?.url || 'https://via.placeholder.com/300'}
                  alt={item.name}
                  className="w-full h-40 object-cover mb-2"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src = 'https://via.placeholder.com/300';
                  }}
                />
                <p className="text-sm text-gray-500">
                  {item.category?.name || 'Uncategorized'}
                </p>
                <p className="font-bold">{item.name}</p>
                <p className="text-[#885B3A]">★ ★ ★ ★ ☆</p>
                <p className="text-black font-semibold">
                  ${item.price?.toFixed(2) || '0.00'}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProductDetail;