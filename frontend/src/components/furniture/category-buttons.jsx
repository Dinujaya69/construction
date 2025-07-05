"use client";

import { Plus } from "lucide-react";
import { motion } from "framer-motion";

export default function CategoryButtons({
  categories,
  selectedCategory,
  onCategoryClick,
  onAddClick,
}) {
  return (
    <div className="py-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">Categories</h2>
      <div className="flex flex-wrap gap-4 md:gap-6">
        {categories.map((category, index) => (
          <motion.button
            key={category}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: index * 0.1 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`px-8 py-6 rounded-xl text-white font-bold min-w-[180px] shadow-lg transition-all ${
              selectedCategory === category
                ? "bg-gradient-to-r from-blue-600 to-blue-800 ring-4 ring-blue-300"
                : "bg-gradient-to-r from-blue-500 to-blue-700 hover:from-blue-600 hover:to-blue-800"
            }`}
            onClick={() => onCategoryClick(category)}
          >
            {category}
          </motion.button>
        ))}
        <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: categories.length * 0.1 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="px-8 py-6 rounded-xl bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-bold min-w-[180px] shadow-lg flex items-center justify-center gap-2"
          onClick={onAddClick}
        >
          <Plus className="w-6 h-6" />
          <span>Add New</span>
        </motion.button>
      </div>
    </div>
  );
}
