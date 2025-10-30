import React, { useState, useEffect } from "react";
import Select from "react-select";
import { MdClose } from "react-icons/md";

function RISModal({ isAddOpen, onClose, onSuccess }) {
  if (!isAddOpen) return null;

  const [items, setItems] = useState([]);
  const [rows, setRows] = useState([
    { itemName: "", quantity: "", orderBy: "" },
  ]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetch("http://127.0.0.1:8000/item/select-list")
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) setItems(data);
        else if (Array.isArray(data.data)) setItems(data.data);
        else {
          const arr = Object.keys(data).map((key) => ({
            value: key,
            label: data[key],
          }));
          setItems(arr);
        }
      })
      .catch((err) => console.error("Error fetching items:", err));
  }, []);

  const handleRowChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;
    setRows(updated);
  };

  const addRow = () => {
    setRows([...rows, { itemName: "", quantity: "" }]);
  };

  const removeRow = (index) => {
    const updated = rows.filter((_, i) => i !== index);
    setRows(updated);
  };

  const validate = () => {
    let newErrors = {};
    rows.forEach((row, index) => {
      if (!row.itemName) newErrors[`itemName-${index}`] = "Item is required";
      if (!row.quantity)
        newErrors[`quantity-${index}`] = "Quantity is required";
      if (index === 0 && !row.orderBy)
        newErrors[`orderBy-${index}`] = "Order By is required";
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validate()) return;

    try {
      const payload = {
        order_by: rows[0].orderBy,
        items: rows.map((r) => ({
          item_id: r.itemName,
          quantity: parseInt(r.quantity),
        })),
      };

      const res = await fetch("http://127.0.0.1:8000/ris/add", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.status === "success") {
        alert("✅ RIS added successfully!");
        if (onSuccess) onSuccess();
        onClose();
      } else {
        alert(`❌ Failed to save RIS: ${data.message || "Unknown error"}`);
      }
    } catch (err) {
      console.error("Error saving RIS:", err);
      alert("❌ An error occurred while saving RIS.");
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/50 z-50">
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 border border-gray-200">
        <div className="flex justify-between items-center border-b pb-3 mb-5">
          <h2 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
            Add RIS
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold cursor-pointer">
            &times;
          </button>
        </div>

        <div className="space-y-5 max-h-[400px] overflow-y-auto pr-1">
          {rows.map((row, index) => (
            <div
              key={`row-${index}`}
              className="relative bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Item
                  </label>
                  <Select
                    options={items}
                    placeholder="Select Item"
                    value={
                      row.itemName
                        ? items.find((opt) => opt.value === row.itemName)
                        : null
                    }
                    onChange={(selected) =>
                      handleRowChange(index, "itemName", selected?.value || "")
                    }
                    classNamePrefix="react-select"
                    styles={{
                      control: (base, state) => ({
                        ...base,
                        borderColor: errors[`itemName-${index}`]
                          ? "#EF4444"
                          : state.isFocused
                          ? "#60A5FA"
                          : "black",
                        boxShadow: "none",
                        fontSize: "0.875rem",
                      }),
                    }}
                  />
                  {errors[`itemName-${index}`] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[`itemName-${index}`]}
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Quantity
                  </label>
                  <input
                    type="number"
                    placeholder="Enter quantity"
                    value={row.quantity}
                    onChange={(e) =>
                      handleRowChange(index, "quantity", e.target.value)
                    }
                    className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none ${
                      errors[`quantity-${index}`]
                        ? "border-red-500"
                        : "focus:ring focus:ring-blue-200"
                    }`}
                  />
                  {errors[`quantity-${index}`] && (
                    <p className="text-red-500 text-xs mt-1">
                      {errors[`quantity-${index}`]}
                    </p>
                  )}
                </div>

                {index === 0 && (
                  <div>
                    <label className="text-sm font-medium text-gray-700">
                      Order By
                    </label>
                    <input
                      type="text"
                      placeholder="Enter order by"
                      value={row.orderBy}
                      onChange={(e) =>
                        handleRowChange(index, "orderBy", e.target.value)
                      }
                      className={`w-full border rounded-lg px-3 py-2 text-sm focus:outline-none ${
                        errors[`orderBy-${index}`]
                          ? "border-red-500"
                          : "focus:ring focus:ring-blue-200"
                      }`}
                    />
                    {errors[`orderBy-${index}`] && (
                      <p className="text-red-500 text-xs mt-1">
                        {errors[`orderBy-${index}`]}
                      </p>
                    )}
                  </div>
                )}
              </div>

              {index > 0 && (
                <button
                  onClick={() => removeRow(index)}
                  className="absolute top-2 right-2 text-red-500 hover:text-red-700 text-lg font-bold">
                  <MdClose />
                </button>
              )}
            </div>
          ))}
        </div>

        <button
          onClick={addRow}
          className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm font-medium">
          + Add Another Item
        </button>

        <div className="flex justify-end gap-2 mt-5">
          <button
            onClick={onClose}
            className="px-4 py-2 text-sm rounded-lg bg-gray-200 hover:bg-gray-300">
            Cancel
          </button>
          <button
            onClick={handleSave}
            className="px-4 py-2 text-sm rounded-lg bg-green-700 text-white hover:bg-green-800">
            Save
          </button>
        </div>
      </div>
    </div>
  );
}

export default RISModal;
