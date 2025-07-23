"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Download, Calculator } from "lucide-react";
import MainLayout from "@/components/MainLayout/MainLayout";
import {
  Document,
  Page,
  Text,
  View,
  StyleSheet,
  pdf,
} from "@react-pdf/renderer";
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
    link.download = `income-statement-${formData.projectNo || "draft"}.pdf`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  const styles = StyleSheet.create({
    page: {
      flexDirection: "column",
      backgroundColor: "#fff",
      padding: 40,
    },
    section: {
      margin: 10,
      padding: 10,
      flexGrow: 1,
    },
    title: {
      fontSize: 24,
      textAlign: "center",
      marginBottom: 20,
    },
    subtitle: {
      fontSize: 18,
      marginBottom: 10,
    },
    row: {
      flexDirection: "row",
      borderBottomWidth: 1,
      borderBottomColor: "#000",
      alignItems: "center",
      height: 24,
    },
    rowTitle: {
      width: "50%",
      fontSize: 12,
    },
    rowValue: {
      width: "50%",
      fontSize: 12,
      textAlign: "right",
    },
    summary: {
      marginTop: 30,
      padding: 10,
      backgroundColor: "#f0f0f0",
    },
    summaryRow: {
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: 5,
    },
    summaryTitle: {
      fontSize: 12,
      fontWeight: "bold",
    },
    summaryValue: {
      fontSize: 12,
    },
  });

  const IncomeStatementPDF = ({ formData, totalCost, profit }) => (
    <Document>
      <Page size="A4" style={styles.page}>
        <View style={styles.section}>
          <Text style={styles.title}>Income Statement</Text>
          <Text style={styles.subtitle}>
            Project No: {formData.projectNo || "_____________"}
          </Text>

          <View style={styles.row}>
            <Text style={styles.rowTitle}>REVENUE</Text>
            <Text style={styles.rowValue}>
              {formatCurrency(formData.revenue)}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowTitle}>Cost for the construction (BOQ)</Text>
            <Text style={styles.rowValue}>
              {formatCurrency(formData.constructionCost)}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowTitle}>Cost for Furniture</Text>
            <Text style={styles.rowValue}>
              {formatCurrency(formData.furnitureCost)}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowTitle}>Payments for workers</Text>
            <Text style={styles.rowValue}>
              {formatCurrency(formData.workerPayments)}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowTitle}>All other cost</Text>
            <Text style={styles.rowValue}>
              {formatCurrency(formData.otherCost)}
            </Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowTitle}>TOTAL COST</Text>
            <Text style={styles.rowValue}>{formatCurrency(totalCost)}</Text>
          </View>

          <View style={styles.row}>
            <Text style={styles.rowTitle}>
              PROFIT {profit < 0 ? "(LOSS)" : ""}
            </Text>
            <Text style={styles.rowValue}>{formatCurrency(profit)}</Text>
          </View>

          <View style={styles.summary}>
            <Text style={styles.subtitle}>Summary</Text>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryTitle}>Total Revenue</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(formData.revenue)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryTitle}>Total Cost</Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(totalCost)}
              </Text>
            </View>
            <View style={styles.summaryRow}>
              <Text style={styles.summaryTitle}>
                Net {profit >= 0 ? "Profit" : "Loss"}
              </Text>
              <Text style={styles.summaryValue}>
                {formatCurrency(Math.abs(profit))}
              </Text>
            </View>
          </View>
        </View>
      </Page>
    </Document>
  );

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
                <h3 className="text-lg font-semibold text-red-700 mb-4">
                  Cost Items
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
                      className="border-red-300 focus:border-red-500"
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
                      className="border-red-300 focus:border-red-500"
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
                      className="border-red-300 focus:border-red-500"
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
                      className="border-red-300 focus:border-red-500"
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
                  <h3 className="font-semibold text-red-600">Total Cost</h3>
                  <p className="text-xl font-bold text-red-700">
                    {formatCurrency(totalCost)}
                  </p>
                </div>
              </div>

              <div className="text-center p-4 bg-blue-50 rounded">
                <h3 className="font-semibold text-blue-600">
                  {profit >= 0 ? "Net Profit" : "Net Loss"}
                </h3>
                <p
                  className={`text-2xl font-bold ${
                    profit >= 0 ? "text-blue-700" : "text-red-700"
                  }`}
                >
                  {formatCurrency(Math.abs(profit))}
                </p>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
}
