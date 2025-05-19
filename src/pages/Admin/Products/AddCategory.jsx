import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FiSave, FiArrowLeft, FiTrash2 } from "react-icons/fi";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function AddCategory() {
  const navigate = useNavigate();
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Function to get auth token
  const getAuthToken = () => {
    const token =
      localStorage.getItem("adminToken") ||
      sessionStorage.getItem("adminToken");
    if (!token) {
      throw new Error("No authentication token found");
    }
    return token;
  };

  // Fetch all categories on component mount
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const token = getAuthToken();
        const response = await axios.get(
          "http://localhost:3000/api/categories",
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setCategories(response.data);
      } catch (err) {
        toast.error(err.response?.data?.error || "Failed to fetch categories");
        if (err.response?.status === 401) {
          navigate("/admin/login");
        }
      }
    };
    fetchCategories();
  }, [navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!category.trim()) {
      toast.error("Category name cannot be empty");
      return;
    }

    setIsSubmitting(true);

    try {
      const token = getAuthToken();
      await axios.post(
        "http://localhost:3000/api/categories",
        { name: category },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Category added successfully!");
      setCategory("");
      // Refresh categories list
      const response = await axios.get("http://localhost:3000/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to create category");
      if (err.response?.status === 401) {
        navigate("/admin/login");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!selectedCategory) {
      toast.error("Please select a category to delete");
      return;
    }

    setIsDeleting(true);

    try {
      const token = getAuthToken();
      const categoryToDelete = categories.find(
        (cat) => cat._id === selectedCategory
      );

      await axios.delete(
        `http://localhost:3000/api/categories/${selectedCategory}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success(
        `"${categoryToDelete.name}" category deleted successfully!`
      );
      setSelectedCategory("");
      // Refresh categories list
      const response = await axios.get("http://localhost:3000/api/categories", {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCategories(response.data);
    } catch (err) {
      toast.error(err.response?.data?.error || "Failed to delete category");
      if (err.response?.status === 401) {
        navigate("/admin/login");
      }
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="p-8 transition-all duration-300">
      <div className="flex items-center mb-6">
        <button
          onClick={() => navigate("/admin/allproducts")}
          className="flex items-center text-indigo-600 hover:text-indigo-800 mr-4 cursor-pointer"
        >
          <FiArrowLeft className="mr-1" /> Back
        </button>
        <h1 className="text-3xl font-bold text-gray-800">
          Category Management
        </h1>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Add Category Form */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Add New Category</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Category Name*
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
                placeholder="Enter category name"
              />
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200">
              <button
                type="submit"
                disabled={isSubmitting}
                className="flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <FiSave className="mr-2" />
                {isSubmitting ? "Saving..." : "Add Category"}
              </button>
            </div>
          </form>
        </div>

        {/* Delete Category Section */}
        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold mb-4">Delete Category</h2>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Select Category*
              </label>
              <select
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                required
              >
                <option value="">-- Select a category --</option>
                {categories.map((cat) => (
                  <option key={cat._id} value={cat._id}>
                    {cat.name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex justify-end pt-4 border-t border-gray-200">
              <button
                type="button"
                onClick={handleDelete}
                disabled={isDeleting || !selectedCategory}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                <FiTrash2 className="mr-2" />
                {isDeleting ? "Deleting..." : "Delete Category"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default AddCategory;
