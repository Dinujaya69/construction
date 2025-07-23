"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Calendar,
  FileText,
  Plus,
  Save,
  FilePenLineIcon as Signature,
  AlertCircle,
  Download,
  Printer,
} from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { generateFurnitureReportPDF } from "@/utils/pdfUtils";
import axios from "axios";

const BASE_URL = "http://localhost:5010/api";

export default function FurnitureReport() {
  const [report, setReport] = useState(null);
  const [loading, setLoading] = useState(false);
  const [selectedDate, setSelectedDate] = useState(
    new Date().toISOString().split("T")[0]
  );
  const [signature, setSignature] = useState("");
  const [editMode, setEditMode] = useState(false);
  const [error, setError] = useState("");
  const [apiStatus, setApiStatus] = useState("checking");
  const [pdfLoading, setPdfLoading] = useState(false);

  useEffect(() => {
    checkApiConnection();
  }, []);

  useEffect(() => {
    if (apiStatus === "connected") {
      fetchTodayReport();
    }
  }, [apiStatus]);

  const checkApiConnection = async () => {
    try {
      const response = await axios.get(`${BASE_URL}/furniture-reports/test`);
      console.log("API Test Response:", response.data);
      setApiStatus("connected");
      setError("");
    } catch (error) {
      console.error("API Connection Error:", error);
      setApiStatus("error");
      setError(
        `API Connection Failed: ${error.message}. Make sure your backend server is running on port 5010.`
      );
    }
  };

  const fetchTodayReport = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(`${BASE_URL}/furniture-reports/today`);
      console.log("Today's Report Response:", response.data);
      setReport(response.data.data);
      setSignature(response.data.data.signature || "");
    } catch (error) {
      console.error("Error fetching today's report:", error);
      if (error.response?.status === 404) {
        setError(
          "No report found for today. Click 'Generate Report' to create one."
        );
      } else {
        setError(`Error fetching report: ${error.message}`);
      }
      setReport(null);
    }
    setLoading(false);
  };

  const fetchReportByDate = async (date) => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.get(
        `${BASE_URL}/furniture-reports/date/${date}`
      );
      console.log("Report by Date Response:", response.data);
      setReport(response.data.data);
      setSignature(response.data.data.signature || "");
    } catch (error) {
      console.error("Error fetching report:", error);
      if (error.response?.status === 404) {
        setError(`No report found for ${formatDate(date)}`);
      } else {
        setError(`Error fetching report: ${error.message}`);
      }
      setReport(null);
    }
    setLoading(false);
  };

  const generateDailyReport = async () => {
    setLoading(true);
    setError("");
    try {
      const response = await axios.post(
        `${BASE_URL}/furniture-reports/generate`
      );
      console.log("Generate Report Response:", response.data);
      setReport(response.data.data);
      setError("");
      alert("Daily report generated successfully!");
    } catch (error) {
      console.error("Error generating report:", error);
      if (error.response?.status === 400 && error.response.data.data) {
        setReport(error.response.data.data);
        setError("Report for today already exists.");
      } else {
        setError(error.response?.data?.message || "Failed to generate report");
      }
    }
    setLoading(false);
  };

  const updateSoldQuantity = (subFurnitureId, soldQuantity) => {
    setReport((prev) => ({
      ...prev,
      reportItems: prev.reportItems.map((item) =>
        item.subFurnitureId === subFurnitureId
          ? {
              ...item,
              sold: Number.parseInt(soldQuantity) || 0,
              remaining:
                item.initialCount - (Number.parseInt(soldQuantity) || 0),
            }
          : item
      ),
    }));
  };

  const saveUpdates = async () => {
    try {
      const itemUpdates = report.reportItems.map((item) => ({
        subFurnitureId: item.subFurnitureId,
        soldQuantity: item.sold,
      }));

      const response = await axios.put(
        `${BASE_URL}/furniture-reports/update-sold`,
        { itemUpdates }
      );
      console.log("Update Response:", response.data);
      alert("Report updated successfully!");
      setEditMode(false);
      setError("");
    } catch (error) {
      console.error("Error updating report:", error);
      setError(`Failed to update report: ${error.message}`);
    }
  };

  const saveSignature = async () => {
    try {
      const response = await axios.put(
        `${BASE_URL}/furniture-reports/signature`,
        { signature }
      );
      console.log("Signature Response:", response.data);
      alert("Signature saved successfully!");
      setError("");
    } catch (error) {
      console.error("Error saving signature:", error);
      setError(`Failed to save signature: ${error.message}`);
    }
  };

  const downloadPDF = async () => {
    if (!report) {
      alert("No report data available to download");
      return;
    }

    setPdfLoading(true);
    try {
      // Prepare report data with current signature
      const reportWithSignature = {
        ...report,
        signature: signature,
      };

      // Generate and download PDF
      await generateFurnitureReportPDF(reportWithSignature, "furniture-report");

      // Show success message
      alert("PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating PDF:", error);
      alert(`Failed to generate PDF: ${error.message}`);
    } finally {
      setPdfLoading(false);
    }
  };

  const printReport = () => {
    if (!report) return;

    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Please allow popups to print the report");
      return;
    }

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    const reportHTML = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Furniture Report - ${formatDate(report.date)}</title>
          <style>
            body { 
              font-family: Arial, sans-serif; 
              margin: 20px; 
              color: black;
              background-color: white;
            }
            .header { text-align: center; margin-bottom: 30px; }
            .date { text-decoration: underline; margin: 20px 0; }
            table { 
              width: 100%; 
              border-collapse: collapse; 
              margin: 20px 0; 
            }
            th, td { 
              border: 1px solid black; 
              padding: 8px; 
              text-align: left; 
            }
            th { background-color: #f5f5f5; }
            .signature-section { 
              margin-top: 50px; 
              display: flex; 
              justify-content: space-between; 
            }
            .signature-box { width: 200px; }
            .signature-line { 
              border-bottom: 1px solid black; 
              height: 30px; 
              margin-bottom: 5px; 
            }
            .negative { color: red; font-weight: bold; }
            @media print {
              body { margin: 0; }
            }
          </style>
        </head>
        <body>
          <div class="header">
            <h1>Furniture Report</h1>
            <div class="date">DATE: ${formatDate(report.date)}</div>
          </div>
          
          <table>
            <thead>
              <tr>
                <th>Item</th>
                <th>Item No</th>
                <th>Item count</th>
                <th>Sold</th>
                <th>Remaining</th>
              </tr>
            </thead>
            <tbody>
              ${report.reportItems
                .map(
                  (item) => `
                <tr>
                  <td>${item.itemName}</td>
                  <td>${item.itemNo}</td>
                  <td>${item.initialCount}</td>
                  <td>${item.sold}</td>
                  <td class="${item.remaining < 0 ? "negative" : ""}">${
                    item.remaining
                  }</td>
                </tr>
              `
                )
                .join("")}
            </tbody>
          </table>
          
          <div class="signature-section">
            <div class="signature-box">
              <div>Date</div>
              <div class="signature-line"></div>
              <div style="text-align: center; font-size: 12px;">${formatDate(
                report.date
              )}</div>
            </div>
            <div class="signature-box">
              <div>Signature</div>
              <div class="signature-line"></div>
              <div style="text-align: center; font-size: 12px;">${
                signature || ""
              }</div>
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.write(reportHTML);
    printWindow.document.close();
    printWindow.print();
  };

  const handleDateChange = (e) => {
    const date = e.target.value;
    setSelectedDate(date);
    if (date === new Date().toISOString().split("T")[0]) {
      fetchTodayReport();
    } else {
      fetchReportByDate(date);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  if (apiStatus === "checking") {
    return (
      <div className="container mx-auto p-6">
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Checking API connection...</div>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (apiStatus === "error") {
    return (
      <div className="container mx-auto p-6">
        <Alert variant="destructive">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
        <div className="mt-4">
          <Button onClick={checkApiConnection}>Retry Connection</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Furniture Report</h1>
        <div className="flex gap-4 items-center">
          <div className="flex items-center gap-2">
            <Calendar className="w-4 h-4" />
            <Input
              type="date"
              value={selectedDate}
              onChange={handleDateChange}
              className="w-auto"
            />
          </div>
          {report && (
            <div className="flex gap-2">
              <Button
                onClick={downloadPDF}
                disabled={pdfLoading}
                variant="outline"
              >
                <Download className="w-4 h-4 mr-2" />
                {pdfLoading ? "Generating PDF..." : "Download PDF"}
              </Button>
              <Button onClick={printReport} variant="outline">
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
            </div>
          )}
          <Button onClick={generateDailyReport} disabled={loading}>
            <Plus className="w-4 h-4 mr-2" />
            Generate Report
          </Button>
        </div>
      </div>

      {error && (
        <Alert
          variant={
            error.includes("No report found") ? "default" : "destructive"
          }
        >
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      )}

      {loading && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center">Loading...</div>
          </CardContent>
        </Card>
      )}

      {!loading && !report && !error && (
        <Card>
          <CardContent className="p-6">
            <div className="text-center text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No report found for {formatDate(selectedDate)}</p>
              <Button onClick={generateDailyReport} className="mt-4">
                <Plus className="w-4 h-4 mr-2" />
                Generate Report
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {!loading && report && (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-center text-2xl">
                Furniture Report - {formatDate(report.date)}
              </CardTitle>
              <div className="flex gap-2">
                {!editMode ? (
                  <Button onClick={() => setEditMode(true)} variant="outline">
                    Edit
                  </Button>
                ) : (
                  <>
                    <Button onClick={saveUpdates} variant="default">
                      <Save className="w-4 h-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button
                      onClick={() => setEditMode(false)}
                      variant="outline"
                    >
                      Cancel
                    </Button>
                  </>
                )}
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="font-bold">Item</TableHead>
                    <TableHead className="font-bold">Item No</TableHead>
                    <TableHead className="font-bold">Item Count</TableHead>
                    <TableHead className="font-bold">Sold</TableHead>
                    <TableHead className="font-bold">Remaining</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {report.reportItems.map((item, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">
                        {item.itemName}
                      </TableCell>
                      <TableCell>{item.itemNo}</TableCell>
                      <TableCell>{item.initialCount}</TableCell>
                      <TableCell>
                        {editMode ? (
                          <Input
                            type="number"
                            value={item.sold}
                            onChange={(e) =>
                              updateSoldQuantity(
                                item.subFurnitureId,
                                e.target.value
                              )
                            }
                            className="w-20"
                            min="0"
                            max={item.initialCount}
                          />
                        ) : (
                          item.sold
                        )}
                      </TableCell>
                      <TableCell
                        className={
                          item.remaining < 0 ? "text-red-600 font-bold" : ""
                        }
                      >
                        {item.remaining}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>

            <div className="flex justify-between items-end mt-8 pt-8 border-t">
              <div>
                <p className="text-sm text-gray-600 mb-2">
                  Date: {formatDate(report.date)}
                </p>
              </div>
              <div className="flex items-center gap-4">
                <div className="flex items-center gap-2">
                  <Signature className="w-4 h-4" />
                  <Input
                    placeholder="Signature"
                    value={signature}
                    onChange={(e) => setSignature(e.target.value)}
                    className="w-48"
                  />
                  <Button onClick={saveSignature} size="sm" variant="outline">
                    Save
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
