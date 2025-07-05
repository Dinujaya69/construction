"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Eye,
  Calendar,
  TrendingUp,
  Package,
  Download,
  FileText,
} from "lucide-react";
import {
  generateDashboardReportPDF,
  generateIndividualReportPDF,
} from "@/utils/pdfUtils";
import axios from "axios";

const BASE_URL = "http://localhost:5010/api";

export default function ReportsDashboard() {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [pagination, setPagination] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [pdfLoading, setPdfLoading] = useState({});
  const [summaryPdfLoading, setSummaryPdfLoading] = useState(false);
  const [stats, setStats] = useState({
    totalReports: 0,
    totalItemsSold: 0,
    totalItemsRemaining: 0,
  });

  useEffect(() => {
    fetchReports(currentPage);
  }, [currentPage]);

  const fetchReports = async (page = 1) => {
    setLoading(true);
    try {
      const response = await axios.get(
        `${BASE_URL}/furniture-reports?page=${page}&limit=10`
      );
      setReports(response.data.data);
      setPagination(response.data.pagination);

      // Calculate stats
      const totalItemsSold = response.data.data.reduce((total, report) => {
        return (
          total + report.reportItems.reduce((sum, item) => sum + item.sold, 0)
        );
      }, 0);

      const totalItemsRemaining = response.data.data.reduce((total, report) => {
        return (
          total +
          report.reportItems.reduce((sum, item) => sum + item.remaining, 0)
        );
      }, 0);

      setStats({
        totalReports: response.data.pagination.total,
        totalItemsSold,
        totalItemsRemaining,
      });
    } catch (error) {
      console.error("Error fetching reports:", error);
      alert("Failed to fetch reports. Please check your connection.");
    }
    setLoading(false);
  };

  const downloadIndividualReportPDF = async (report) => {
    const reportId = report._id;
    setPdfLoading((prev) => ({ ...prev, [reportId]: true }));

    try {
      await generateIndividualReportPDF(
        report,
        `furniture-report-${formatDateForFilename(report.date)}`
      );
      alert("Individual report PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating individual PDF:", error);
      alert(`Failed to generate PDF: ${error.message}`);
    } finally {
      setPdfLoading((prev) => ({ ...prev, [reportId]: false }));
    }
  };

  const downloadSummaryPDF = async () => {
    if (reports.length === 0) {
      alert("No reports available to generate summary");
      return;
    }

    setSummaryPdfLoading(true);
    try {
      await generateDashboardReportPDF(reports, "furniture-reports-summary");
      alert("Summary PDF downloaded successfully!");
    } catch (error) {
      console.error("Error generating summary PDF:", error);
      alert(`Failed to generate summary PDF: ${error.message}`);
    } finally {
      setSummaryPdfLoading(false);
    }
  };

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  const formatDateForFilename = (date) => {
    return new Date(date).toISOString().split("T")[0];
  };

  const getTotalSoldForReport = (reportItems) => {
    return reportItems.reduce((total, item) => total + item.sold, 0);
  };

  const getTotalRemainingForReport = (reportItems) => {
    return reportItems.reduce((total, item) => total + item.remaining, 0);
  };

  const viewReport = (reportId) => {
    // You can implement navigation to specific report view here
    console.log("View report:", reportId);
    alert(
      `View functionality for report ${reportId} - implement navigation here`
    );
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Reports Dashboard</h1>
        <Button
          onClick={downloadSummaryPDF}
          disabled={summaryPdfLoading || reports.length === 0}
          variant="outline"
        >
          <FileText className="w-4 h-4 mr-2" />
          {summaryPdfLoading ? "Generating..." : "Download Summary PDF"}
        </Button>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Reports</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalReports}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Items Sold
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalItemsSold}</div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Items Remaining
            </CardTitle>
            <Package className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {stats.totalItemsRemaining}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Reports Table */}
      <Card>
        <CardHeader>
          <CardTitle>All Reports</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">Loading reports...</div>
          ) : reports.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <FileText className="w-12 h-12 mx-auto mb-4 opacity-50" />
              <p>No reports found</p>
            </div>
          ) : (
            <>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Date</TableHead>
                    <TableHead>Total Items</TableHead>
                    <TableHead>Items Sold</TableHead>
                    <TableHead>Items Remaining</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reports.map((report) => {
                    const totalSold = getTotalSoldForReport(report.reportItems);
                    const totalRemaining = getTotalRemainingForReport(
                      report.reportItems
                    );
                    const hasAlert = totalRemaining < 0;

                    return (
                      <TableRow key={report._id}>
                        <TableCell className="font-medium">
                          {formatDate(report.date)}
                        </TableCell>
                        <TableCell>{report.reportItems.length}</TableCell>
                        <TableCell>{totalSold}</TableCell>
                        <TableCell
                          className={hasAlert ? "text-red-600 font-bold" : ""}
                        >
                          {totalRemaining}
                        </TableCell>
                        <TableCell>
                          <span
                            className={`px-2 py-1 rounded text-xs ${
                              hasAlert
                                ? "bg-red-100 text-red-800"
                                : "bg-green-100 text-green-800"
                            }`}
                          >
                            {hasAlert ? "Alert" : "Normal"}
                          </span>
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() => viewReport(report._id)}
                            >
                              <Eye className="w-4 h-4 mr-1" />
                              View
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              onClick={() =>
                                downloadIndividualReportPDF(report)
                              }
                              disabled={pdfLoading[report._id]}
                            >
                              <Download className="w-4 h-4 mr-1" />
                              {pdfLoading[report._id] ? "..." : "PDF"}
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>

              {/* Pagination */}
              {pagination.pages > 1 && (
                <div className="flex justify-center items-center gap-2 mt-6">
                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentPage((prev) => Math.max(prev - 1, 1))
                    }
                    disabled={currentPage === 1}
                  >
                    Previous
                  </Button>
                  <span className="text-sm text-gray-600">
                    Page {pagination.current} of {pagination.pages}
                  </span>
                  <Button
                    variant="outline"
                    onClick={() =>
                      setCurrentPage((prev) =>
                        Math.min(prev + 1, pagination.pages)
                      )
                    }
                    disabled={currentPage === pagination.pages}
                  >
                    Next
                  </Button>
                </div>
              )}
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
