"use client";

import Image from "next/image";
import { Plus, Edit, Trash2 } from "lucide-react";
import { motion } from "framer-motion";

export default function ItemsGrid({
  category,
  items,
  furniture,
  onAddClick,
  onEditClick,
  onDeleteClick,
}) {
  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  };

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6 p-6 bg-white rounded-xl shadow-lg border border-gray-100"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-800">
          <span className="text-blue-600">{category}</span> Items
        </h2>
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={onAddClick}
          className="flex items-center gap-2 bg-gradient-to-r from-emerald-500 to-emerald-700 text-white font-semibold px-4 py-2 rounded-lg transition-all shadow-md"
        >
          <Plus className="w-5 h-5" /> Add Item
        </motion.button>
      </div>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-gray-500">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="mb-4 p-4 rounded-full bg-gray-100"
          >
            <Plus className="w-12 h-12 text-gray-400" />
          </motion.div>
          <p className="text-lg">No items yet. Add your first item!</p>
        </div>
      ) : (
        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {items.map((item) => (
            <motion.div
              key={item.subFurnitureID}
              variants={item}
              whileHover={{ y: -5 }}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all border border-gray-100"
            >
              <div className="relative">
                <div className="w-full h-[200px] bg-gray-100 overflow-hidden">
                  <Image
                    src={
                      item.subFurnitureImage ||
                      "/placeholder.svg?height=200&width=300"
                    }
                    alt={`${item.subFurnitureName}`}
                    width={300}
                    height={200}
                    className="w-full h-full object-cover transition-transform hover:scale-105"
                  />
                </div>
                <div className="absolute top-2 right-2 flex gap-2">
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onEditClick(furniture, item)}
                    className="p-2 bg-white text-blue-600 rounded-full shadow-md hover:bg-blue-50"
                  >
                    <Edit className="w-4 h-4" />
                  </motion.button>
                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => onDeleteClick(furniture, item)}
                    className="p-2 bg-white text-red-600 rounded-full shadow-md hover:bg-red-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </motion.button>
                </div>
              </div>
              <div className="p-4 space-y-2">
                <h3 className="font-semibold text-gray-800 text-lg">
                  {item.subFurnitureName}
                </h3>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">
                    Qty: {item.subFurnitureQuantity}
                  </span>
                  <span className="font-bold text-emerald-600">
                    ${item.subFurniturePrice?.toFixed(2) || "0.00"}
                  </span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}
    </motion.div>
  );
}
