import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useCart } from "../../context/CartContext"

function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [suggested, setSuggested] = useState([]);
  const { addToCart } = useCart();

  // use Navigate
  const navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3000/api/product/${id}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        fetch(`http://localhost:3000/api/category/${data.category}`)
          .then((res) => res.json())
          .then((related) => {
            const filtered = related.filter((p) => p._id !== id);
            setSuggested(filtered);
          });
      })
      .catch((err) => console.log(err));
  }, [id]);

  const handleAddToCart = () => {
    // Add your add-to-cart logic here
    // alert(`Added "${product.name}" to cart!`);
    addToCart(product);
  };

  if (!product) return <div className="p-10">Loading...</div>;

  const handleProductClick = (id) => {
    navigate(`/product/${id}`);
  };

  return (
    <div className="lg:px-35 py-5 px-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Product Image */}
        <div className="w-full h-80 flex items-center justify-center overflow-hidden rounded mb-2 bg-white">
          <img
            src={product.image?.url}
            alt={product.name}
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* Product Info */}
        <div>
          <h2 className="text-2xl font-bold">{product.name}</h2>
          <p className="text-sm text-gray-500 mb-2">{product.category}</p>
          <p className="text-[#885B3A]">★ ★ ★ ★ ☆</p>
          <p className="text-lg font-semibold mt-2">${product.price}</p>
          <p className="mt-4 text-gray-700">{product.description}</p>

          <button
            onClick={handleAddToCart}
            className="mt-6 bg-black text-white px-6 py-2 rounded hover:bg-[#885B3A] transition hover:cursor-pointer"
          >
            Add to Cart
          </button>
        </div>
      </div>

      {/* Suggested Products */}
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
                src={item.image?.url}
                alt={item.name}
                className="w-full h-40 object-cover mb-2"
              />
              <p className="text-sm text-gray-500">{item.category}</p>
              <p className="font-bold">{item.name}</p>
              <p className="text-[#885B3A]">★ ★ ★ ★ ☆</p>
              <p className="text-black font-semibold">${item.price}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default ProductDetail;
