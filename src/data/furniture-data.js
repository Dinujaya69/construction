// Assuming you're using React
import React from "react";
import TBL1 from "@/assets/table/coffee table.png";
import TBL2 from "@/assets/table/bed side table.png";
import TBL3 from "@/assets/table/console table.png";
import TBL4 from "@/assets/table/dining table.png";
import TBL5 from "@/assets/table/end table.png";

import CHR1 from "@/assets/chair/office chare.png";
import CHR2 from "@/assets/chair/stool chair.png";
import CHR3 from "@/assets/chair/wood desk chir 3.png";

export const initialItems = [
  {
    id: "T001",
    category: "TABLE",
    image: TBL1,
    quantityRemaining: 5,
  },
  {
    id: "T002",
    category: "TABLE",
    image: TBL2,
    quantityRemaining: 3,
  },
  {
    id: "T003",
    category: "TABLE",
    image: TBL3,
    quantityRemaining: 7,
  },
  {
    id: "T004",
    category: "TABLE",
    image: TBL4,
    quantityRemaining: 2,
  },
  {
    id: "T005",
    category: "TABLE",
    image: TBL5,
    quantityRemaining: 4,
  },
  {
    id: "C001",
    category: "CHAIR",
    image: CHR1,
    quantityRemaining: 10,
  },
  {
    id: "C002",
    category: "CHAIR",
    image: CHR2,
    quantityRemaining: 8,
  },
  {
    id: "C003",
    category: "CHAIR",
    image: CHR3,
    quantityRemaining: 6,
  },
  {
    id: "W001",
    category: "WINDOWS",
    image: "/placeholder.svg?height=150&width=200",
    quantityRemaining: 4,
  },
  {
    id: "CB001",
    category: "CUPBOARD",
    image: "/placeholder.svg?height=150&width=200",
    quantityRemaining: 6,
  },
  {
    id: "TV001",
    category: "TV Console",
    image: "/placeholder.svg?height=150&width=200",
    quantityRemaining: 3,
  },
];

// Example of how to render the items
function ProductList() {
  return (
    <div>
      {initialItems.map((item) => (
        <div key={item.id}>
          <h2>{item.category}</h2>
          <img src={item.image} alt={item.category} width="200" height="150" />
          <p>Quantity Remaining: {item.quantityRemaining}</p>
        </div>
      ))}
    </div>
  );
}

export default ProductList;
