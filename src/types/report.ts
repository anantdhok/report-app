import { ReactNode } from "react";

// Geolocation cluster types
export interface ClusteredMarkerRecord {
  callUID: string;
  start_lat: number;
  start_lng: number;
  end_lat: number;
  end_lng: number;
  caller: string;
  callee: string;
  duration: string;
  startTimestamp: string;
  endTimestamp: string;
  direction: string;
  sourceType: string;
}

export interface ClusteredMarker {
  position: [number, number];
  markers: Array<{
    record: ClusteredMarkerRecord;
    index: number;
    isStart: boolean;
    position: [number, number];
    isActive: boolean;
  }>;
  count: number;
}

export interface LocationData {
  house: string;
  street: string;
  city: string;
  state: string;
  pincode: string;
}
export type CriticalType = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

// Existing interfaces (consolidated)
export interface IValueObject {
  uuid: string;
  value: string;
}

export interface RiskPriority {
  uuid: string;
  value: string;
}

export interface Organisation {
  name: string;
}

export interface Comment {
  record_id?: string;
  created_at: string;
  content: ReactNode;
  user_name: string;
  comment: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  isActive: boolean;
}

export interface ITarget {
  id: string;
  code: string;
  targetNumber: string;
  fullName: string;
  aliases: string[];
  riskPriority: RiskPriority[];
  organisations: Organisation[];
  address: string;
  isMarked: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  isActive: boolean;
  fileCount: number;
  criticalFileCount: number;
  filteredFileCount: number;
  filteredCriticalFileCount: number;
}

export interface ITargetInfoDetails {
  fileCount: number;
  criticalFileCount: number;
  id?: string;
  code?: string;
  targetNumber?: string;
  fullName: string;
  aliases: string[];
  category: string[];
  description: string;
  userDetails: string[];
  riskPriority: RiskPriority[];
  organisations: Organisation[];
  address: LocationData;
}

export interface Comment_DB {
  id?: string;
  record_id: string;
  comment: string;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  isActive: boolean;
}
export interface ICallRecord {
  id: string;
  callDatetime: string;
  duration: number;
  callType: IValueObject[];
  category: IValueObject[];
  criticality: IValueObject[];
  comments: Comment[];
  summary: string;
  callReadStatus: string;
  callEndtime: string;
  callerNumber: string;
  calleeNumber: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  filePath: string;
  fileName: string;
  language: string | null;
  speakers: string[];
  callEntities: { Locator: CategoryList };
  // Updated to support both legacy string arrays and new object arrays
  globalKeywords: IKeyword[] | string[];
  targetKeywords: IKeyword[] | string[];
  startLocation?: { latitude: number | string; longitude: number | string };
  endLocation?: { latitude: number | string; longitude: number | string };
}

// New keyword interface to support both string and object formats
export interface IKeyword {
  phrase: string;
  language?: string;
  languageUuid?: string;
  label?: string;
  labelUuid?: string;
}

export interface ISmsRecord {
  id: string;
  smsDatetime: string;
  category: IValueObject[];
  criticality: IValueObject[];
  comment: string;
  smsFile: number;
  metaFile: number;
  targetId: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
}

export interface ISMSResponse {
  id: string;
  smsDatetime: string;
  category: string[];
  criticality: RiskPriority[];
  comments: Comment[];
  message: string;
  smsFile: number;
  metaFile: number;
  senderNumber: string;
  receiverNumber: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  summary: string;
  smsEntities: { Locator: CategoryList };
  smsType: RiskPriority[];
  targetKeywords: IKeyword[] | string[] | null;
  globalKeywords: IKeyword[] | string[] | null;
  filePath: string;
  fileName: string;
}

export interface IRecordSegments {
  id: string;
  smsDatetime: string;
  category: string[];
  criticality: RiskPriority[];
  comment: string;
  message: string;
  smsFile: number;
  metaFile: number;
  senderNumber: string;
  receiverNumber: string;
  isActive: boolean;
  createdAt: string;
  createdBy: string;
  updatedAt: string;
  updatedBy: string;
  summary: string;
  smsEntities: { Locator: CategoryList };
  startLocation?: { latitude: number | string; longitude: number | string };
  endLocation?: { latitude: number | string; longitude: number | string };
}
export interface DictKeywords {
  phrase: string;
  languageUuid: string;
  label: string;
  labelUuid: string;
}

export interface MatchedKeywords {
  data: {
    matchedTargetKeywords: TargetKeywordMatch[];
    matchedGlobalKeywords: GlobalKeywordMatch[];
  };
}

export interface TargetKeywordMatch {
  totalCount: ReactNode;
  label: CriticalType;
  keyword: string;
  priority: KeywordPriority;
  callIds: string[];
  occurrences: number;
}

export interface GlobalKeywordMatch {
  totalCount: ReactNode;
  label: string;
  keyword: string;
  priority: KeywordPriority;
  callIds: string[];
  occurrences: number;
}

export type KeywordPriority = "CRITICAL" | "HIGH" | "MEDIUM" | "LOW";

// Locators/Entities interfaces
export interface CategoryWord {
  value: string;
  calls: string[];
}

export interface CategoryItem {
  type: LocatorType;
  words: CategoryWord[];
}

export type CategoryList = CategoryItem[];

export type LocatorType =
  | "PERSON"
  | "ORGANIZATION"
  | "VEHICLE"
  | "VEHICLE_NUMBER"
  | "EMAIL"
  | "PHONE_NUMBER"
  | "ADDHAR_CARD"
  | "PASSPORT"
  | "ACCOUNT_NUMBER"
  | "MEETING"
  | "COUNTRY"
  | "STATE"
  | "WAR"
  | "DONATION"
  | "DARK_WEB"
  | "ATTACK"
  | "BOMB"
  | "LAPTOP"
  | "IP_ADDRESS"
  | "DIGITAL_ARTIFACTS"
  | "FINANCIAL_ENTITIES"
  | "FUNDS"
  | "WEAPONS"
  | "DRUGS"
  | "CRYPTO"
  | "CURRENCY"
  | "TIME"
  | "EDUCATION"
  | "EVENTS"
  | "LOCATION"
  | "VEHICLE NUMBER"
  | "DEFAULT";

// Color scheme interfaces
export interface ColorScheme {
  bg: string;
  text: string;
  label: string;
}

export interface KeywordColorScheme {
  bg: string;
  text: string;
}

// Main PDF Report Data interface
export interface PdfReportData {
  target: ITargetInfoDetails;
  callRecords: ICallRecord[];
  smsRecords: ISMSResponse[];
  targetVocabulary: DictKeywords[];
  comments?: Comment[];
  link: string;
  supportlink: string;
  generatedAt: string;
  reportMetadata: {
    totalCalls: number;
    totalSMS: number;
    criticalKeywords: number;
    highPriorityKeywords: number;
    entitiesFound: number;
    dateRange: {
      from: string;
      to: string;
    };
  };
}

// API Response types
export interface ApiResponse<T> {
  status: boolean;
  data: T;
}

export interface TargetData {
  target: ITargetInfoDetails;
  dictionary: DictKeywords[];
  comments: Comment[];
}

export const KEYWORD_COLORS: Record<KeywordPriority, KeywordColorScheme> = {
  CRITICAL: { bg: "#FFEBEE", text: "#D32F2F" },
  HIGH: { bg: "#FFF3E0", text: "#F57C00" },
  MEDIUM: { bg: "#FFF8E1", text: "#F9A825" },
  LOW: { bg: "#E8F5E8", text: "#388E3C" }
};

export const getKeywordColor = (
  priority: KeywordPriority
): { background: string; text: string } => {
  const colors = KEYWORD_COLORS[priority] || KEYWORD_COLORS.LOW;
  return {
    background: colors.bg,
    text: colors.text
  };
};

export default PdfReportData;
