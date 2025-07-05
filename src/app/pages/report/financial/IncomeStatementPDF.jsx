import { Document, Page, Text, View, StyleSheet } from "@react-pdf/renderer";

const styles = StyleSheet.create({
  page: {
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 30,
    fontFamily: "Helvetica",
  },
  title: {
    fontSize: 24,
    textAlign: "center",
    marginBottom: 10,
    fontWeight: "bold",
    color: "#1f2937",
  },
  projectNo: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    color: "#374151",
    textDecoration: "underline",
  },
  table: {
    display: "table",
    width: "auto",
    borderStyle: "solid",
    borderWidth: 2,
    borderColor: "#1f2937",
    marginBottom: 20,
  },
  tableRow: {
    margin: "auto",
    flexDirection: "row",
  },
  tableColHeader: {
    width: "50%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#1f2937",
    backgroundColor: "#f3f4f6",
    padding: 12,
  },
  tableCol: {
    width: "50%",
    borderStyle: "solid",
    borderWidth: 1,
    borderColor: "#1f2937",
    padding: 12,
  },
  tableCellHeader: {
    fontSize: 12,
    fontWeight: "bold",
    color: "#1f2937",
  },
  tableCell: {
    fontSize: 11,
    color: "#374151",
  },
  tableCellRight: {
    fontSize: 11,
    color: "#374151",
    textAlign: "right",
  },
  revenueRow: {
    backgroundColor: "#ecfdf5",
  },
  costRow: {
    backgroundColor: "#fef2f2",
  },
  profitRow: {
    backgroundColor: "#eff6ff",
  },
  lossRow: {
    backgroundColor: "#fef2f2",
  },
  summary: {
    marginTop: 20,
    padding: 15,
    backgroundColor: "#f9fafb",
    borderRadius: 5,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#1f2937",
  },
  summaryRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 11,
    color: "#6b7280",
  },
  summaryValue: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#1f2937",
  },
  profitValue: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#2563eb",
  },
  lossValue: {
    fontSize: 11,
    fontWeight: "bold",
    color: "#dc2626",
  },
});

const formatCurrency = (amount) => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
  }).format(amount);
};

export default function IncomeStatementPDF({ formData, totalCost, profit }) {
  return (
    <Document>
      <Page size="A4" style={styles.page}>
        <Text style={styles.title}>Income Statement</Text>
        <Text style={styles.projectNo}>
          Project No: {formData.projectNo || "_____________"}
        </Text>

        <View style={styles.table}>
          {/* Revenue Row */}
          <View style={[styles.tableRow, styles.revenueRow]}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>REVENUE</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellRight}>
                {formatCurrency(formData.revenue)}
              </Text>
            </View>
          </View>

          {/* Cost Items */}
          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>
                Cost for the construction (BOQ)
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellRight}>
                {formatCurrency(formData.constructionCost)}
              </Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Cost for Furniture</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellRight}>
                {formatCurrency(formData.furnitureCost)}
              </Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>Payments for workers</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellRight}>
                {formatCurrency(formData.workerPayments)}
              </Text>
            </View>
          </View>

          <View style={styles.tableRow}>
            <View style={styles.tableCol}>
              <Text style={styles.tableCell}>All other cost</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellRight}>
                {formatCurrency(formData.otherCost)}
              </Text>
            </View>
          </View>

          {/* Total Cost Row */}
          <View style={[styles.tableRow, styles.costRow]}>
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>TOTAL COST</Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellRight}>
                {formatCurrency(totalCost)}
              </Text>
            </View>
          </View>

          {/* Profit Row */}
          <View
            style={[
              styles.tableRow,
              profit >= 0 ? styles.profitRow : styles.lossRow,
            ]}
          >
            <View style={styles.tableColHeader}>
              <Text style={styles.tableCellHeader}>
                PROFIT {profit < 0 ? "(LOSS)" : ""}
              </Text>
            </View>
            <View style={styles.tableCol}>
              <Text style={styles.tableCellRight}>
                {formatCurrency(profit)}
              </Text>
            </View>
          </View>
        </View>

        {/* Summary Section */}
        <View style={styles.summary}>
          <Text style={styles.summaryTitle}>Summary</Text>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Revenue:</Text>
            <Text style={styles.summaryValue}>
              {formatCurrency(formData.revenue)}
            </Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>Total Cost:</Text>
            <Text style={styles.summaryValue}>{formatCurrency(totalCost)}</Text>
          </View>

          <View style={styles.summaryRow}>
            <Text style={styles.summaryLabel}>
              Net {profit >= 0 ? "Profit" : "Loss"}:
            </Text>
            <Text style={profit >= 0 ? styles.profitValue : styles.lossValue}>
              {formatCurrency(Math.abs(profit))}
            </Text>
          </View>
        </View>
      </Page>
    </Document>
  );
}
