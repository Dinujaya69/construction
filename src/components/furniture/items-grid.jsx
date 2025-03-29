"use client";

import Image from "next/image";
import { Plus } from "lucide-react";

export default function ItemsGrid({ category, items, onAddClick }) {
  return (
    <div className="space-y-6 p-4 bg-gray-100 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-blue-800 border-b-2 border-blue-500 pb-2">
        {category}
      </h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <div
            key={item.id}
            className="space-y-2 bg-white p-4 rounded-lg shadow-md"
          >
            <div className="bg-emerald-400 rounded-lg overflow-hidden w-[250px] h-[180px] flex items-center justify-center">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={`${category} ${item.id}`}
                width={250}
                height={180}
                className="w-full h-full object-cover"
              />
            </div>
            <div className="space-y-1 text-center">
              <p className="font-medium text-gray-700">{item.id}</p>
              <p className="text-gray-600">Quantity Remaining</p>
              <p className="font-bold text-lg text-gray-900">
                {item.quantityRemaining}
              </p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onAddClick}
        className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white font-semibold px-6 py-3 rounded-full transition-all shadow-md hover:shadow-lg"
      >
        <Plus className="w-5 h-5" /> ADD
      </button>
    </div>
  );
}
