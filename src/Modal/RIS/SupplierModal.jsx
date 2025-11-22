import React, { useState, useEffect } from "react";
import Select from "react-select";

function SupplierModal({ isOpen, onClose, item, onAfterOrder }) {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  // 🔥 Get logged-in user from localStorage
  const user = JSON.parse(localStorage.getItem("user"));

  useEffect(() => {
    if (isOpen) {
      const fetchSuppliers = async () => {
        try {
          const res = await fetch("http://localhost:8000/supplier/fetch");
          const data = await res.json();
          const supplierList = Array.isArray(data) ? data : data.data || [];
          setSuppliers(supplierList);
        } catch (error) {
          console.error("Error fetching suppliers:", error);
          setSuppliers([]);
        } finally {
          setLoading(false);
        }
      };
      fetchSuppliers();
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const QtyToOrder = item ? Math.max(0, item.Qty - item.StockQty) : 0;

  const supplierOptions = suppliers.map((s) => ({
    value: s.SupplierId,
    label: s.SupplierName,
  }));

  const handleApprove = async () => {
    if (!selectedSupplier) {
      alert("Please select a supplier first.");
      return;
    }

    if (!user?.id) {
      alert("User ID not found in localStorage!");
      return;
    }

    setSubmitting(true);
    try {
      const response = await fetch("http://localhost:8000/purchase_order/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          SupplierId: selectedSupplier.value,
          RID_details_id: item?.RID_details_id,
          QtyToOrder: QtyToOrder,
          id: user.id,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        alert(`✅ ${result.message}\nPO Number: ${result.PO_Number}`);

        if (onAfterOrder) onAfterOrder();

        onClose();
      } else {
        alert(`❌ Failed: ${result.detail || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error approving:", err);
      alert("Error sending request to the server.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/40 z-50">
      <div className="bg-white w-96 p-6 rounded-2xl shadow-2xl border border-gray-200">
        <h2 className="text-lg font-semibold text-[#172554] mb-4 border-b pb-2">
          Select Supplier
        </h2>

        <p className="text-sm mb-1 text-gray-600">
          For item: <strong>{item?.ProductName}</strong>
        </p>

        <div className="mb-3">
          <label className="text-sm text-gray-700 font-medium mb-1 block">
            Quantity to Order:
          </label>
          <input
            type="number"
            value={QtyToOrder}
            readOnly
            className="w-full px-2 py-1 border border-gray-300 rounded-md bg-gray-100 text-black focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {loading ? (
          <p className="text-center text-gray-500 italic py-4">
            Loading suppliers...
          </p>
        ) : suppliers.length === 0 ? (
          <p className="text-gray-500 text-center italic py-4">
            No suppliers available.
          </p>
        ) : (
          <div className="space-y-3">
            <label className="text-sm text-gray-700 font-medium">
              Choose a supplier:
            </label>
            <Select
              options={supplierOptions}
              value={selectedSupplier}
              onChange={setSelectedSupplier}
              placeholder="-- Select Supplier --"
              isSearchable
              className="text-sm"
            />
          </div>
        )}

        <div className="mt-6 flex justify-between space-x-3">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-600 text-white text-sm cursor-pointer rounded-lg hover:bg-red-800 transition"
            disabled={submitting}>
            Close
          </button>
          <button
            onClick={handleApprove}
            className="px-4 py-2 bg-green-600 text-white text-sm cursor-pointer rounded-lg hover:bg-green-700 transition"
            disabled={submitting}>
            {submitting ? "Processing..." : "Order"}
          </button>
        </div>
      </div>
    </div>
  );
}

export default SupplierModal;
