import React, { useEffect, useState } from "react";

function ViewDashModal({ isOpen, onClose, title, mode, children }) {
  const API_BASE = import.meta.env.VITE_API_BASE || "http://127.0.0.1:8000";
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState([]);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!isOpen) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        if (mode === "stocks") {
          const res = await fetch(`${API_BASE}/item/list`);
          const json = await res.json();
          if (json.status === "success") {
            const mapped = json.data.map((it) => ({
              item_name: it.ProductName || it.label || "",
              quantity: it.StockQty ?? it.stockQty ?? 0,
            }));
            const lowest = mapped
              .sort((a, b) => a.quantity - b.quantity)
              .slice(0, 5);
            setData(lowest);
          } else {
            setData([]);
          }
        } else if (mode === "ris") {
          const res = await fetch(`${API_BASE}/ris/aggregated-items`);
          const json = await res.json();
          if (json.status === "success") {
            const mapped = json.data
              .map((d) => ({ name: d.ProductName, value: d.RequestedQuantity }))
              .slice(0, 5);
            setData(mapped);
          } else {
            setData([]);
          }
        }
      } catch (err) {
        setError(err.message || "Failed to load data");
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [isOpen, mode]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 max-w-full">
        <h2 className="text-xl font-bold mb-4">{title}</h2>

        {loading && <div className="text-sm text-gray-600">Loading...</div>}

        {error && <div className="text-sm text-red-600">{error}</div>}

        {!loading && !error && (
          <div>
            {mode === "stocks" && (
              <ul className="list-disc pl-6 space-y-1">
                {data.length === 0 && <li>No low stock items found.</li>}
                {data.map((item, idx) => (
                  <li key={idx}>
                    {item.item_name} – Qty: {item.quantity}
                  </li>
                ))}
              </ul>
            )}

            {mode === "ris" && (
              <ul className="list-disc pl-6 space-y-1">
                {data.length === 0 && <li>No requested items found.</li>}
                {data.map((it, idx) => (
                  <li key={idx}>
                    {it.name} – Requested: {it.value}
                  </li>
                ))}
              </ul>
            )}

            {/* fallback: render any passed children if present and mode not matched */}
            {!mode && children}
          </div>
        )}

        <div className="mt-4 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded-md">
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewDashModal;
