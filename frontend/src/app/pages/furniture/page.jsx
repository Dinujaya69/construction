// import FurnitureInventory from "@/components/furniture/furniture-inventory";
// import MainLayout from "@/components/MainLayout/MainLayout";

// export default function Home() {
//   return (
//     <MainLayout>
//       <main className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-gray-50 to-white">
//         <div className="max-w-7xl mx-auto">
//           <header className="mb-8">
//             <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-emerald-600">
//               Furniture Inventory Management
//             </h1>
//             <p className="text-gray-600 max-w-3xl">
//               Easily manage your furniture inventory. Add categories, items, and
//               keep track of quantities and prices.
//             </p>
//           </header>
//           <FurnitureInventory />
//         </div>
//       </main>
//     </MainLayout>
//   );
// }

// components/ResponsiveTable.tsx
export default function ResponsiveTable() {
  return (
    <div className="overflow-x-auto w-full">
      <table className="min-w-full table-auto text-sm text-left text-gray-700">
        <thead className="bg-gray-100 text-xs uppercase text-gray-600">
          <tr>
            <th className="px-4 py-3">Name</th>
            <th className="px-4 py-3">Email</th>
            <th className="px-4 py-3">Role</th>
            <th className="px-4 py-3">Status</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          <tr>
            <td className="px-4 py-3">John Doe</td>
            <td className="px-4 py-3">john@example.com</td>
            <td className="px-4 py-3">Admin</td>
            <td className="px-4 py-3 text-green-600 font-semibold">Active</td>
          </tr>
          <tr>
            <td className="px-4 py-3">Jane Smith</td>
            <td className="px-4 py-3">jane@example.com</td>
            <td className="px-4 py-3">Editor</td>
            <td className="px-4 py-3 text-yellow-500 font-semibold">Pending</td>
          </tr>
          {/* Add more rows as needed */}
        </tbody>
      </table>
    </div>
  );
}

