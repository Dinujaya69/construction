"use client";

import { useState } from "react";
import CategoryButtons from "./category-buttons";
import ItemsGrid from "./items-grid";
import AddItemModal from "./add-item-modal";
import { initialItems, categories, generateNewId } from "@/data/furniture-data";

export default function FurnitureInventory() {
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [items, setItems] = useState(initialItems);

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
  };

  const handleAddItem = (newItem) => {
    // Generate a new ID based on category
    const id = generateNewId(newItem.category, items);

    // Add the new item to the items array
    setItems([...items, { ...newItem, id }]);
    setIsAddModalOpen(false);
  };

  // Filter items by selected category
  const filteredItems = selectedCategory
    ? items.filter((item) => item.category === selectedCategory)
    : [];

  return (
    <div className="space-y-8">
      <CategoryButtons
        selectedCategory={selectedCategory}
        onCategoryClick={handleCategoryClick}
        onAddClick={() => setIsAddModalOpen(true)}
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
    </div>
  );
}
