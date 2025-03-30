"use client";

import { useState } from "react";
import CategoryButtons from "./category-buttons";
import ItemsGrid from "./items-grid";
import AddItemModal from "./add-item-modal";
import {
  initialItems,
  categories as initialCategories,
  generateNewId,
} from "@/data/furniture-data";

export default function FurnitureInventory() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isAddCategoryModalOpen, setIsAddCategoryModalOpen] = useState(false);
  const [items, setItems] = useState(initialItems);
  const [categories, setCategories] = useState(initialCategories);
  const [newCategory, setNewCategory] = useState("");

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleAddItem = (newItem) => {
    const id = generateNewId(newItem.category, items);
    setItems([...items, { ...newItem, id }]);
    setIsAddModalOpen(false);
  };

  const handleAddCategory = () => {
    if (newCategory && !categories.includes(newCategory)) {
      setCategories([...categories, newCategory]);
    }
    setNewCategory("");
    setIsAddCategoryModalOpen(false);
  };

  const filteredItems = selectedCategory
    ? items.filter((item) => item.category === selectedCategory)
    : [];

  return (
    <div className="space-y-8">
      <CategoryButtons
        categories={categories}
        selectedCategory={selectedCategory}
        onCategoryClick={handleCategoryClick}
        onAddClick={() => setIsAddCategoryModalOpen(true)}
      />

      {selectedCategory && (
        <ItemsGrid
          category={selectedCategory}
          items={filteredItems}
          onAddClick={() => setIsAddModalOpen(true)}
        />
      )}

      <AddItemModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddItem}
        categories={categories}
        selectedCategory={selectedCategory}
      />

      {isAddCategoryModalOpen && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold">Add New Category</h2>
              <button
                onClick={() => setIsAddCategoryModalOpen(false)}
                className="text-gray-500 hover:text-gray-700"
              >
                ✖
              </button>
            </div>
            <input
              type="text"
              className="w-full p-2 border rounded-md"
              placeholder="Enter category name"
              value={newCategory}
              onChange={(e) => setNewCategory(e.target.value)}
            />
            <div className="flex justify-end gap-2 pt-2">
              <button
                type="button"
                onClick={() => setIsAddCategoryModalOpen(false)}
                className="px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
              >
                Add
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
