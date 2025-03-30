import FurnitureInventory from "@/components/furniture/furniture-inventory";
import MainLayout from "@/components/MainLayout/MainLayout";

export default function Home() {
  return (
    <MainLayout>
    <main className="min-h-screen p-4 md:p-8">
      <h1 className="text-2xl font-bold mb-6">
        Furniture Inventory Management
      </h1>
      <FurnitureInventory />
    </main>
    </MainLayout>
  );
}
