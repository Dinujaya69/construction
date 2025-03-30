import { Plus } from "lucide-react";
import React from "react";

export default function CategoryButtons({
  categories,
  selectedCategory,
  onCategoryClick,
  onAddClick,
}) {
  return (
    <div className="flex flex-wrap gap-8 justify-center">
      {categories.map((category) => (
        <button
          key={category}
          className={`px-16 py-12 rounded-3xl text-white font-bold min-w-[200px] min-h-[160px] text-2xl transition-all shadow-2xl ${
            selectedCategory === category
              ? "bg-blue-700 scale-105"
              : "bg-blue-500 hover:bg-blue-600 hover:scale-105"
          }`}
          onClick={() => onCategoryClick(category)}
        >
          {category}
        </button>
      ))}
      <button
        className="px-16 py-12 rounded-3xl bg-blue-500 hover:bg-blue-600 text-white font-bold min-w-[200px] min-h-[160px] flex items-center justify-center shadow-2xl hover:scale-105 transition-all"
        onClick={onAddClick}
      >
        <Plus className="w-12 h-12" />
      </button>
    </div>
  );
}
