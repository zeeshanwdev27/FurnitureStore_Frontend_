import React, { useState, useEffect } from "react";
import { format } from "date-fns";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  Button,
  CircularProgress,
  Switch,
  FormControlLabel,
} from "@mui/material";
import {
  FaTrash as Delete,
  FaEdit as Edit,
  FaToggleOn,
  FaToggleOff,
} from "react-icons/fa";

const PromoCodes = () => {
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formData, setFormData] = useState({
    code: "",
    discountType: "fixed",
    discountValue: 10,
    minOrderAmount: 0,
    maxDiscountAmount: "",
    endDate: format(
      new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
      "yyyy-MM-dd"
    ),
    maxUses: "",
  });
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [promoToDelete, setPromoToDelete] = useState(null);

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

  useEffect(() => {
    fetchPromoCodes();
  }, []);

  const fetchPromoCodes = async () => {
    const token = getAuthToken();
    try {
      const response = await fetch(
        "http://localhost:3000/api/admin/promo-codes",
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      const data = await response.json();
      if (response.ok) {
        setPromoCodes(data.promoCodes);
      }
    } catch (err) {
      console.error("Failed to fetch promo codes:", err);
      toast.error("Failed to fetch promo codes");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = getAuthToken();
      const response = await fetch(
        "http://localhost:3000/api/admin/promo-codes",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(formData),
        }
      );

      const data = await response.json();
      if (response.ok) {
        toast.success("Promo code created successfully");
        setFormData({
          code: "",
          discountType: "fixed",
          discountValue: 10,
          minOrderAmount: 0,
          maxDiscountAmount: "",
          endDate: format(
            new Date(Date.now() + 30 * 24 * 60 * 60 * 1000),
            "yyyy-MM-dd"
          ),
          maxUses: "",
        });
        fetchPromoCodes();
      } else {
        toast.error(data.error || "Failed to create promo code");
      }
    } catch (err) {
      console.error("Error creating promo code:", err);
      toast.error("Failed to create promo code");
    }
  };

  const togglePromoStatus = async (id, currentStatus) => {
    try {
      const token = getAuthToken();
      const response = await fetch(
        `http://localhost:3000/api/admin/promo-codes/${id}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({ isActive: !currentStatus }),
        }
      );

      if (response.ok) {
        toast.success(
          `Promo code ${
            !currentStatus ? "activated" : "deactivated"
          } successfully`
        );
        fetchPromoCodes();
      } else {
        toast.error("Failed to update promo code status");
      }
    } catch (err) {
      console.error("Error updating promo code:", err);
      toast.error("Failed to update promo code status");
    }
  };

  const handleDeleteClick = (id) => {
    setPromoToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleDeleteConfirm = async () => {
    if (!promoToDelete) return;

    try {
      const token = getAuthToken()
      const response = await fetch(
        `http://localhost:3000/api/admin/promo-codes/${promoToDelete}`,
        {
          method: "DELETE",
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      if (response.ok) {
        toast.success("Promo code deleted successfully");
        fetchPromoCodes();
      } else {
        toast.error("Failed to delete promo code");
      }
    } catch (err) {
      console.error("Error deleting promo code:", err);
      toast.error("Failed to delete promo code");
    } finally {
      setDeleteDialogOpen(false);
      setPromoToDelete(null);
    }
  };

  const handleDeleteCancel = () => {
    setDeleteDialogOpen(false);
    setPromoToDelete(null);
  };

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <CircularProgress />
      </div>
    );

  return (
    <div className="p-6">
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
      />

      <Dialog
        open={deleteDialogOpen}
        onClose={handleDeleteCancel}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title" className="font-bold">
          Confirm Deletion
        </DialogTitle>
        <DialogContent>
          <DialogContentText
            id="alert-dialog-description"
            className="text-gray-700"
          >
            Are you sure you want to delete this promo code? This action cannot
            be undone.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button
            onClick={handleDeleteCancel}
            className="text-gray-600 hover:bg-gray-100"
          >
            Cancel
          </Button>
          <Button
            onClick={handleDeleteConfirm}
            color="error"
            startIcon={<Delete className="text-sm" />}
            className="hover:bg-red-50"
            autoFocus
          >
            Delete
          </Button>
        </DialogActions>
      </Dialog>

      <h1 className="text-2xl font-bold mb-6 text-gray-800">
        Promo Codes Management
      </h1>

      <div className="bg-white rounded-lg shadow-md p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4 text-gray-700">
          Create New Promo Code
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Promo Code
              </label>
              <input
                type="text"
                name="code"
                value={formData.code}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
                placeholder="SUMMER2023"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Discount Type
              </label>
              <select
                name="discountType"
                value={formData.discountType}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="fixed">Fixed Amount</option>
                <option value="percentage">Percentage</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {formData.discountType === "percentage"
                  ? "Discount Percentage"
                  : "Discount Amount"}
              </label>
              <input
                type="number"
                name="discountValue"
                value={formData.discountValue}
                onChange={handleChange}
                min="0"
                step={formData.discountType === "percentage" ? "1" : "0.01"}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Minimum Order Amount
              </label>
              <input
                type="number"
                name="minOrderAmount"
                value={formData.minOrderAmount}
                onChange={handleChange}
                min="0"
                step="0.01"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            {formData.discountType === "percentage" && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Maximum Discount Amount (optional)
                </label>
                <input
                  type="number"
                  name="maxDiscountAmount"
                  value={formData.maxDiscountAmount}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                />
              </div>
            )}

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Expiry Date
              </label>
              <input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                required
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Maximum Uses (optional)
              </label>
              <input
                type="number"
                name="maxUses"
                value={formData.maxUses}
                onChange={handleChange}
                min="1"
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors duration-200 flex items-center justify-center gap-2"
          >
            Create Promo Code
          </button>
        </form>
      </div>

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="flex justify-between items-center p-6">
          <h2 className="text-xl font-semibold text-gray-700">
            Promo Codes List
          </h2>
          <div className="text-sm text-gray-500">
            {promoCodes.length} {promoCodes.length === 1 ? "code" : "codes"}{" "}
            found
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Code
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Discount
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Min Order
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Expires
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Uses
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {promoCodes.map((promo) => (
                <tr key={promo._id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap font-mono font-bold text-blue-600">
                    {promo.code}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {promo.discountType === "percentage"
                      ? `${promo.discountValue}%`
                      : `$${promo.discountValue.toFixed(2)}`}
                    {promo.maxDiscountAmount &&
                      promo.discountType === "percentage" && (
                        <span className="text-xs text-gray-500 block">
                          (Max ${promo.maxDiscountAmount.toFixed(2)})
                        </span>
                      )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    ${promo.minOrderAmount.toFixed(2)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {format(new Date(promo.endDate), "MMM dd, yyyy")}
                    {new Date(promo.endDate) < new Date() && (
                      <span className="text-xs text-red-500 block">
                        Expired
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {promo.currentUses}
                    {promo.maxUses ? ` / ${promo.maxUses}` : ""}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <FormControlLabel
                      control={
                        <Switch
                          checked={promo.isActive}
                          onChange={() =>
                            togglePromoStatus(promo._id, promo.isActive)
                          }
                          color="primary"
                        />
                      }
                      label={promo.isActive ? "Active" : "Inactive"}
                      labelPlacement="end"
                    />
                  </td>

                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-2">
                      <button
                        onClick={() =>
                          togglePromoStatus(promo._id, promo.isActive)
                        }
                        className={`cursor-pointer px-3 py-1.5 rounded-md text-sm flex items-center gap-1.5 ${
                          promo.isActive
                            ? "bg-yellow-500 hover:bg-yellow-600 text-white"
                            : "bg-green-500 hover:bg-green-600 text-white"
                        }`}
                      >
                        {promo.isActive ? (
                          <>
                            <FaToggleOff className="text-xs" />
                            Deactivate
                          </>
                        ) : (
                          <>
                            <FaToggleOn className="text-xs" />
                            Activate
                          </>
                        )}
                      </button>
                      <button
                        onClick={() => handleDeleteClick(promo._id)}
                        className="cursor-pointer px-3 py-1.5 rounded-md bg-red-500 hover:bg-red-600 text-white text-sm flex items-center gap-1.5"
                      >
                        <Delete className="text-xs" />
                        Delete
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default PromoCodes;
