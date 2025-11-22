import React, { useState, useEffect } from "react";
import Select from "react-select";
import { MdClose } from "react-icons/md";

function RISModal({ isAddOpen, onClose, onSuccess }) {
  const containerClass = `fixed inset-0 flex items-center justify-center bg-black/50 z-50 ${
    !isAddOpen ? "hidden" : ""
  }`;

  const [items, setItems] = useState([]);
  const [rows, setRows] = useState([
    { itemName: "", quantity: "", orderBy: "", stockQty: 0 },
  ]);
  const [errors, setErrors] = useState({});
  const [showList, setShowList] = useState(false);

  useEffect(() => {
    fetch("http://127.0.0.1:8000/item/select-list")
      .then((res) => res.json())
      .then((data) => {
        if (data.status === "success" && Array.isArray(data.data)) {
          const formatted = data.data.map((item) => ({
            value: item.value,
            label: item.label,
            StockQty: item.StockQty ?? 0,
          }));
          setItems(formatted);
        }
      })
      .catch((err) => console.error("Error fetching items:", err));
  }, []);

  const handleRowChange = (index, field, value) => {
    const updated = [...rows];
    updated[index][field] = value;

    if (field === "itemName") {
      const selected = items.find((i) => i.value === value);
      updated[index].stockQty = selected ? selected.StockQty : 0;
    }

    if (field === "quantity") {
      const qty = parseInt(value) || 0;
      const stock = updated[index].stockQty || 0;
      if (qty > stock) {
        setErrors((prev) => ({
          ...prev,
          [`quantity-${index}`]: `Not enough stock. Available: ${stock}`,
        }));
      } else {
        const newErrors = { ...errors };
        delete newErrors[`quantity-${index}`];
        setErrors(newErrors);
      }
    }

    setRows(updated);
  };

  const addRow = () => {
    setRows([
      ...rows,
      { itemName: "", quantity: "", orderBy: "", stockQty: 0 },
    ]);
  };

  const removeRow = (index) => {
    setRows(rows.filter((_, i) => i !== index));
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

    const payload = {
      order_by: rows[0].orderBy,
      items: rows.map((r) => ({
        item_id: r.itemName,
        quantity: parseInt(r.quantity),
      })),
    };

    try {
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

  const handleCancel = () => {
    // reset form state
    setRows([{ itemName: "", quantity: "", orderBy: "", stockQty: 0 }]);
    setErrors({});
    setShowList(false);
    // call parent onClose to hide modal
    if (onClose) onClose();
  };

  return (
    <div className={containerClass}>
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6 border border-gray-200 max-h-[90vh] flex flex-col">
        <div className="flex justify-between items-center border-b pb-3 mb-5">
          <h2 className="text-lg font-semibold text-gray-800">Add RIS</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700 text-2xl font-bold cursor-pointer">
            &times;
          </button>
        </div>
        <div className="flex-1 overflow-y-auto pr-1 space-y-5">
          {rows.map((row, index) => (
            <div
              key={index}
              className="relative bg-gray-50 p-4 rounded-xl border border-gray-200 shadow-sm">
              <div className="grid grid-cols-1 gap-3">
                <div>
                  <label className="text-sm font-medium text-gray-700">
                    Item
                  </label>
                  <Select
                    options={items.map((i) => ({
                      value: i.value,
                      label: `${i.label} (Stock: ${i.StockQty})`,
                    }))}
                    value={
                      row.itemName
                        ? items.find((opt) => opt.value === row.itemName)
                        : null
                    }
                    onChange={(selected) =>
                      handleRowChange(index, "itemName", selected?.value || "")
                    }
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
          <button
            onClick={addRow}
            className="mt-4 w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 text-sm font-medium">
            + Add Another Item
          </button>

          <div className="mt-3">
            <button
              onClick={() => setShowList((s) => !s)}
              className="w-full mb-2 border border-gray-300 rounded-lg py-2 text-sm bg-white hover:bg-gray-50">
              {showList ? "Hide Entered Items" : "Show Entered Items"}
            </button>

            {showList && (
              <div className="p-3 border rounded-lg bg-gray-50 max-h-48 overflow-y-auto">
                <table className="min-w-full text-sm">
                  <thead>
                    <tr className="text-left text-xs text-gray-600">
                      <th className="pb-2">#</th>
                      <th className="pb-2">Item</th>
                      <th className="pb-2">Quantity</th>
                      <th className="pb-2">Order By</th>
                      <th className="pb-2">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((r, i) => {
                      const itemLabel = items.find((it) => it.value === r.itemName)?.label || r.itemName || "-";
                      return (
                        <tr key={i} className="border-t">
                          <td className="py-2 pr-3">{i + 1}</td>
                          <td className="py-2 pr-3">{itemLabel}</td>
                          <td className="py-2 pr-3">{r.quantity || "-"}</td>
                          <td className="py-2 pr-3">{i === 0 ? r.orderBy || "-" : "-"}</td>
                          <td className="py-2 pr-3">
                            <button
                              onClick={() => {
                                if (confirm("Remove this item from the list?")) removeRow(i);
                              }}
                              className="text-red-600 hover:text-red-800 px-2 py-1 rounded-md text-sm">
                              Delete
                            </button>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>

        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={handleCancel}
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
