import { Text, View } from "@react-pdf/renderer";

import PdfReportData from "@/types/report";

import { SectionTitle } from "./pdf-layout";
import { styles } from "./pdf-styles";

export const TargetInfoSection = ({ report }: { report: PdfReportData }) => (
  <>
    <View style={{ ...styles.section, flexGrow: 0 }}>
      <SectionTitle title="Target information" />
      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={{ flex: 1 }}>
          <Text style={styles.text}>Target No.: {report.target.targetNumber || "N/A"}</Text>
          <Text style={styles.text}>Target Name: {report.target.fullName || "N/A"}</Text>
          <Text style={styles.text}>Alias: {report.target.aliases?.join(", ") || "N/A"}</Text>
          <Text style={styles.text}>
            Priority:{" "}
            <Text
              style={{
                color:
                  report.target.riskPriority?.[0]?.value?.toUpperCase() === "CRITICAL"
                    ? "#d32f2f"
                    : report.target.riskPriority?.[0]?.value?.toUpperCase() === "HIGH"
                      ? "#f57c00"
                      : report.target.riskPriority?.[0]?.value?.toUpperCase() === "MEDIUM"
                        ? "#FFD600"
                        : report.target.riskPriority?.[0]?.value?.toUpperCase() === "LOW"
                          ? "#388e3c"
                          : "#333"
              }}
            >
              {report.target.riskPriority?.[0]?.value || "N/A"}
            </Text>
          </Text>
        </View>
        <View style={{ flex: 1 }}>
          <Text style={styles.text}>Total Records: {report.target.fileCount ?? "N/A"}</Text>
          <Text style={styles.text}>
            Critical Records: {report.target.criticalFileCount ?? "N/A"}
          </Text>
          <Text style={styles.text}>
            Address:{" "}
            {report.target.address?.city
              ? `${report.target.address.city}, ${report.target.address.state}`
              : "N/A"}
          </Text>
          <Text style={styles.text}>
            Organisation: {report.target.organisations?.map((o) => o.name).join(", ") || "N/A"}
          </Text>
        </View>
      </View>
    </View>

    {report.comments && report.comments?.length > 0 && (
      <View style={{ ...styles.section }}>
        <SectionTitle title="Target remarks" />
        {report.comments.map((c, i) => (
          <View key={i} style={{ flexDirection: "row", gap: 24, marginBottom: 8 }}>
            <Text style={{ ...styles.text, fontWeight: "semibold" }}>{c.user_name}</Text>{" "}
            <Text style={{ ...styles.text, flex: 1 }}>{c.content}</Text>
            <Text style={{ ...styles.text, color: "#888" }}>
              {c.created_at ? new Date(c.created_at).toLocaleString() : ""}
            </Text>
          </View>
        ))}
      </View>
    )}
  </>
);
