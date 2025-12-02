import { Text, View } from "@react-pdf/renderer";

import { IKeyword, PdfReportData } from "@/types/report";

import { DataPair, Header, Pill, SectionTitle } from "./pdf-layout";
import { groupLocatorsByCategory } from "./pdf-section-entities";
import { styles } from "./pdf-styles";
import { formatDateTime, getCriticalityTag, getLocatorStyle } from "./pdf-utils";

export const SmsRecordsSection = ({ sms }: { sms: PdfReportData["smsRecords"][0] }) => {
  const entitiesList = groupLocatorsByCategory(sms.smsEntities?.Locator || {});
  const criticalityTag = getCriticalityTag(sms.criticality?.[0]?.value || "Low");
  const allKeywords = Array.from(
    new Set([
      ...(Array.isArray(sms.globalKeywords) ? sms.globalKeywords : []),
      ...(Array.isArray(sms.targetKeywords) ? sms.targetKeywords : [])
    ])
  );

  return (
    <>
      <Header text={`SMS Record ID: ${sms.id}`} />
      <View style={styles.section}>
        {/* GENERAL INFO */}
        <SectionTitle title="General Info" />
        <View style={{ flexDirection: "row", gap: 10, marginBottom: 8 }}>
          <DataPair style={{ flex: 1 }} label="Record ID" value={sms.fileName} />
          <DataPair style={{ flex: 1 }} label="Sender" value={sms.senderNumber} />
          <DataPair style={{ flex: 1 }} label="Receiver" value={sms.receiverNumber} />
        </View>
        <View style={{ flexDirection: "row", gap: 10, marginBottom: 24 }}>
          <DataPair
            style={{ width: "32%" }}
            label="SMS Time"
            value={formatDateTime(sms.smsDatetime, "at")}
          />
          <DataPair
            style={{ flex: 1 }}
            label="Criticality"
            value={
              <Text style={{ fontSize: 11, fontWeight: 700, color: criticalityTag.style.color }}>
                {criticalityTag.text}
              </Text>
            }
          />
        </View>

        {/* SUMMARY */}
        <SectionTitle title="Summary" />
        <Text style={{ fontSize: 10, lineHeight: 1.3, marginBottom: 20 }}>
          {sms.message || "N/A"}
        </Text>

        {/* KEYWORDS */}
        {allKeywords.length > 0 && (
          <>
            <SectionTitle title={`Keywords (${allKeywords.length} items)`} />
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 20 }}>
              {allKeywords.map((kw, i) => {
                if (typeof kw === "string") {
                  return (
                    <Pill color="#E8F5E8" key={i}>
                      <Text style={{ fontSize: 10 }}>{kw}</Text>
                    </Pill>
                  );
                }

                const { label, phrase } = kw as IKeyword;
                const colorMap: Record<string, string> = {
                  CRITICAL: "#FFEBEE",
                  HIGH: "#FFF3E0",
                  MEDIUM: "#FFF8E1"
                };
                const textColorMap: Record<string, string> = {
                  CRITICAL: "#D32F2F",
                  HIGH: "#F57C00",
                  MEDIUM: "#F9A825"
                };

                const safeLabel = typeof label === "string" ? label : "";
                const color = colorMap[safeLabel] || "#E8F5E8";
                const textColor = textColorMap[safeLabel] || "#388E3C";

                return (
                  <Pill color={color} key={i}>
                    <Text style={{ fontSize: 10, color: textColor }}>{phrase}</Text>
                  </Pill>
                );
              })}
            </View>
          </>
        )}

        {/* LOCATORS */}
        {Object.keys(entitiesList).length > 0 && (
          <>
            <SectionTitle title={`Locators (${Object.keys(entitiesList).length} types)`} />
            <View
              style={{
                flexDirection: "row",
                flexWrap: "wrap",
                rowGap: 2,
                columnGap: 16,
                marginBottom: 20
              }}
            >
              {Object.entries(entitiesList).map(([category, items]) => (
                <View style={{ width: "48%" }} key={category}>
                  <Text style={{ fontSize: 9, color: "#777", marginBottom: 6 }}>
                    {category} ({items.length})
                  </Text>
                  <View
                    style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 12 }}
                  >
                    {Array.isArray(items) &&
                      items.map((item: { value: string; type: string }, i: number) => {
                        const st = getLocatorStyle(item.type as any);
                        return (
                          <Pill color={st?.backgroundColor || "#efefef"} key={i}>
                            <Text style={{ fontSize: 10 }}>{item.value}</Text>
                          </Pill>
                        );
                      })}
                  </View>
                </View>
              ))}
            </View>
          </>
        )}

        {/* COMMENTS */}
        {sms?.comments && sms.comments.length > 0 && (
          <>
            <SectionTitle title="Comments" />
            {sms.comments.map((c, i) => (
              <View key={i} style={{ flexDirection: "row", gap: 24, marginBottom: 8 }}>
                <Text style={{ ...styles.text, fontWeight: "semibold" }}>{c.user_name}</Text>{" "}
                <Text style={{ ...styles.text, flex: 1 }}>{c.content}</Text>
                <Text style={{ ...styles.text, color: "#888" }}>
                  {c.created_at ? new Date(c.created_at).toLocaleString() : ""}
                </Text>
              </View>
            ))}
          </>
        )}
      </View>
    </>
  );
};
