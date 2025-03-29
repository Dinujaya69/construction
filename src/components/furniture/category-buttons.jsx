"use client";

import { Plus } from "lucide-react";
import React from "react";
import { initialItems } from "@/data/furniture-data"; 

export default function CategoryButtons({
  selectedCategory,
  onCategoryClick,
  onAddClick,
}) {
  // Extract unique categories from initialItems, excluding "OTHER"
  const displayCategories = [
    ...new Set(initialItems.map((item) => item.category)),
  ].filter((cat) => cat !== "OTHER");

  return (
    <div className="flex flex-wrap gap-4">
      {displayCategories.map((category) => (
        <button
          key={category}
          className={`px-6 py-4 rounded-md text-white font-medium min-w-[120px] transition-colors ${
            selectedCategory === category
              ? "bg-blue-700"
              : "bg-blue-500 hover:bg-blue-600"
          }`}
          onClick={() => onCategoryClick(category)}
        >
          {category}
        </button>
      ))}
      <button
        className="px-6 py-4 rounded-md bg-blue-500 hover:bg-blue-600 text-white font-medium min-w-[120px] flex items-center justify-center"
        onClick={onAddClick}
      >
        <Plus className="w-5 h-5" />
      </button>
    </div>
  );
}
