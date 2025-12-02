import { KeywordPriority, LocatorType } from "@/types/report";

// Tag/Badge styles
const styles = {
  tagLow: { backgroundColor: "#f6ffed", color: "#52c41a" },
  tagDefault: { backgroundColor: "#e1e8e3", color: "#000" },
  tagMedium: { backgroundColor: "#fff7e6", color: "#fa8c16" },
  tagHigh: { backgroundColor: "#fff2e8", color: "#fa541c" },
  tagCritical: { backgroundColor: "#fff1f0", color: "#f5222d" },
  tagImportant: { backgroundColor: "#fff7e6", color: "#fa8c16" },
  tagMarketing: { backgroundColor: "#f0f5ff", color: "#2f54eb" },
  tagCall: { backgroundColor: "#e6f7ff", color: "#1890ff" },
  tagSMS: { backgroundColor: "#f6ffed", color: "#52c41a" }
};

export const formatDuration = (duration: number) => {
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  return `${minutes.toString().padStart(2, "0")}:${seconds.toString().padStart(2, "0")}`;
};

export const getCriticalityTag = (criticality: string) => {
  const criticalityLower = criticality.toLowerCase();
  switch (criticalityLower) {
    case "critical":
      return { style: styles.tagCritical, text: "Critical" };
    case "high":
      return { style: styles.tagHigh, text: "High" };
    case "medium":
      return { style: styles.tagMedium, text: "Medium" };
    case "low":
      return { style: styles.tagLow, text: "Low" };
    default:
      return { style: styles.tagDefault, text: "Not Critical" };
  }
};

export const getCategoryTag = (category: string) => {
  const categoryLower = category?.toLowerCase();
  switch (categoryLower) {
    case "important":
      return { style: styles.tagImportant, text: "Important" };
    case "marketing":
      return { style: styles.tagMarketing, text: "Marketing" };
    default:
      return { style: styles.tagImportant, text: category };
  }
};

export const maskPhoneNumber = (number: string) => {
  if (!number) return "";
  // Keep first 2 and last 3 digits, mask the middle
  if (number.length > 5) {
    const start = number.slice(0, 2);
    const end = number.slice(-3);
    const middle = "*".repeat(Math.max(0, number.length - 5));
    return `${start}${middle}${end}`;
  }
  return number;
};

// Truncate text to prevent overflow
export const truncateText = (text: string, maxLength: number = 50) => {
  if (!text) return "";
  return text.length > maxLength ? text.substring(0, maxLength) + "..." : text;
};

export const getKeywordStyle = (priority: KeywordPriority) => {
  switch (priority) {
    case "CRITICAL":
      return { backgroundColor: "#ffebee", color: "#d32f2f" };
    case "HIGH":
      return { backgroundColor: "#fff3e0", color: "#f57c00" };
    case "MEDIUM":
      return { backgroundColor: "#fff8e1", color: "#f9a825" };
    case "LOW":
    default:
      return { backgroundColor: "#e8f5e8", color: "#388e3c" };
  }
};

export const getLocatorStyle = (type: LocatorType) => {
  const locatorStyles: Record<LocatorType | any, { backgroundColor: string; color: string }> = {
    PERSON: { backgroundColor: "#d9f7be", color: "#52c41a" },
    ORGANIZATION: { backgroundColor: "#e6f7ff", color: "#1890ff" },
    LOCATION: { backgroundColor: "#fff0f6", color: "#eb2f96" },
    VEHICLE: { backgroundColor: "#f9f0ff", color: "#722ed1" },
    "VEHICLE NUMBER": { backgroundColor: "#f0f5ff", color: "#722ed1" },
    VEHICLE_NUMBER: { backgroundColor: "#f0f5ff", color: "#722ed1" },
    EMAIL: { backgroundColor: "#fff7e6", color: "#fa8c16" },
    "PHONE NUMBER": { backgroundColor: "#f0f5ff", color: "#2f54eb" },
    PHONE_NUMBER: { backgroundColor: "#f0f5ff", color: "#2f54eb" },
    "ADDHAR CARD": { backgroundColor: "#fff0f6", color: "#eb2f96" },
    ADDHAR_CARD: { backgroundColor: "#fff0f6", color: "#eb2f96" },
    PASSPORT: { backgroundColor: "#e6fffb", color: "#13c2c2" },
    "ACCOUNT NUMBER": { backgroundColor: "#fff0f6", color: "#c41d7f" },
    ACCOUNT_NUMBER: { backgroundColor: "#fff0f6", color: "#c41d7f" },
    MEETING: { backgroundColor: "#e6f7ff", color: "#1890ff" },
    COUNTRY: { backgroundColor: "#fff7e6", color: "#fa541c" },
    STATE: { backgroundColor: "#fff2e8", color: "#fa541c" },
    WAR: { backgroundColor: "#ffccc7", color: "#f5222d" },
    DONATION: { backgroundColor: "#f0f5ff", color: "#2f54eb" },
    "DARK WEB": { backgroundColor: "#434343", color: "#ffffff" },
    DARK_WEB: { backgroundColor: "#434343", color: "#ffffff" },
    ATTACK: { backgroundColor: "#ffccc7", color: "#f5222d" },
    BOMB: { backgroundColor: "#ff7875", color: "#ffffff" },
    LAPTOP: { backgroundColor: "#f6ffed", color: "#52c41a" },
    IP_ADDRESS: { backgroundColor: "#fafafa", color: "#8c8c8c" },
    DIGITAL_ARTIFACTS: { backgroundColor: "#f9f0ff", color: "#722ed1" },
    FINANCIAL_ENTITIES: { backgroundColor: "#fff1f0", color: "#f5222d" },
    FUNDS: { backgroundColor: "#fff2e8", color: "#fa541c" },
    WEAPONS: { backgroundColor: "#fffbe6", color: "#fadb14" },
    DRUGS: { backgroundColor: "#fff0f6", color: "#eb2f96" },
    CRYPTO: { backgroundColor: "#f6ffed", color: "#52c41a" },
    CURRENCY: { backgroundColor: "#fff7e6", color: "#fa8c16" },
    TIME: { backgroundColor: "#e6f7ff", color: "#1890ff" },
    EDUCATION: { backgroundColor: "#f6ffed", color: "#52c41a" },
    EVENTS: { backgroundColor: "#e6f7ff", color: "#1890ff" },
    DEFAULT: { backgroundColor: "#fafafa", color: "#8c8c8c" }
  };
  return locatorStyles[type] || locatorStyles.DEFAULT;
};

export const formatLocatorType = (type: LocatorType) => {
  const typeMap: Record<LocatorType | string, string> = {
    PERSON: "Names Mentioned",
    ORGANIZATION: "Organizations",
    LOCATION: "Address/Locations",
    VEHICLE: "Vehicle",
    "VEHICLE NUMBER": "Vehicle Numbers",
    VEHICLE_NUMBER: "Vehicle Numbers",
    EMAIL: "Phone/Emails",
    "PHONE NUMBER": "Phone/Emails",
    PHONE_NUMBER: "Phone/Emails",
    "ADDHAR CARD": "Aadhaar Card",
    ADDHAR_CARD: "Aadhaar Card",
    PASSPORT: "Passport",
    "ACCOUNT NUMBER": "Financial Items",
    ACCOUNT_NUMBER: "Financial Items",
    FINANCIAL_ENTITIES: "Financial Items",
    FUNDS: "Financial Items",
    CURRENCY: "Financial Items",
    MEETING: "Meeting", // matches your label
    EVENTS: "Date Event", // matches your label
    TIME: "Time", // matches your label
    COUNTRY: "Country",
    STATE: "State",
    WAR: "War",
    DONATION: "Donation Mentioned",
    "DARK WEB": "Dark Web",
    DARK_WEB: "Dark Web",
    ATTACK: "Attack",
    BOMB: "Bomb",
    LAPTOP: "Laptop",
    IP_ADDRESS: "IP Address",
    DIGITAL_ARTIFACTS: "Digital Artifact Mentioned",
    EDUCATION: "Education Mentioned",
    WEAPONS: "Weapons",
    DRUGS: "Drugs",
    CRYPTO: "Crypto",
    DEFAULT: "Default Mentioned"
  };

  return typeMap[type] || "Default Mentioned";
};

export const formatDateTime = (dateString: string, specifier: string) => {
  return (
    new Date(dateString).toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric"
    }) +
    ` ${specifier} ` +
    new Date(dateString).toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      hour12: false
    })
  );
};

export function breakTextToLines(text: string, maxLen: number = 15): string[] {
  const result = [];
  for (let i = 0; i < text.length; i += maxLen) {
    result.push(text.slice(i, i + maxLen));
  }
  return result;
}
