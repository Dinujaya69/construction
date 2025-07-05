"use client";

import { useState, useEffect } from "react";
import { useAuth } from "@/context/AuthContext";
import axios from "axios";
import BASE_URL from "@/API/config";
import { motion } from "framer-motion";
import { AlertCircle } from "lucide-react";

import CategoryButtons from "./category-buttons";
import ItemsGrid from "./items-grid";
import AddItemModal from "./add-item-modal";
import AddSubItemModal from "./add-subitem-modal";
import EditItemModal from "./edit-item-modal";
import DeleteConfirmationModal from "./delete-confirmation-modal";
import LoadingSpinner from "./loading-spinner";

export default function FurnitureInventory() {
  const { user } = useAuth();
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddSubModalOpen, setIsAddSubModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentItem, setCurrentItem] = useState(null);
  const [currentFurniture, setCurrentFurniture] = useState(null);
  const [itemToDelete, setItemToDelete] = useState(null);

  useEffect(() => {
    fetchFurniture();
  }, []);

  const fetchFurniture = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await axios.get(`${BASE_URL}/furniture`);
      const allItems = response.data.data;
      const uniqueCategories = allItems.map((item) => item.name);
      setCategories(uniqueCategories);
      setItems(allItems);
    } catch (error) {
      setError("Failed to load furniture data. Please try again later.");
      console.error("Error fetching furniture:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleAddCategory = async (newCategory) => {
    try {
      setLoading(true);
      const response = await axios.post(`${BASE_URL}/furniture`, {
        name: newCategory.name,
      });
      setCategories([...categories, newCategory.name]);
      setItems([...items, response.data.data]);
      setIsAddModalOpen(false);
      setSelectedCategory(newCategory.name);
    } catch (error) {
      setError("Failed to add category. Please try again.");
      console.error("Error adding category:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddSubItem = async (newSubItem, tempItem = null) => {
    try {
      const furniture = items.find((item) => item.name === selectedCategory);
      if (!furniture) throw new Error("Category not found");

      // If we have a temporary item for optimistic UI update
      if (tempItem) {
        // Create a copy of the items array with the temporary item added
        const updatedItemsOptimistic = items.map((item) => {
          if (item._id === furniture._id) {
            return {
              ...item,
              subFurniture: [...item.subFurniture, tempItem],
            };
          }
          return item;
        });

        // Update the UI immediately with the optimistic data
        setItems(updatedItemsOptimistic);
      }

      const formData = new FormData();
      formData.append("subFurnitureName", newSubItem.subFurnitureName);
      formData.append("subFurniturePrice", newSubItem.subFurniturePrice);
      formData.append("subFurnitureQuantity", newSubItem.subFurnitureQuantity);

      // Append the actual file object to FormData
      if (newSubItem.subFurnitureImage) {
        formData.append("subFurnitureImage", newSubItem.subFurnitureImage);
      }

      const response = await axios.post(
        `${BASE_URL}/furniture/${furniture._id}/subFurniture`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Update with the actual data from the server
      const updatedItems = items.map((item) => {
        if (item._id === furniture._id) {
          return response.data.data;
        }
        return item;
      });

      setItems(updatedItems);
      setIsAddSubModalOpen(false);
    } catch (error) {
      // If there was an error, we need to remove the optimistic update
      if (tempItem) {
        const furniture = items.find((item) => item.name === selectedCategory);
        const updatedItems = items.map((item) => {
          if (item._id === furniture._id) {
            return {
              ...item,
              subFurniture: item.subFurniture.filter(
                (subItem) => subItem.subFurnitureID !== tempItem.subFurnitureID
              ),
            };
          }
          return item;
        });
        setItems(updatedItems);
      }

      setError("Failed to add sub-item. Please try again.");
      console.error(
        "Error adding sub-item:",
        error.response?.data || error.message
      );

      // Re-throw the error so the modal can handle it
      throw error;
    }
  };

  const handleEditItem = (furniture, item) => {
    setCurrentFurniture(furniture);
    setCurrentItem(item);
    setIsEditModalOpen(true);
  };

  const handleUpdateItem = async (updatedItem) => {
    try {
      setLoading(true);
      const formData = new FormData();
      Object.entries(updatedItem).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          formData.append(key, value);
        }
      });

      const response = await axios.put(
        `${BASE_URL}/furniture/${currentFurniture._id}/subFurniture/${currentItem.subFurnitureID}`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      const updatedItems = items.map((f) => {
        if (f._id === currentFurniture._id) {
          return response.data.data;
        }
        return f;
      });

      setItems(updatedItems);
      setIsEditModalOpen(false);
    } catch (error) {
      setError("Failed to update item. Please try again.");
      console.error(
        "Error updating item:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteClick = (furniture, item) => {
    setCurrentFurniture(furniture);
    setItemToDelete(item);
    setIsDeleteModalOpen(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(
        `${BASE_URL}/furniture/${currentFurniture._id}/subFurniture/${itemToDelete.subFurnitureID}`
      );

      const updatedItems = items.map((f) => {
        if (f._id === currentFurniture._id) {
          return {
            ...f,
            subFurniture: f.subFurniture.filter(
              (item) => item.subFurnitureID !== itemToDelete.subFurnitureID
            ),
          };
        }
        return f;
      });

      setItems(updatedItems);
      setIsDeleteModalOpen(false);
    } catch (error) {
      setError("Failed to delete item. Please try again.");
      console.error(
        "Error deleting item:",
        error.response?.data || error.message
      );
    } finally {
      setLoading(false);
    }
  };

  const filteredItems = selectedCategory
    ? items.filter((item) => item.name === selectedCategory)
    : [];

  if (loading && items.length === 0) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 border-l-4 border-red-500 p-4 rounded-lg flex items-start gap-3"
        >
          <AlertCircle className="w-6 h-6 text-red-500 flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-medium text-red-800">Error</h3>
            <p className="text-red-700">{error}</p>
            <button
              onClick={fetchFurniture}
              className="mt-2 px-4 py-2 bg-red-100 text-red-800 rounded-md hover:bg-red-200 transition-colors font-medium text-sm"
            >
              Try Again
            </button>
          </div>
        </motion.div>
      )}

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <CategoryButtons
          categories={categories}
          selectedCategory={selectedCategory}
          onCategoryClick={handleCategoryClick}
          onAddClick={() => setIsAddModalOpen(true)}
        />
      </motion.div>

      {selectedCategory && (
        <ItemsGrid
          category={selectedCategory}
          items={filteredItems.length > 0 ? filteredItems[0].subFurniture : []}
          furniture={filteredItems.length > 0 ? filteredItems[0] : null}
          onAddClick={() => setIsAddSubModalOpen(true)}
          onEditClick={handleEditItem}
          onDeleteClick={handleDeleteClick}
        />
      )}

      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddCategory}
      />

      <AddSubItemModal
        isOpen={isAddSubModalOpen}
        onClose={() => setIsAddSubModalOpen(false)}
        onAdd={handleAddSubItem}
        furnitureId={filteredItems.length > 0 ? filteredItems[0]._id : null}
      />

      <EditItemModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onUpdate={handleUpdateItem}
        item={currentItem}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleConfirmDelete}
        itemName={itemToDelete?.subFurnitureName || "this item"}
      />
    </div>
  );
}
