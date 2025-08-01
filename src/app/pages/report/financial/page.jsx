"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Calculator } from "lucide-react";
import MainLayout from "@/components/MainLayout/MainLayout";
import { pdf } from "@react-pdf/renderer";
import IncomeStatementPDF from "./IncomeStatementPDF";

export default function IncomeStatement() {
  const [formData, setFormData] = useState({
    projectNo: "",
    revenue: 0,
    constructionCost: 0,
    furnitureCost: 0,
    workerPayments: 0,
    otherCost: 0,
  });

  const handleInputChange = (field, value) => {
    setFormData((prev) => ({
      ...prev,
      [field]: field === "projectNo" ? value : Number.parseFloat(value) || 0,
    }));
  };

  const totalCost =
    formData.constructionCost +
    formData.furnitureCost +
    formData.workerPayments +
    formData.otherCost;
  const profit = formData.revenue - totalCost;

  const generatePDF = async () => {
    const doc = (
      <IncomeStatementPDF
        formData={formData}
        totalCost={totalCost}
        profit={profit}
      />
    );
    const asPdf = pdf(doc);
    const blob = await asPdf.toBlob();
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.download = `income-statement-Rs{formData.projectNo || "draft"}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  return (
    <MainLayout>
      <div className="min-h-screen bg-gray-50 py-8 px-4">
        <div className="max-w-4xl mx-auto space-y-8">
          {/* Input Form */}
          <Card className="shadow-lg">
            <CardHeader className="bg-blue-600 text-white">
              <CardTitle className="flex items-center gap-2">
                <Calculator className="w-5 h-5" />
                Income Statement Generator
              </CardTitle>
            </CardHeader>
            <CardContent className="p-6 space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="projectNo" className="text-sm font-medium">
                    Project Number
                  </Label>
                  <Input
                    id="projectNo"
                    type="text"
                    placeholder="Enter project number"
                    value={formData.projectNo}
                    onChange={(e) =>
                      handleInputChange("projectNo", e.target.value)
                    }
                    className="border-gray-300"
                  />
                </div>

                <div className="space-y-2">
                  <Label
                    htmlFor="revenue"
                    className="text-sm font-medium text-green-700"
                  >
                    Revenue
                  </Label>
                  <Input
                    id="revenue"
                    type="number"
                    placeholder="0.00"
                    value={formData.revenue || ""}
                    onChange={(e) =>
                      handleInputChange("revenue", e.target.value)
                    }
                    className="border-green-300 focus:border-green-500"
                  />
                </div>
              </div>

              <div className="border-t pt-6">
                <h3 className="text-lg font-semibold text-orange-700 mb-4">
                  Expenses
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label
                      htmlFor="constructionCost"
                      className="text-sm font-medium"
                    >
                      Cost for Construction (BOQ)
                    </Label>
                    <Input
                      id="constructionCost"
                      type="number"
                      placeholder="0.00"
                      value={formData.constructionCost || ""}
                      onChange={(e) =>
                        handleInputChange("constructionCost", e.target.value)
                      }
                      className="border-orange-300 focus:border-orange-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="furnitureCost"
                      className="text-sm font-medium"
                    >
                      Cost for Furniture
                    </Label>
                    <Input
                      id="furnitureCost"
                      type="number"
                      placeholder="0.00"
                      value={formData.furnitureCost || ""}
                      onChange={(e) =>
                        handleInputChange("furnitureCost", e.target.value)
                      }
                      className="border-orange-300 focus:border-orange-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label
                      htmlFor="workerPayments"
                      className="text-sm font-medium"
                    >
                      Payments for Workers
                    </Label>
                    <Input
                      id="workerPayments"
                      type="number"
                      placeholder="0.00"
                      value={formData.workerPayments || ""}
                      onChange={(e) =>
                        handleInputChange("workerPayments", e.target.value)
                      }
                      className="border-orange-300 focus:border-orange-500"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="otherCost" className="text-sm font-medium">
                      All Other Cost
                    </Label>
                    <Input
                      id="otherCost"
                      type="number"
                      placeholder="0.00"
                      value={formData.otherCost || ""}
                      onChange={(e) =>
                        handleInputChange("otherCost", e.target.value)
                      }
                      className="border-orange-300 focus:border-orange-500"
                    />
                  </div>
                </div>
              </div>

              <div className="flex justify-center pt-4">
                <Button
                  onClick={generatePDF}
                  className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-2"
                  disabled={!formData.projectNo}
                >
                  <Download className="w-4 h-4 mr-2" />
                  Generate PDF
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Income Statement Preview */}
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle>Preview</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="text-center">
                <h2 className="text-2xl font-bold mb-2">Income Statement</h2>
                <p className="text-lg">
                  Project No: {formData.projectNo || "Not specified"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-4 p-4 bg-gray-50 rounded">
                <div>
                  <h3 className="font-semibold text-green-600">Revenue</h3>
                  <p className="text-xl font-bold text-green-700">
                    {formatCurrency(formData.revenue)}
                  </p>
                </div>
                <div>
                  <h3 className="font-semibold text-orange-600">
                    Total Expenses
                  </h3>
                  <p className="text-xl font-bold text-orange-700">
                    {formatCurrency(totalCost)}
                  </p>
                </div>
              </div>

              {/* Detailed Expenses Breakdown */}
              <div className="bg-orange-50 p-4 rounded">
                <h4 className="font-semibold text-orange-700 mb-3">
                  Expense Breakdown
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div className="flex justify-between">
                    <span>Construction (BOQ):</span>
                    <span className="font-medium">
                      {formatCurrency(formData.constructionCost)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Furniture:</span>
                    <span className="font-medium">
                      {formatCurrency(formData.furnitureCost)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Worker Payments:</span>
                    <span className="font-medium">
                      {formatCurrency(formData.workerPayments)}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span>Other Costs:</span>
                    <span className="font-medium">
                      {formatCurrency(formData.otherCost)}
                    </span>
                  </div>
                </div>
              </div>

              <div className="text-center p-4 bg-blue-50 rounded">
                <h3 className="font-semibold text-blue-600">
                  {profit >= 0 ? "Net Profit" : "Net Loss"}
                </h3>
                <p
                  className={`text-2xl font-bold Rs{
                    profit >= 0 ? "text-blue-700" : "text-red-700"
                  }`}
                >
                  {formatCurrency(Math.abs(profit))}
                </p>
              </div>

              {/* Profit Margin Indicator */}
              {formData.revenue > 0 && (
                <div className="text-center p-3 bg-gray-100 rounded">
                  <h4 className="font-semibold text-gray-600">Profit Margin</h4>
                  <p
                    className={`text-lg font-bold Rs{
                      profit >= 0 ? "text-green-600" : "text-red-600"
                    }`}
                  >
                    {((profit / formData.revenue) * 100).toFixed(2)}%
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
