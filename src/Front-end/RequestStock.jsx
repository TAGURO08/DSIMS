import React, { useState, useEffect } from "react";

function RequestStock() {
  const [requests, setRequests] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const response = await fetch("/api/stock/requests");
      const data = await response.json();
      if (data.status === "success") {
        setRequests(data.data);
      }
    } catch (error) {
      console.error("Error fetching requests:", error);
    }
  };

  const filteredRequests = requests.filter(
    (req) =>
      req.item_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      req.office_name?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="w-full bg-white rounded-lg shadow-md p-6">
      {/* Header Section */}
      <div className="bg-[#0f2c56] text-white px-6 py-3 rounded-t-lg -mx-6 -mt-6 mb-6 flex justify-between items-center">
        <h1 className="text-lg font-semibold flex items-center gap-2">
          📋 Request List
        </h1>
      </div>

      {/* Search Bar + Export Button */}
      <div className="mb-6 flex items-center justify-between">
        <input
          type="text"
          placeholder="Search item, category, or office..."
          className="border border-gray-300 rounded-md px-4 py-2 w-80 focus:outline-none focus:ring-2 focus:ring-[#0f2c56]"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
        />

        <div className="flex items-center gap-2">
          <button
            onClick={() => window.print()}
            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md text-sm font-medium"
          >
            Export
          </button>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="min-w-full border-collapse border border-gray-300">
          <thead className="bg-gray-100">
            <tr>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Item Name
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Category
              </th>
              <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                Office
              </th>
              <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-700">
                Quantity
              </th>
              <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-700">
                Status
              </th>
              <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-700">
                Date Requested
              </th>
            </tr>
          </thead>

          <tbody>
            {filteredRequests.length > 0 ? (
              filteredRequests.map((req, index) => (
                <tr
                  key={index}
                  className="hover:bg-gray-50 transition duration-150"
                >
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                    {req.item_name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                    {req.category}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-gray-700">
                    {req.office_name}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-center text-gray-700">
                    {req.quantity}
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-center">
                    <span
                      className={`px-2 py-1 rounded text-xs font-medium ${
                        req.status === "Approved"
                          ? "bg-green-100 text-green-700"
                          : req.status === "Pending"
                          ? "bg-yellow-100 text-yellow-700"
                          : "bg-red-100 text-red-700"
                      }`}
                    >
                      {req.status}
                    </span>
                  </td>
                  <td className="border border-gray-300 px-4 py-2 text-sm text-center text-gray-700">
                    {new Date(req.request_date).toLocaleDateString()}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td
                  colSpan="6"
                  className="text-center py-6 text-gray-500 text-sm"
                >
                  No request records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default RequestStock;
