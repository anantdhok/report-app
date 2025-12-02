import { Text, View } from "@react-pdf/renderer";

import {
  CategoryList,
  ICallRecord,
  IKeyword,
  ISMSResponse,
  KeywordPriority,
  LocatorType,
  PdfReportData
} from "@/types/report";

import { Pill, SectionTitle } from "./pdf-layout";
import { styles } from "./pdf-styles";
import { formatLocatorType } from "./pdf-utils";

type KeywordMatch = {
  keyword: string;
  label?: KeywordPriority;
  totalCount: number;
  recordIds: string[];
};
type LocatorMatch = {
  value: string;
  type: LocatorType;
  totalCount: number;
  recordIds: string[];
};

export function groupLocatorsByCategory(
  locators: CategoryList
): Record<string, Array<{ value: string; calls: string[]; type: LocatorType }>> {
  return locators.reduce(
    (acc, locator) => {
      const category = formatLocatorType(locator.type);
      if (!acc[category]) {
        acc[category] = [];
      }
      acc[category].push(
        ...locator.words.map((word) => ({
          ...word,
          type: locator.type
        }))
      );
      return acc;
    },
    {} as Record<string, Array<{ value: string; calls: string[]; type: LocatorType }>>
  );
}

export const KeywordsLocatorsSection = ({ report }: { report: PdfReportData }) => {
  const callRecords: ICallRecord[] = report.callRecords || [];
  const smsRecords: ISMSResponse[] = report.smsRecords || [];

  const keywordMap: Record<string, KeywordMatch> = {};
  const locatorMap: Record<string, LocatorMatch> = {};

  [...callRecords, ...smsRecords].forEach((rec) => {
    [
      ...((rec.targetKeywords as IKeyword[]) || []),
      ...((rec.globalKeywords as IKeyword[]) || [])
    ].forEach((kw) => {
      const key = kw.phrase;
      if (!keywordMap[key]) {
        keywordMap[key] = {
          keyword: key,
          label: kw.label as KeywordPriority,
          totalCount: 0,
          recordIds: []
          // calls: []
        };
      }
      keywordMap[key].totalCount += 1;
      keywordMap[key].recordIds.push(rec.id);
      // keywordMap[key].calls.push(call);
    });

    // Locators
    let locators: { type: LocatorType; words: { value: string }[] }[] = [];
    if ("callEntities" in rec && rec.callEntities?.Locator) {
      locators = rec.callEntities.Locator;
    } else if ("smsEntities" in rec && rec.smsEntities?.Locator) {
      locators = rec.smsEntities.Locator;
    }

    locators.forEach((locator: { type: LocatorType; words: { value: string }[] }) => {
      const type = locator.type;
      (locator.words || []).forEach((word) => {
        const key = `${type}::${word.value}`;
        if (!locatorMap[key]) {
          locatorMap[key] = {
            value: word.value,
            type,
            totalCount: 0,
            recordIds: []
          };
        }
        locatorMap[key].totalCount += 1;
        locatorMap[key].recordIds.push(rec.id);
        // locatorMap[key].calls.push(call);
      });
    });
  });

  const allKeywords: KeywordMatch[] = Object.values(keywordMap);
  const allLocators: LocatorMatch[] = Object.values(locatorMap);

  // Group locators by type
  const locatorsByType: Record<string, LocatorMatch[]> = {};
  allLocators.forEach((locator) => {
    if (!locatorsByType[locator.type]) locatorsByType[locator.type] = [];
    locatorsByType[locator.type].push(locator);
  });

  return (
    <>
      <View style={{ ...styles.section, flexGrow: 0 }}>
        <Text style={{ fontSize: 15, fontWeight: "semibold", marginBottom: 8 }}>
          Keywords & Locators Analysis
        </Text>
        <Text style={{ fontSize: 11, lineHeight: 1.4, color: "#888", width: "90%" }}>
          Identified keywords and locators from call and SMS transcripts by cross-matching the text
          against a target vocabulary and a global dictionary, and extracted all relevant entity
          references present within the conversations.
        </Text>
      </View>

      <View style={{ ...styles.section, flexGrow: 0 }}>
        <SectionTitle title={`Extracted Keywords (${allKeywords.length} items)`} />
        <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
          {allKeywords?.map((k, i) => {
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
                <Text style={{ color: textColor, fontSize: 10, fontWeight: 600 }}>
                  {k.keyword}
                  {k.totalCount && ` (${k.totalCount})`}
                </Text>
              </Pill>
            );
          })}
        </View>
      </View>

      <View style={styles.section}>
        <SectionTitle title={`Extracted Locators (${Object.keys(locatorsByType).length} types)`} />
        {Object.entries(locatorsByType).map(([type, locators]) => (
          <View key={type} style={{ marginBottom: 12 }}>
            <Text style={{ fontSize: 10, marginBottom: 8, color: "#888" }}>
              {formatLocatorType(type as LocatorType)} ({locators.length})
            </Text>
            <View style={{ flexDirection: "row", flexWrap: "wrap", gap: 6, marginBottom: 12 }}>
              {locators.map((l, i) => {
                return (
                  <Pill color="#E8F5E8" key={i}>
                    <Text style={{ color: "#388E3C", fontSize: 10, fontWeight: 600 }}>
                      {l.value}
                      {l.totalCount && ` (${l.totalCount})`}
                    </Text>
                  </Pill>
                );
              })}
            </View>
          </View>
        ))}
      </View>
    </>
  );
};
