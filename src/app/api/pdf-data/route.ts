// src/app/api/pdf-data/route.ts
import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";

export async function POST() {
  try {
    const dataPath = path.join(process.cwd(), "data.json");
    const raw = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

    const payload = raw?.data?.data || {};

    const calls = payload.calls || payload.callRecords || [];
    const sms = payload.sms || payload.smsRecords || [];

    // 🔥 Target ko first call/sms + extra fields se derive karo
    const firstCall = Array.isArray(calls) && calls.length > 0 ? calls[0] : null;

    const targetDerived =
      payload.target ||
      (firstCall
        ? {
            // yeh values tumhare report.pdf me dikh rahi hain
            code: payload.targetCode || `TGT${firstCall.callerNumber || firstCall.calleeNumber || ""}`,
            targetNumber: payload.targetNumber || firstCall.callerNumber || firstCall.calleeNumber || "",
            fullName: payload.fullName || "Unknown",
            aliases: payload.aliases || [],          // agar payload me ho to aa jayega
            category: payload.category || [],        // Recruitment, Narcotics etc.
            isMarked: payload.isMarked ?? false,
            fileCount: payload.fileCount ?? payload.reportMetadata?.totalCalls ?? calls.length ?? 0,
            criticalFileCount: payload.criticalFileCount ?? payload.reportMetadata?.criticalKeywords ?? 0,
            filteredFileCount: payload.filteredFileCount ?? calls.length ?? 0,
            filteredCriticalFileCount:
              payload.filteredCriticalFileCount ?? payload.reportMetadata?.highPriorityKeywords ?? 0,
            callCount: payload.callCount ?? calls.length ?? 0,
            criticalCallCount: payload.criticalCallCount ?? 0,
            smsCount: payload.smsCount ?? sms.length ?? 0,
            criticalSMSCount: payload.criticalSMSCount ?? 0,
          }
        : {});

    const core = {
      target: targetDerived,
      calls,
      sms,
      matchedTargetKeywords:
        payload.matchedKeywords?.data?.matchedTargetKeywords ||
        payload.matchedTargetKeywords ||
        [],
      matchedGlobalKeywords:
        payload.matchedKeywords?.data?.matchedGlobalKeywords ||
        payload.matchedGlobalKeywords ||
        [],
      locators: payload.locators || [],
      reportMetadata:
        payload.reportMetadata || {
          totalCalls: Array.isArray(calls) ? calls.length : 0,
          totalSMS: Array.isArray(sms) ? sms.length : 0,
          fileCount: targetDerived.fileCount ?? (Array.isArray(calls) ? calls.length : 0),
        },
    };

    console.log("API /api/pdf-data core keys:", Object.keys(core || {}));
    console.log(
      "API /api/pdf-data core.target keys:",
      Object.keys(core.target || {})
    );

    return NextResponse.json({
      data: {
        data: core,
      },
    });
  } catch (err) {
    console.error("❌ pdf-data error:", err);
    return NextResponse.json({ error: "Data load failed" }, { status: 500 });
  }
}
