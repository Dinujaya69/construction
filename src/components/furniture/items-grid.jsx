"use client";

import Image from "next/image";
import { Plus } from "lucide-react";

export default function ItemsGrid({ category, items, onAddClick }) {
  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-blue-800">{category}</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {items.map((item) => (
          <div key={item.id} className="space-y-2">
            <div className="bg-emerald-400 rounded-lg overflow-hidden">
              <Image
                src={item.image || "/placeholder.svg"}
                alt={`${category} ${item.id}`}
                width={200}
                height={150}
                className="w-full h-auto object-cover"
              />
            </div>
            <div className="space-y-1">
              <p className="font-medium">{item.id}</p>
              <p>Quantity Remaining</p>
              <p className="font-bold">{item.quantityRemaining}</p>
            </div>
          </div>
        ))}
      </div>

      <button
        onClick={onAddClick}
        className="flex items-center gap-2 bg-emerald-400 hover:bg-emerald-500 text-white font-medium px-6 py-3 rounded-full transition-colors"
      >
        <Plus className="w-5 h-5" /> ADD
      </button>
    </div>
  );
}
