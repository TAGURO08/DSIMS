import React, { useEffect, useState } from "react";

function ViewRISItemsModal({ isOpen, onClose, risId }) {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchItems = async () => {
      if (!isOpen || !risId) return;
      setLoading(true);
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

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black/30 backdrop-blur-[2px] z-40">
      <div className="bg-white w-2/5 p-6 rounded-2xl shadow-2xl relative border border-gray-200">
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
                    Item
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-sm uppercase tracking-wide">
                    Quantity
                  </th>
                  <th className="px-4 py-3 text-center font-medium text-sm uppercase tracking-wide">
                    Supplier
                  </th>
                </tr>
              </thead>

              <tbody>
                {items.map((it, idx) => (
                  <tr
                    key={it.RID_details_id || idx}
                    className={`${
                      idx % 2 === 0 ? "bg-white" : "bg-gray-50"
                    } hover:bg-indigo-50 transition-colors`}>
                    <td className="px-4 py-3 border-t">{it.ProductName}</td>
                    <td className="px-4 py-3 border-t text-center">{it.Qty}</td>
                    <td className="px-4 py-3 border-t text-center">
                      {it.SupplierName ?? "—"}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-red-600 text-white font-medium rounded-lg hover:bg-red-700">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewRISItemsModal;
