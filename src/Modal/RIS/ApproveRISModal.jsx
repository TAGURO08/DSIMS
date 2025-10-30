import React, { useState, useEffect } from "react";
import Select from "react-select";

function ApproveRISModal({ isOpen, onClose, risRow, onApprove }) {
  const [suppliers, setSuppliers] = useState([]);
  const [selectedSupplier, setSelectedSupplier] = useState(null);

  useEffect(() => {
    if (isOpen) {
      setSelectedSupplier(null);
      fetch("http://127.0.0.1:8000/supplier/fetch")
        .then((res) => res.json())
        .then((data) => {
          if (data.status === "success" && Array.isArray(data.data)) {
            const options = data.data
              .filter((s) => s.Status === "Active")
              .map((s) => ({
                value: s.SupplierId,
                label: s.SupplierName,
              }));
            setSuppliers(options);
          } else {
            setSuppliers([]);
          }
        })
        .catch((err) => console.error("Error fetching suppliers:", err));
    }
  }, [isOpen]);

  useEffect(() => {
    if (isOpen && risRow) {
      console.log(
        `Modal opened for approval: RIS ID: ${risRow.RIS_id} | RIS_Details_id: ${risRow.RIS_Details_id}`
      );
    }
  }, [isOpen, risRow]);

  const handleApprove = async () => {
    if (!risRow || risRow.RIS_Details_id == null) {
      alert("No item selected or invalid RIS detail ID!");
      return;
    }
    if (!selectedSupplier) {
      alert("Please select a supplier");
      return;
    }

    // ✅ Get user info from local storage
    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.id;

    if (!userId) {
      alert("User ID not found in local storage!");
      return;
    }

    const payload = {
      ris_detail_id: risRow.RIS_Details_id,
      supplier_id: selectedSupplier.value,
      user_id: userId, // ✅ include user id
    };

    console.log("Sending approve request:", payload);

    try {
      const response = await fetch("http://127.0.0.1:8000/approve_ris", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (response.ok && data.status === "success") {
        alert(
          `✅ Item approved successfully!\nItem: ${risRow.ProductName}\nSupplier: ${selectedSupplier.label}`
        );
        onClose();
        if (onApprove) onApprove();
      } else {
        alert(`❌ Failed to approve: ${data.detail || data.message}`);
      }
    } catch (err) {
      console.error("Error approving RIS item:", err);
      alert("❌ An error occurred while approving the item.");
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50">
      <div className="bg-white p-6 rounded-lg w-[400px]">
        <h2 className="text-lg font-semibold mb-4">Approve Item</h2>

        <div className="mb-3">
          <label className="block text-sm font-medium">Item Name</label>
          <input
            type="text"
            value={risRow?.ProductName || ""}
            readOnly
            className="w-full border px-2 py-1 rounded mt-1 bg-gray-100"
          />
        </div>

        <div className="mb-3">
          <label className="block text-sm font-medium">Quantity</label>
          <input
            type="number"
            value={risRow?.Qty || 0}
            readOnly
            className="w-full border px-2 py-1 rounded mt-1 bg-gray-100"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium">Supplier</label>
          <Select
            options={suppliers}
            value={selectedSupplier}
            onChange={setSelectedSupplier}
            placeholder="Select supplier..."
            className="border rounded"
          />
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-gray-300 hover:bg-gray-400">
            Cancel
          </button>
          <button
            onClick={handleApprove}
            className="px-3 py-1 rounded bg-green-700 text-white hover:bg-green-600">
            Approve
          </button>
        </div>
      </div>
    </div>
  );
}

export default ApproveRISModal;
