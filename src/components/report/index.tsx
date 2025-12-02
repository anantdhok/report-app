import { Document, Page } from "@react-pdf/renderer";

import PdfReportData from "@/types/report";

import { Footer, Header, MainHeader } from "./pdf-layout";
import { CallRecordsSection } from "./pdf-section-calls";
import { KeywordsLocatorsSection } from "./pdf-section-entities";
import { GeolocationsSection } from "./pdf-section-geolocations";
import { SmsRecordsSection } from "./pdf-section-sms";
import { TargetInfoSection } from "./pdf-section-target";
import { TargetVocabSection } from "./pdf-section-vocabs";
import { styles } from "./pdf-styles";

const Template = ({ report, timestamp }: { report: PdfReportData; timestamp: string }) => (
  <Document>
    {/* Target info and comments */}
    <Page key="target-info" size="A4" style={{ ...styles.page, paddingTop: 80 }}>
      <MainHeader text="Target Insights Report" timestamp={timestamp} />
      <TargetInfoSection report={report} />
      <Footer timestamp={timestamp} />
    </Page>

    {/* Keywords and Locators */}
    <Page key="keywords-locators" size="A4" style={styles.page}>
      <Header text="Keywords & Locators Analysis" />
      <KeywordsLocatorsSection report={report} />
      <Footer timestamp={timestamp} />
    </Page>

    {/* Call Records */}
    {report.callRecords?.map((call) => (
      <Page key={call.id} size="A4" style={styles.page}>
        <CallRecordsSection call={call} />
        <Footer timestamp={timestamp} />
      </Page>
    ))}

    {/* SMS Records */}
    {report.smsRecords?.map((sms) => (
      <Page key={sms.id} size="A4" style={styles.page}>
        <Header text="SMS Record" />
        <SmsRecordsSection sms={sms} />
        <Footer timestamp={timestamp} />
      </Page>
    ))}

    {/* Geolocation Clusters */}
    <Page key="geolocation-clusters" size="A4" style={styles.page}>
      <Header text="Geolocation Clusters" />
      <GeolocationsSection report={report} />
      <Footer timestamp={timestamp} />
    </Page>

    {/* Target Vocabulary */}
    <Page key="vocabulary" size="A4" style={styles.page}>
      <Header text="Target Vocabulary" />
      <TargetVocabSection report={report} />
      <Footer timestamp={timestamp} />
    </Page>
  </Document>
);

export default function PdfDocument({ report }: { report: any }) {
  const timestamp = new Date().toLocaleString(undefined, {
    hour: "2-digit",
    minute: "2-digit",
    year: "numeric",
    month: "short",
    day: "numeric"
  });
  return Template({ report, timestamp });
}
