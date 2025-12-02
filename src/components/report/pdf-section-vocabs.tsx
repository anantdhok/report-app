import { Text, View } from "@react-pdf/renderer";

import { PdfReportData } from "@/types/report";

import { Pill } from "./pdf-layout";
import { styles } from "./pdf-styles";

export const TargetVocabSection = ({ report }: { report: PdfReportData }) => {
  return (
    <View style={styles.section}>
      <Text style={{ fontSize: 15, fontWeight: "semibold", marginBottom: 8 }}>
        Target Specific Vocabulary ({report.targetVocabulary?.length || 0} items)
      </Text>
      <Text
        style={{ fontSize: 11, lineHeight: 1.4, color: "#888", width: "90%", marginBottom: 12 }}
      >
        The following keywords represent terms frequently spoken by the target during calls and SMS
        conversations. These phrases were identified by analyzing transcript data and
        cross-referencing with a curated vocabulary list.
      </Text>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
        {report.targetVocabulary?.map((k, i) => {
          const color =
            k.label === "CRITICAL"
              ? "#FFEBEE"
              : k.label === "HIGH"
                ? "#FFF3E0"
                : k.label === "MEDIUM"
                  ? "#FFF8E1"
                  : "#E8F5E8";
          const textColor =
            k.label === "CRITICAL"
              ? "#D32F2F"
              : k.label === "HIGH"
                ? "#F57C00"
                : k.label === "MEDIUM"
                  ? "#F9A825"
                  : "#388E3C";
          return (
            <Pill color={color} key={i}>
              <Text style={{ color: textColor, fontSize: 10, fontWeight: 600 }}>{k.phrase}</Text>
            </Pill>
          );
        })}
      </View>
    </View>
  );
};
