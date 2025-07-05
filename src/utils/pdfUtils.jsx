import jsPDF from "jspdf";

// Simple and reliable PDF generator using jsPDF native methods
export const generateFurnitureReportPDF = (
  reportData,
  filename = "furniture-report"
) => {
  try {
    const pdf = new jsPDF("p", "mm", "a4");

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    };

    // Page margins and dimensions
    const margin = 20;
    const pageWidth = 210;
    const pageHeight = 297;
    const contentWidth = pageWidth - margin * 2;

    // Title
    pdf.setFontSize(24);
    pdf.setFont("helvetica", "bold");
    pdf.text("Furniture Report", pageWidth / 2, 30, { align: "center" });

    // Date
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "normal");
    const dateText = `DATE: ${formatDate(reportData.date)}`;
    pdf.text(dateText, pageWidth / 2, 45, { align: "center" });

    // Underline the date
    const dateWidth = pdf.getTextWidth(dateText);
    pdf.line((pageWidth - dateWidth) / 2, 47, (pageWidth + dateWidth) / 2, 47);

    // Table setup
    const tableStartY = 70;
    const rowHeight = 8;
    const colWidths = [50, 35, 25, 20, 25]; // Adjusted widths
    let currentX = margin;
    const colPositions = [];

    // Calculate column positions
    colWidths.forEach((width, index) => {
      colPositions.push(currentX);
      currentX += width;
    });

    // Table headers
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");

    const headers = ["Item", "Item No", "Count", "Sold", "Remaining"];
    let currentY = tableStartY;

    // Draw header background
    pdf.setFillColor(245, 245, 245);
    pdf.rect(margin, currentY - 6, contentWidth, rowHeight, "F");

    // Draw header borders
    pdf.setDrawColor(0, 0, 0);
    pdf.rect(margin, currentY - 6, contentWidth, rowHeight);

    // Draw vertical lines for headers
    colPositions.forEach((pos, index) => {
      if (index > 0) {
        pdf.line(pos, currentY - 6, pos, currentY + 2);
      }
    });

    // Header text
    headers.forEach((header, index) => {
      pdf.text(header, colPositions[index] + 2, currentY);
    });

    currentY += rowHeight;

    // Table data
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);

    reportData.reportItems.forEach((item, rowIndex) => {
      // Check if we need a new page
      if (currentY > pageHeight - 50) {
        pdf.addPage();
        currentY = 30;
      }

      // Draw row border
      pdf.rect(margin, currentY - 6, contentWidth, rowHeight);

      // Draw vertical lines
      colPositions.forEach((pos, index) => {
        if (index > 0) {
          pdf.line(pos, currentY - 6, pos, currentY + 2);
        }
      });

      // Row data
      const rowData = [
        item.itemName.length > 20
          ? item.itemName.substring(0, 17) + "..."
          : item.itemName,
        item.itemNo.length > 12
          ? item.itemNo.substring(0, 9) + "..."
          : item.itemNo,
        item.initialCount.toString(),
        item.sold.toString(),
        item.remaining.toString(),
      ];

      rowData.forEach((data, colIndex) => {
        // Highlight negative remaining in red
        if (colIndex === 4 && item.remaining < 0) {
          pdf.setTextColor(220, 38, 38);
        }

        pdf.text(data, colPositions[colIndex] + 2, currentY);

        // Reset color
        if (colIndex === 4 && item.remaining < 0) {
          pdf.setTextColor(0, 0, 0);
        }
      });

      currentY += rowHeight;
    });

    // Signature section
    const signatureY = Math.max(currentY + 20, pageHeight - 60);

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");

    // Date signature box
    pdf.text("Date", margin, signatureY);
    pdf.line(margin, signatureY + 5, margin + 60, signatureY + 5);
    pdf.setFontSize(10);
    pdf.text(formatDate(reportData.date), margin + 30, signatureY + 12, {
      align: "center",
    });

    // Signature box
    pdf.setFontSize(12);
    const signatureX = pageWidth - margin - 60;
    pdf.text("Signature", signatureX, signatureY);
    pdf.line(signatureX, signatureY + 5, signatureX + 60, signatureY + 5);

    if (reportData.signature) {
      pdf.setFontSize(10);
      pdf.text(reportData.signature, signatureX + 30, signatureY + 12, {
        align: "center",
      });
    }

    // Save the PDF
    const fileName = `${filename}-${
      new Date().toISOString().split("T")[0]
    }.pdf`;
    pdf.save(fileName);

    return true;
  } catch (error) {
    console.error("Error generating PDF:", error);
    throw new Error("Failed to generate PDF: " + error.message);
  }
};

// Dashboard reports PDF generator
export const generateDashboardReportPDF = (
  reports,
  filename = "reports-summary"
) => {
  try {
    const pdf = new jsPDF("p", "mm", "a4");

    const formatDate = (date) => {
      return new Date(date).toLocaleDateString("en-US", {
        year: "numeric",
        month: "short",
        day: "numeric",
      });
    };

    // Page setup
    const margin = 20;
    const pageWidth = 210;
    const pageHeight = 297;
    const contentWidth = pageWidth - margin * 2;

    // Title
    pdf.setFontSize(24);
    pdf.setFont("helvetica", "bold");
    pdf.text("Furniture Reports Summary", pageWidth / 2, 30, {
      align: "center",
    });

    // Generated date
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Generated on: ${formatDate(new Date())}`, pageWidth / 2, 45, {
      align: "center",
    });

    // Summary statistics
    const totalReports = reports.length;
    const totalItemsSold = reports.reduce((total, report) => {
      return (
        total + report.reportItems.reduce((sum, item) => sum + item.sold, 0)
      );
    }, 0);
    const totalItemsRemaining = reports.reduce((total, report) => {
      return (
        total +
        report.reportItems.reduce((sum, item) => sum + item.remaining, 0)
      );
    }, 0);

    let currentY = 65;

    // Stats section
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("Summary Statistics", margin, currentY);
    currentY += 15;

    pdf.setFontSize(12);
    pdf.setFont("helvetica", "normal");
    pdf.text(`Total Reports: ${totalReports}`, margin, currentY);
    currentY += 8;
    pdf.text(`Total Items Sold: ${totalItemsSold}`, margin, currentY);
    currentY += 8;
    pdf.text(`Total Items Remaining: ${totalItemsRemaining}`, margin, currentY);
    currentY += 20;

    // Reports table
    pdf.setFontSize(16);
    pdf.setFont("helvetica", "bold");
    pdf.text("Reports Details", margin, currentY);
    currentY += 15;

    // Table headers
    const colWidths = [40, 30, 30, 35, 35];
    const colPositions = [];
    let currentX = margin;

    colWidths.forEach((width) => {
      colPositions.push(currentX);
      currentX += width;
    });

    const rowHeight = 8;

    // Header row
    pdf.setFontSize(12);
    pdf.setFont("helvetica", "bold");

    // Header background
    pdf.setFillColor(245, 245, 245);
    pdf.rect(margin, currentY - 6, contentWidth, rowHeight, "F");
    pdf.setDrawColor(0, 0, 0);
    pdf.rect(margin, currentY - 6, contentWidth, rowHeight);

    // Header vertical lines
    colPositions.forEach((pos, index) => {
      if (index > 0) {
        pdf.line(pos, currentY - 6, pos, currentY + 2);
      }
    });

    // Header text
    const headers = ["Date", "Items", "Sold", "Remaining", "Status"];
    headers.forEach((header, index) => {
      pdf.text(header, colPositions[index] + 2, currentY);
    });

    currentY += rowHeight;

    // Data rows
    pdf.setFont("helvetica", "normal");
    pdf.setFontSize(10);

    reports.forEach((report) => {
      // Check for new page
      if (currentY > pageHeight - 30) {
        pdf.addPage();
        currentY = 30;
      }

      // Row border
      pdf.rect(margin, currentY - 6, contentWidth, rowHeight);

      // Vertical lines
      colPositions.forEach((pos, index) => {
        if (index > 0) {
          pdf.line(pos, currentY - 6, pos, currentY + 2);
        }
      });

      // Row data
      const totalItems = report.reportItems.length;
      const soldItems = report.reportItems.reduce(
        (sum, item) => sum + item.sold,
        0
      );
      const remainingItems = report.reportItems.reduce(
        (sum, item) => sum + item.remaining,
        0
      );
      const status = remainingItems < 0 ? "Alert" : "Normal";

      const rowData = [
        formatDate(report.date),
        totalItems.toString(),
        soldItems.toString(),
        remainingItems.toString(),
        status,
      ];

      rowData.forEach((data, colIndex) => {
        // Highlight alerts in red
        if (colIndex === 4 && status === "Alert") {
          pdf.setTextColor(220, 38, 38);
        }

        pdf.text(data, colPositions[colIndex] + 2, currentY);

        // Reset color
        if (colIndex === 4 && status === "Alert") {
          pdf.setTextColor(0, 0, 0);
        }
      });

      currentY += rowHeight;
    });

    // Footer
    const footerY = pageHeight - 20;
    pdf.setFontSize(8);
    pdf.text(
      `Generated by Furniture Management System - ${new Date().toLocaleString()}`,
      pageWidth / 2,
      footerY,
      {
        align: "center",
      }
    );

    // Save PDF
    const fileName = `${filename}-${
      new Date().toISOString().split("T")[0]
    }.pdf`;
    pdf.save(fileName);

    return true;
  } catch (error) {
    console.error("Error generating dashboard PDF:", error);
    throw new Error("Failed to generate PDF: " + error.message);
  }
};

// Individual report PDF from dashboard
export const generateIndividualReportPDF = (
  report,
  filename = "individual-report"
) => {
  return generateFurnitureReportPDF(report, filename);
};
