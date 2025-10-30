import React from "react";

function DeleteItem({ isOpen, onClose, onConfirm, item }) {
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-opacity-50 z-50">
      <div className="bg-white p-6 rounded-xl shadow-lg w-[350px] text-center">
        <h2 className="text-lg font-semibold text-gray-800 mb-3">
          Confirm Delete
        </h2>
        <p className="text-sm text-gray-600 mb-6">
          Are you sure you want to delete{" "}
          <span className="font-semibold text-red-600">
            {item?.ProductName}
          </span>
          ?
        </p>
        <div className="flex justify-center gap-3">
          <button
            onClick={onClose}
            className="bg-gray-300 hover:bg-gray-400 text-gray-800 px-4 py-2 rounded-lg transition">
            Cancel
          </button>
          <button
            onClick={onConfirm}
            className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition">
            Yes, Delete
          </button>
        </div>
      </div>
    </div>
  );
}

export default DeleteItem;
