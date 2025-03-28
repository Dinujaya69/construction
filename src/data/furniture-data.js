// Initial furniture data
export const categories = [
  "TABLE",
  "CHAIR",
  "WINDOWS",
  "CUPBOARD",
  "TV Console",
  "OTHER",
];

export const initialItems = [
  {
    id: "T001",
    category: "TABLE",
    image: "/placeholder.svg?height=150&width=200",
    quantityRemaining: 5,
  },
  {
    id: "T002",
    category: "TABLE",
    image: "/placeholder.svg?height=150&width=200",
    quantityRemaining: 3,
  },
  {
    id: "T003",
    category: "TABLE",
    image: "/placeholder.svg?height=150&width=200",
    quantityRemaining: 7,
  },
  {
    id: "T004",
    category: "TABLE",
    image: "/placeholder.svg?height=150&width=200",
    quantityRemaining: 2,
  },
  {
    id: "C001",
    category: "CHAIR",
    image: "/placeholder.svg?height=150&width=200",
    quantityRemaining: 10,
  },
  {
    id: "C002",
    category: "CHAIR",
    image: "/placeholder.svg?height=150&width=200",
    quantityRemaining: 8,
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

// Helper function to generate new ID
export function generateNewId(category, existingItems) {
  // Get prefix from category (first letter or first letter + first letter of second word)
  const prefix =
    category.charAt(0) +
    (category.includes(" ") ? category.split(" ")[1].charAt(0) : "");

  // Filter existing items by category and extract their numeric IDs
  const existingIds = existingItems
    .filter((item) => item.category === category)
    .map((item) => Number.parseInt(item.id.substring(prefix.length)));

  // Get the next ID number
  const nextId = existingIds.length > 0 ? Math.max(...existingIds) + 1 : 1;

  // Format the ID with leading zeros
  return `${prefix}${String(nextId).padStart(3, "0")}`;
}
