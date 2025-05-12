import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiSave, FiArrowLeft } from 'react-icons/fi';

function EditProduct() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: 0,
    category: '',
    stock: 0,
    image: { url: '', filename: '' }
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Fetch product data
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await axios.get(`http://localhost:3000/api/product/${id}`);
        setProduct(response.data);
        setLoading(false);
      } catch (err) {
        setError(err.response?.data?.error || 'Failed to fetch product');
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
    // For a real implementation, you would upload the image to a service like Cloudinary
    // This is just a simple example for the URL
    setProduct(prev => ({
      ...prev,
      image: {
        ...prev.image,
        url: e.target.value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {

    // Convert price and stock to numbers before sending
    const productData = {
      ...product,
      price: parseFloat(product.price),
      stock: parseInt(product.stock) || 0
    };


      await axios.put(`http://localhost:3000/api/products/${id}`, productData);
      navigate('/admin/allproducts');
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to update product');
      setIsSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="p-8 transition-all duration-300">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 transition-all duration-300">
        <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4" role="alert">
          <p className="font-bold">Error</p>
          <p>{error}</p>
          <button 
            onClick={() => navigate('/admin/allproducts')}
            className="mt-2 text-indigo-600 hover:text-indigo-800"
          >
            Back to Products
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="p-8 transition-all duration-300">
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/admin/allproducts')}
          className="flex items-center text-indigo-600 hover:text-indigo-800 mr-4"
        >
          <FiArrowLeft className="mr-1" /> Back
        </button>
        <h1 className="text-3xl font-bold text-gray-800">Edit Product</h1>
      </div>

      <div className="bg-white rounded-lg shadow p-6 max-w-3xl">
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Product Name*</label>
              <input
                type="text"
                name="name"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={product.name}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
              <input
                type="text"
                name="category"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={product.category}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price*</label>
              <input
                type="number"
                name="price"
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={product.price}
                onChange={handleChange}
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Stock Quantity</label>
              <input
                type="number"
                name="stock"
                min="0"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={product.stock}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
              <textarea
                name="description"
                rows="3"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={product.description}
                onChange={handleChange}
              />
            </div>

            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Image URL</label>
              <input
                type="text"
                name="imageUrl"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={product.image?.url || ''}
                onChange={handleImageChange}
                placeholder="https://example.com/image.jpg"
              />
              {product.image?.url && (
                <div className="mt-2">
                  <img 
                    src={product.image.url} 
                    alt="Product preview" 
                    className="h-32 object-contain border rounded-md"
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed"
            >
              <FiSave className="mr-2" />
              {isSubmitting ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default EditProduct;