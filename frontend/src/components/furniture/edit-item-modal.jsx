"use client";

import { useState, useEffect, useRef } from "react";
import { X, Upload } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function EditItemModal({ isOpen, onClose, onUpdate, item }) {
  const [editedItem, setEditedItem] = useState({
    subFurnitureName: "",
    subFurnitureImage: "",
    subFurnitureQuantity: 0,
    subFurniturePrice: 0,
  });
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef(null);

  useEffect(() => {
    if (item) {
      setEditedItem({
        subFurnitureName: item.subFurnitureName || "",
        subFurnitureImage: item.subFurnitureImage || "",
        subFurnitureQuantity: item.subFurnitureQuantity || 0,
        subFurniturePrice: item.subFurniturePrice || 0,
      });
    }
  }, [item]);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setEditedItem({ ...editedItem, subFurnitureImage: imageUrl });
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      const imageUrl = URL.createObjectURL(file);
      setEditedItem({ ...editedItem, subFurnitureImage: imageUrl });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onUpdate(editedItem);
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            className="bg-white rounded-xl p-6 w-full max-w-md shadow-2xl"
          >
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-gray-800">Edit Item</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={onClose}
                className="text-gray-500 hover:text-gray-700 bg-gray-100 p-2 rounded-full"
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={editedItem.subFurnitureName}
                  onChange={(e) =>
                    setEditedItem({
                      ...editedItem,
                      subFurnitureName: e.target.value,
                    })
                  }
                  required
                />
              </div>

              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Image
                </label>
                <div
                  className={`border-2 border-dashed rounded-lg p-4 text-center cursor-pointer transition-all ${
                    isDragging
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-blue-400"
                  }`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    ref={fileInputRef}
                  />

                  {editedItem.subFurnitureImage ? (
                    <div className="relative">
                      <img
                        src={editedItem.subFurnitureImage || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-48 object-contain rounded-md mx-auto"
                      />
                      <p className="text-sm text-gray-500 mt-2">
                        Click or drag to change image
                      </p>
                    </div>
                  ) : (
                    <div className="py-6">
                      <div className="flex justify-center mb-3">
                        <Upload className="h-10 w-10 text-gray-400" />
                      </div>
                      <p className="text-gray-700 font-medium">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-sm text-gray-500 mt-1">
                        SVG, PNG, JPG or GIF
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Price ($)
                  </label>
                  <input
                    type="number"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={editedItem.subFurniturePrice}
                    onChange={(e) =>
                      setEditedItem({
                        ...editedItem,
                        subFurniturePrice:
                          Number.parseFloat(e.target.value) || 0,
                      })
                    }
                    min="0"
                    step="0.01"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Quantity
                  </label>
                  <input
                    type="number"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={editedItem.subFurnitureQuantity}
                    onChange={(e) =>
                      setEditedItem({
                        ...editedItem,
                        subFurnitureQuantity:
                          Number.parseInt(e.target.value) || 0,
                      })
                    }
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={onClose}
                  className="px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-all"
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="submit"
                  className="px-5 py-2.5 bg-gradient-to-r from-blue-500 to-blue-700 text-white rounded-lg hover:from-blue-600 hover:to-blue-800 font-medium transition-all"
                >
                  Update Item
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
