import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { FiSave, FiArrowLeft } from 'react-icons/fi';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

function ProductForm() {

  const { id } = useParams();
  const navigate = useNavigate();
  const isEditMode = Boolean(id);
  
  const [product, setProduct] = useState({
    name: '',
    description: '',
    price: '0',
    category: '',
    stock: '0',
    image: { url: '', filename: '' }
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(isEditMode);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const API_BASE_URL = import.meta.env.VITE_API_URL;

  // Function to get auth token
  const getAuthToken = () => {
    const token = localStorage.getItem('adminToken') || sessionStorage.getItem('adminToken');
    if (!token) {
      toast.error('Please login to continue');
      navigate('/admin/login');
      throw new Error('No authentication token found');
    }
    return token;
  };

  // Fetch product if in edit mode and all categories
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = getAuthToken();
        
        // Fetch categories first
        const categoriesResponse = await axios.get(`${API_BASE_URL}/api/categories`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        setCategories(categoriesResponse.data);

        if (isEditMode) {
          // Then fetch product data if in edit mode
          const productResponse = await axios.get(`${API_BASE_URL}/api/product/${id}`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          
          setProduct({
            ...productResponse.data,
            price: productResponse.data.price.toString(),
            stock: productResponse.data.stock.toString(),
            category: productResponse.data.category?._id || ''
          });
        }
      } catch (err) {
        const errorMessage = err.response?.data?.error || 'Failed to fetch data';
        toast.error(errorMessage);
        console.error('Fetch error:', err);
        if (err.response?.status === 401) {
          navigate('/admin/login');
        }
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, isEditMode, navigate]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setProduct(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = (e) => {
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
      // Validate required fields with specific messages
      if (!product.name.trim()) {
        toast.error('Product name is required');
        return;
      }
      if (!product.price) {
        toast.error('Product price is required');
        return;
      }
      if (!product.category) {
        toast.error('Please select a category');
        return;
      }

      const token = getAuthToken();
      const productData = {
        ...product,
        price: parseFloat(product.price),
        stock: parseInt(product.stock) || 0,
        category: product.category
      };

      if (isEditMode) {
        await axios.put(`${API_BASE_URL}/api/products/${id}`, productData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Product updated successfully!');
        setTimeout(() => navigate('/admin/allproducts'), 1500);
      } else {
        await axios.post(`${API_BASE_URL}/api/products`, productData, {
          headers: { Authorization: `Bearer ${token}` }
        });
        toast.success('Product created successfully!');
        setTimeout(() => navigate('/admin/allproducts'), 1500);
      }
    } catch (err) {
      const errorMessage = err.response?.data?.error || 
                         err.message || 
                         (isEditMode ? 'Failed to update product' : 'Failed to create product');
      toast.error(errorMessage);
      console.error('Submission error:', err);
      if (err.response?.status === 401) {
        navigate('/admin/login');
      }
    } finally {
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

  return (
    <div className="p-8 transition-all duration-300 relative">
      {/* Enhanced Toast Container */}
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="colored"
        style={{ zIndex: 10000 }}
      />
      
      <div className="flex items-center mb-6">
        <button 
          onClick={() => navigate('/admin/allproducts')}
          className="flex items-center text-indigo-600 hover:text-indigo-800 mr-4"
        >
          <FiArrowLeft className="mr-1" /> Back
        </button>
        <h1 className="text-3xl font-bold text-gray-800">
          {isEditMode ? 'Edit Product' : 'Add New Product'}
        </h1>
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
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Category*</label>
              <select
                name="category"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={product.category}
                onChange={handleChange}
              >
                <option value="">Select a category</option>
                {categories.map(category => (
                  <option key={category._id} value={category._id}>
                    {category.name}
                  </option>
                ))}
              </select>
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
                    onError={(e) => {
                      e.target.onerror = null;
                      e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Found';
                    }}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-gray-200">
            <button
              type="submit"
              disabled={isSubmitting}
              className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
            >
              <FiSave className="mr-2" />
              {isSubmitting ? 'Saving...' : isEditMode ? 'Save Changes' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default ProductForm;