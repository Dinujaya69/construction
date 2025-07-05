 import FurnitureInventory from "@/components/furniture/furniture-inventory";
 import MainLayout from "@/components/MainLayout/MainLayout";

 export default function Home() {
   return (
     <MainLayout>
       <main className="min-h-screen p-4 md:p-8 bg-gradient-to-b from-gray-50 to-white">
         <div className="max-w-7xl mx-auto">
           <header className="mb-8">
             <h1 className="text-3xl md:text-4xl font-bold text-gray-900 mb-2 bg-gradient-to-r from-blue-600 to-emerald-600">
               Furniture Inventory Management
             </h1>
             <p className="text-gray-600 max-w-3xl">
               Easily manage your furniture inventory. Add categories, items, and
               keep track of quantities and prices.
             </p>
           </header>
           <FurnitureInventory />
         </div>
       </main>
     </MainLayout>
   );
 }


