import React, { useEffect, useState } from "react";
import SupplierModal from "./SupplierModal";

function ViewItemModal({ isOpen, onClose, risId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState(null);
  const [isSupplierModalOpen, setIsSupplierModalOpen] = useState(false);

  useEffect(() => {
    const fetchItems = async () => {
      if (!isOpen || !risId) return;
      try {
        const res = await fetch(`http://127.0.0.1:8000/ris/items/${risId}`);
        const data = await res.json();
        if (data.status === "success" && Array.isArray(data.data)) {
          setItems(data.data);
        } else {
          setItems([]);
        }
      } catch (err) {
        console.error("Error fetching RIS items:", err);
        setItems([]);
      } finally {
        setLoading(false);
      }
    };
    fetchItems();
  }, [isOpen, risId]);

  const handleSelectSupplier = (item) => {
    setSelectedItem(item);
    setIsSupplierModalOpen(true);
  };

  // ✅ Function to handle item approval
  const handleApprove = async (item) => {
    try {
      const user = JSON.parse(localStorage.getItem("user"));
      if (!user || !user.id) {
        alert("User not found. Please log in again.");
        return;
      }

      const confirmApprove = window.confirm(
        `Are you sure you want to approve "${item.ProductName}"?`
      );
      if (!confirmApprove) return;

      const response = await fetch("http://127.0.0.1:8000/ris/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          RID_details_id: item.RID_details_id,
          user_id: user.id,
        }),
      });

      const result = await response.json();

      if (response.ok && result.status === "success") {
        alert("✅ " + result.message);
        // Refresh list to show updated status
        setItems((prev) =>
          prev.map((it) =>
            it.RID_details_id === item.RID_details_id
              ? { ...it, Status: "Approved" }
              : it
          )
        );
      } else {
        alert("❌ Failed: " + (result.message || "Unknown error"));
      }
    } catch (err) {
      console.error("Approval failed:", err);
      alert("Error approving item. Please try again.");
    }
  };

  if (!isOpen) return null;

  return (
    <>
      <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px] z-40">
        <div className="bg-white w-3/5 p-6 rounded-2xl shadow-2xl relative border border-gray-200">
          <h2 className="text-xl font-semibold mb-4 text-[#172554] border-b pb-2">
            Items
          </h2>

          {loading ? (
            <p className="text-center text-gray-500 italic py-6">Loading...</p>
          ) : items.length === 0 ? (
            <p className="text-center text-gray-500 italic py-6">
              No items found for this RIS.
            </p>
          ) : (
            <div className="overflow-hidden rounded-xl border border-gray-200 shadow-sm">
              <table className="min-w-full border-collapse">
                <thead className="bg-[#172554] text-white">
                  <tr>
                    <th className="px-4 py-3 text-left font-medium text-sm uppercase tracking-wide">
                      Product Name
                    </th>
                    <th className="px-4 py-3 text-center font-medium text-sm uppercase tracking-wide">
                      Quantity
                    </th>
                    <th className="px-4 py-3 text-center font-medium text-sm uppercase tracking-wide">
                      Unit Price
                    </th>
                    <th className="px-4 py-3 text-center font-medium text-sm uppercase tracking-wide">
                      Status
                    </th>
                    <th className="px-4 py-3 text-center font-medium text-sm uppercase tracking-wide">
                      Action
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {items.map((item, index) => {
                    const canApprove = item.Qty <= item.StockQty; // ✅ can approve if stock is enough
                    const isDisabled =
                      item.Status === "Approved" || item.Status === "Rejected";

                    return (
                      <tr
                        key={item.RID_details_id || index}
                        className={`${
                          index % 2 === 0 ? "bg-white" : "bg-gray-50"
                        } hover:bg-indigo-50 transition-colors`}>
                        <td className="px-4 py-3 border-t border-gray-200">
                          {item.ProductName}
                        </td>
                        <td className="px-4 py-3 border-t border-gray-200 text-center">
                          {item.Qty}
                        </td>
                        <td className="px-4 py-3 border-t border-gray-200 text-center">
                          {item.UnitPrice}
                        </td>
                        <td className="px-4 py-3 border-t border-gray-200 text-center">
                          <span
                            className={`px-3 py-1 rounded-full text-xs font-semibold ${
                              item.Status === "Approved"
                                ? "bg-green-100 text-green-700"
                                : item.Status === "Rejected"
                                ? "bg-red-100 text-red-700"
                                : "bg-yellow-100 text-yellow-700"
                            }`}>
                            {item.Status || "Pending"}
                          </span>
                        </td>
                        <td className="px-4 py-3 border-t border-gray-200 text-center">
                          {canApprove ? (
                            <button
                              onClick={() => handleApprove(item)}
                              disabled={isDisabled}
                              className={`px-3 py-1.5 text-xs rounded-md shadow text-white transition ${
                                isDisabled
                                  ? "bg-gray-400 cursor-not-allowed"
                                  : "bg-green-600 hover:bg-green-700"
                              }`}>
                              Approve
                            </button>
                          ) : (
                            <button
                              onClick={() => handleSelectSupplier(item)}
                              disabled={isDisabled}
                              className={`px-3 py-1.5 text-xs rounded-md shadow text-white transition ${
                                isDisabled
                                  ? "bg-gray-400 cursor-not-allowed"
                                  : "bg-[#2563eb] hover:bg-[#1e40af]"
                              }`}>
                              Select Supplier
                            </button>
                          )}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="px-5 py-2.5 bg-[#dc2626] cursor-pointer text-white font-medium rounded-lg shadow-md hover:bg-[#b91c1c] transition">
              Close
            </button>
          </div>
        </div>
      </div>

      {/* Supplier Modal */}
      <SupplierModal
        isOpen={isSupplierModalOpen}
        onClose={() => setIsSupplierModalOpen(false)}
        item={selectedItem}
      />
    </>
  );
}

export default ViewItemModal;
