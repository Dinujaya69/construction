"use client";

import { useState, useRef } from "react";
import { X, Upload, Loader2, Check } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AddSubItemModal({
  isOpen,
  onClose,
  onAdd,
  furnitureId,
}) {
  const [newSubItem, setNewSubItem] = useState({
    subFurnitureName: "",
    subFurniturePrice: 0,
    subFurnitureQuantity: 1,
    subFurnitureImage: null,
  });
  const [imagePreview, setImagePreview] = useState("");
  const [isDragging, setIsDragging] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [saveStatus, setSaveStatus] = useState(null); // null, 'saving', 'success', 'error'
  const fileInputRef = useRef(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview URL
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      // Update form state with the file object
      setNewSubItem((prev) => ({
        ...prev,
        subFurnitureImage: file,
      }));
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
      const previewUrl = URL.createObjectURL(file);
      setImagePreview(previewUrl);

      setNewSubItem((prev) => ({
        ...prev,
        subFurnitureImage: file,
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!newSubItem.subFurnitureImage) {
      alert("Please select an image");
      return;
    }

    setIsSubmitting(true);
    setSaveStatus("saving");

    try {
      // Create a temporary ID for optimistic UI update
      const tempItem = {
        ...newSubItem,
        subFurnitureID: `temp-${Date.now()}`,
        subFurnitureImage: imagePreview, // Use the preview URL for immediate display
      };

      // Pass the temporary item for optimistic UI update
      await onAdd(newSubItem, tempItem);

      // Show success state
      setSaveStatus("success");

      // Reset form after a short delay to show success state
      setTimeout(() => {
        resetForm();
        onClose();
      }, 1000);
    } catch (error) {
      console.error("Error adding item:", error);
      setSaveStatus("error");
      // Keep the form open to allow the user to try again
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setNewSubItem({
      subFurnitureName: "",
      subFurniturePrice: 0,
      subFurnitureQuantity: 1,
      subFurnitureImage: null,
    });
    setImagePreview("");
    setIsSubmitting(false);
    setSaveStatus(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleClose = () => {
    // Only allow closing if not currently submitting
    if (!isSubmitting) {
      resetForm();
      onClose();
    }
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
              <h2 className="text-2xl font-bold text-gray-800">Add New Item</h2>
              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={handleClose}
                disabled={isSubmitting}
                className={`text-gray-500 hover:text-gray-700 bg-gray-100 p-2 rounded-full ${
                  isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                }`}
              >
                <X className="w-5 h-5" />
              </motion.button>
            </div>

            {saveStatus === "error" && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 bg-red-50 border-l-4 border-red-500 text-red-700 rounded"
              >
                <p>Failed to save item. Please try again.</p>
              </motion.div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <label className="block mb-2 font-medium text-gray-700">
                  Name
                </label>
                <input
                  type="text"
                  className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                  value={newSubItem.subFurnitureName}
                  onChange={(e) =>
                    setNewSubItem({
                      ...newSubItem,
                      subFurnitureName: e.target.value,
                    })
                  }
                  placeholder="Enter item name"
                  required
                  disabled={isSubmitting}
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
                  } ${isSubmitting ? "opacity-70 pointer-events-none" : ""}`}
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  onClick={() => !isSubmitting && fileInputRef.current?.click()}
                >
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleImageChange}
                    className="hidden"
                    ref={fileInputRef}
                    required
                    disabled={isSubmitting}
                  />

                  {imagePreview ? (
                    <div className="relative">
                      <img
                        src={imagePreview || "/placeholder.svg"}
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
                    value={newSubItem.subFurniturePrice}
                    onChange={(e) =>
                      setNewSubItem({
                        ...newSubItem,
                        subFurniturePrice:
                          Number.parseFloat(e.target.value) || 0,
                      })
                    }
                    min="0"
                    step="0.01"
                    required
                    disabled={isSubmitting}
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium text-gray-700">
                    Quantity
                  </label>
                  <input
                    type="number"
                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all"
                    value={newSubItem.subFurnitureQuantity}
                    onChange={(e) =>
                      setNewSubItem({
                        ...newSubItem,
                        subFurnitureQuantity:
                          Number.parseInt(e.target.value) || 0,
                      })
                    }
                    min="1"
                    required
                    disabled={isSubmitting}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-2">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  type="button"
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className={`px-5 py-2.5 border border-gray-300 rounded-lg hover:bg-gray-50 font-medium transition-all ${
                    isSubmitting ? "opacity-50 cursor-not-allowed" : ""
                  }`}
                >
                  Cancel
                </motion.button>
                <motion.button
                  whileHover={!isSubmitting ? { scale: 1.02 } : {}}
                  whileTap={!isSubmitting ? { scale: 0.98 } : {}}
                  type="submit"
                  disabled={isSubmitting}
                  className={`px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-emerald-700 text-white rounded-lg hover:from-emerald-600 hover:to-emerald-800 font-medium transition-all flex items-center justify-center min-w-[100px] ${
                    isSubmitting ? "opacity-90" : ""
                  }`}
                >
                  {saveStatus === "saving" ? (
                    <>
                      <Loader2 className="w-5 h-5 mr-2 animate-spin" />
                      Saving...
                    </>
                  ) : saveStatus === "success" ? (
                    <>
                      <Check className="w-5 h-5 mr-2" />
                      Added!
                    </>
                  ) : (
                    "Add Item"
                  )}
                </motion.button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
