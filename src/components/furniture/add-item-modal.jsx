"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

export default function AddItemModal({
  isOpen,
  onClose,
  onAdd,
  categories,
  selectedCategory,
}) {
  const [newItem, setNewItem] = useState({
    category: selectedCategory || "TABLE",
    image: "/placeholder.svg?height=150&width=200",
    quantityRemaining: 1,
  });

  // Update the form when the selected category changes
  useEffect(() => {
    if (selectedCategory) {
      setNewItem((prev) => ({ ...prev, category: selectedCategory }));
    }
  }, [selectedCategory]);

  if (!isOpen) return null;

  const handleSubmit = (e) => {
    e.preventDefault();
    onAdd(newItem);
    // Reset form
    setNewItem({
      category: selectedCategory || "TABLE",
      image: "/placeholder.svg?height=150&width=200",
      quantityRemaining: 1,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-bold">Add New Item</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
         

          <div>
            <label className="block mb-1 font-medium">Image URL</label>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              value={newItem.image}
              onChange={(e) =>
                setNewItem({ ...newItem, image: e.target.value })
              }
              placeholder="Image URL"
            />
          </div>

          <div>
            <label className="block mb-1 font-medium">Quantity</label>
            <input
              type="number"
              className="w-full p-2 border rounded-md"
              value={newItem.quantityRemaining}
              onChange={(e) =>
                setNewItem({
                  ...newItem,
                  quantityRemaining: Number.parseInt(e.target.value) || 0,
                })
              }
              min="0"
            />
          </div>

          <div className="flex justify-end gap-2 pt-2">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            >
              Add Item
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
