import { Text, View } from "@react-pdf/renderer";

import { ICallRecord, ISMSResponse, PdfReportData } from "@/types/report";

import { SectionTitle } from "./pdf-layout";
import { styles } from "./pdf-styles";
import { breakTextToLines, formatDuration } from "./pdf-utils";

const clusterCallRecordsByLocation = (
  callRecords: ICallRecord[]
): Record<string, ICallRecord[]> => {
  const clusters: Record<string, ICallRecord[]> = {};
  for (const record of callRecords) {
    const lat = record.startLocation?.latitude;
    const lng = record.startLocation?.longitude;
    if (lat == null || lng == null) continue;
    const key = `${parseFloat(String(lat)).toFixed(5)}, ${parseFloat(String(lng)).toFixed(5)}`;
    if (!clusters[key]) clusters[key] = [];
    clusters[key].push(record);
  }
  return clusters;
};

const getRecordType = (record: ICallRecord) => {
  if ("callDatetime" in record) return "Call";
  if ("smsDatetime" in record) return "SMS";
  return "-";
};

const getRecordDatetime = (record: ICallRecord | ISMSResponse) => {
  if ("callDatetime" in record) return record.callDatetime;
  if ("smsDatetime" in record) return record.smsDatetime;
  return "-";
};

const getDirection = (record: ICallRecord | ISMSResponse) => {
  if ("callType" in record) {
    return record.callType?.[0]?.value.toLowerCase();
  } else if ("smsType" in record) {
    return record.smsType?.[0]?.value.toLowerCase();
  }
  return "-";
};

export const GeolocationsSection = ({ report }: { report: PdfReportData }) => {
  const callRecords = report.callRecords || [];
  const smsRecords = report.smsRecords || [];
  const allRecords: ICallRecord[] = [
    ...callRecords,
    ...smsRecords.map((sms: any) => ({
      ...sms,
      callerNumber: sms.senderNumber,
      calleeNumber: sms.receiverNumber
    }))
  ];

  const clusters = clusterCallRecordsByLocation(allRecords);

  return (
    <View style={styles.section}>
      <Text style={{ fontSize: 15, fontWeight: "semibold", marginBottom: 8 }}>
        Geolocation From Records ({Object.keys(clusters).length} clusters)
      </Text>
      <Text
        style={{ fontSize: 11, lineHeight: 1.4, color: "#888", width: "90%", marginBottom: 12 }}
      >
        The clusters below represent distinct geographic locations from which calls or SMS were
        made. Each cluster groups communications that originated from. This analysis helps visualize
        movement patterns and identify key locations relevant to the target&#39;s activities.
      </Text>

      <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
        {Object.keys(clusters).length > 0 ? (
          Object.entries(clusters).map(([key, cluster]) => (
            <View style={{ marginBottom: 12, paddingVertical: 8 }} key={key}>
              <SectionTitle title={`Location ${key} (${cluster.length} items)`} />
              <View
                style={{
                  flexDirection: "row",
                  marginBottom: 4,
                  paddingBottom: 4,
                  borderBottomWidth: 1,
                  borderBottomColor: "#ccc"
                }}
              >
                <Text style={{ fontSize: 9, fontWeight: "bold", width: "11%" }}>Date/Time</Text>
                <Text style={{ fontSize: 9, fontWeight: "bold", width: "6%" }}>Type</Text>
                <Text style={{ fontSize: 9, fontWeight: "bold", width: "18%" }}>File Name</Text>
                <Text style={{ fontSize: 9, fontWeight: "bold", width: "15%" }}>Caller</Text>
                <Text style={{ fontSize: 9, fontWeight: "bold", width: "15%" }}>Callee</Text>
                <Text style={{ fontSize: 9, fontWeight: "bold", width: "11%" }}>Start Loc.</Text>
                <Text style={{ fontSize: 9, fontWeight: "bold", width: "11%" }}>End Loc.</Text>
                <Text style={{ fontSize: 9, fontWeight: "bold", width: "6%" }}>Dur.</Text>
                <Text style={{ fontSize: 9, fontWeight: "bold", width: "7%" }}>Dir.</Text>
              </View>
              <View>
                {cluster && cluster.length > 0 ? (
                  cluster.map((marker: ICallRecord, j: number) => (
                    <View
                      key={marker.id || j}
                      style={{
                        flexDirection: "row",
                        marginBottom: 4,
                        paddingBottom: 4,
                        ...(j < cluster.length - 1
                          ? { borderBottomWidth: 1, borderBottomColor: "#ccc" }
                          : {})
                      }}
                    >
                      <Text style={{ fontSize: 9, width: "12%" }}>
                        {getRecordDatetime(marker) !== "-"
                          ? new Date(getRecordDatetime(marker)).toLocaleString()
                          : "-"}
                      </Text>
                      <Text style={{ fontSize: 9, width: "5%" }}>{getRecordType(marker)}</Text>
                      <View style={{ flexDirection: "column", fontSize: 9, width: "18%" }}>
                        {breakTextToLines(marker.fileName, 15).map((line, idx) => (
                          <Text key={idx}>{line}</Text>
                        ))}
                      </View>
                      <Text style={{ fontSize: 9, width: "15%" }}>{marker.callerNumber}</Text>
                      <Text style={{ fontSize: 9, width: "15%" }}>{marker.calleeNumber}</Text>
                      <Text style={{ fontSize: 9, width: "11%" }}>
                        {marker.startLocation?.latitude}, {marker.startLocation?.longitude}
                      </Text>
                      <Text style={{ fontSize: 9, width: "11%" }}>
                        {marker.endLocation?.latitude}, {marker.endLocation?.longitude}
                      </Text>
                      <Text style={{ fontSize: 9, width: "6%" }}>
                        {marker.duration ? formatDuration(marker.duration) : "-"}
                      </Text>
                      <Text style={{ fontSize: 9, width: "7%" }}>{getDirection(marker)}</Text>
                    </View>
                  ))
                ) : (
                  <Text style={styles.text}>No records in this cluster.</Text>
                )}
              </View>
            </View>
          ))
        ) : (
          <Text style={styles.text}>No geolocation clusters found.</Text>
        )}
      </View>
    </View>
  );
};
