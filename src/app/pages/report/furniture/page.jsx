"use client";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import FurnitureReport from "./FurnitureReport";
import ReportsDashboard from "./ReportsDashboard";
import MainLayout from "@/components/MainLayout/MainLayout";

export default function ReportsPage() {
  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50">
        <Tabs defaultValue="daily-report" className="w-full">
          <div className="border-b bg-white">
            <div className="container mx-auto">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="daily-report">Daily Report</TabsTrigger>
                <TabsTrigger value="dashboard">Dashboard</TabsTrigger>
              </TabsList>
            </div>
          </div>

          <TabsContent value="daily-report" className="mt-0">
            <FurnitureReport />
          </TabsContent>

          <TabsContent value="dashboard" className="mt-0">
            <ReportsDashboard />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
}
