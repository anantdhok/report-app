import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";
import ejs from "ejs";
import puppeteer from "puppeteer";
import PDFMerger from "pdf-merger-js";

const CHUNK_SIZE = 5000;

export async function POST(req: Request) {
  try {
    let body: any = null;

    try {
      body = await req.json();
    } catch {
      body = null;
    }

    let parsed: any;

    // 🟢 Worker se
    if (body && (body.data || body.report)) {
      parsed = body.data || body;
    } else {
      // 🟢 Direct API call
      const baseUrl = process.env.APP_URL || "http://localhost:3000";
      const res = await fetch(`${baseUrl}/api/pdf-data`, {
        method: "POST",
        cache: "no-store",
      });

      if (!res.ok) {
        return NextResponse.json(
          { message: "Failed to fetch report data" },
          { status: 500 }
        );
      }

      const json = await res.json();
      parsed = json?.data;
    }

    const core = parsed?.data?.data || {};

    console.log("DEBUG parsed keys:", parsed && Object.keys(parsed));
    console.log(
      "DEBUG calls length:",
      Array.isArray(core.calls) ? core.calls.length : "no array"
    );
    console.log(
      "DEBUG sms length:",
      Array.isArray(core.sms) ? core.sms.length : "no array"
    );

    const callRecords: any[] = Array.isArray(core.calls) ? core.calls : [];
    const smsRecords: any[] = Array.isArray(core.sms) ? core.sms : [];

    console.log("API payload rows:", callRecords.length, smsRecords.length);

    const templatePath = path.join(process.cwd(), "src", "views", "report.ejs");

    const outputDir = path.join(process.cwd(), "generated");
    fs.mkdirSync(outputDir, { recursive: true });

    const merger = new PDFMerger();
    const pdfPaths: string[] = [];

    const target = core.target || {};
    const reportMetadata = core.reportMetadata || {};

    // -------------------- 1️⃣ SUMMARY PDF --------------------
    {
      const summaryPayload = {
        title: "Intelligence Report",
        targetInfo: {
          code: target.targetCode || "N/A",
          number: target.targetNumber || "Unknown",
          name: target.fullName || "N/A",
          aliases: target.aliases?.join(", ") || "None",
          categories: target.categories?.join(", ") || "N/A",
          status: target.status || "N/A",
        },
        stats: {
          totalCalls: callRecords.length,
          totalSMS: smsRecords.length,
          fileCount: reportMetadata.fileCount || "N/A",
          highPriorityCalls:
            callRecords.filter((c) => c?.criticality?.[0]?.value === "HIGH")
              .length || 0,
          generatedAt: Date.now(),
          // summary ke liye indexing important nahi, default 0
          chunkNumber: 0,
          totalChunks: 0,
          globalStartIndex: 0,
        },
        topCallsSummaries: core.topCallsSummaries || [],
        entities: core.entities || {
          persons: [],
          locations: [],
          organizations: [],
        },
        keywordsSummary: core.keywordsSummary || {
          targetKeywords: [],
          globalKeywords: [],
        },
        callRecordsDetailedTable: { headers: [], rows: [] },
        smsRecordsDetailedTable: { headers: [], rows: [] },
      };

      const html = await ejs.renderFile(templatePath, { payload: summaryPayload });

      const summaryPath = path.join(
        outputDir,
        `report-summary-${Date.now()}.pdf`
      );

      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox"],
      });

      const page = await browser.newPage();
      await page.emulateMediaType("screen");
      await page.setContent(html, {
        waitUntil: ["domcontentloaded", "networkidle0"],
      });

      await page.pdf({
        path: summaryPath,
        format: "A4",
        printBackground: true,
        margin: {
          top: "10mm",
          right: "10mm",
          bottom: "10mm",
          left: "10mm",
        },
        scale: 0.9,
        preferCSSPageSize: true,
      });

      await browser.close();

      pdfPaths.push(summaryPath);
      await merger.add(summaryPath);
    }

    // -------------------- 2️⃣ DETAIL PDFs (5000 rows per file) --------------------
    const totalChunks = Math.ceil(callRecords.length / CHUNK_SIZE);

    for (let i = 0; i < totalChunks; i++) {
      const start = i * CHUNK_SIZE;
      const end = Math.min(start + CHUNK_SIZE, callRecords.length);
      const callsChunk = callRecords.slice(start, end);

      const detailPayload = {
        title: `Intelligence Report - Calls ${start + 1} to ${end}`,
        targetInfo: {
          code: target.targetCode || "N/A",
          number: target.targetNumber || "Unknown",
          name: target.fullName || "N/A",
          aliases: target.aliases?.join(", ") || "None",
          categories: target.categories?.join(", ") || "N/A",
          status: target.status || "N/A",
        },
        stats: {
          totalCalls: callRecords.length,
          totalSMS: smsRecords.length,
          fileCount: reportMetadata.fileCount || "N/A",
          highPriorityCalls:
            callRecords.filter((c) => c?.criticality?.[0]?.value === "HIGH")
              .length || 0,
          generatedAt: Date.now(),
          chunkNumber: i + 1,
          totalChunks,
          globalStartIndex: start,
        },
        topCallsSummaries: [],
        entities: { persons: [], locations: [], organizations: [] },
        keywordsSummary: { targetKeywords: [], globalKeywords: [] },

        callRecordsDetailedTable: {
          headers: [
            "DateTime",
            "Duration",
            "Caller",
            "Callee",
            "Type",
            "Category",
            "Criticality",
            "Status",
            "Language",
            "Location",
            "File",
          ],
          rows: callsChunk.map((c) => [
            c.callDatetime || "N/A",
            `${c.duration || 0}s`,
            c.callerNumber || "N/A",
            c.calleeNumber || "N/A",
            c.callType || "N/A",
            c.category || "N/A",
            c.criticality?.[0]?.value || "N/A",
            c.status || "N/A",
            c.language || "N/A",
            c.location || "N/A",
            c.fileName || "N/A",
          ]),
        },
        smsRecordsDetailedTable: { headers: [], rows: [] },
      };

      console.log(
        `DETAIL CHUNK ${i + 1}/${totalChunks} rows:`,
        detailPayload.callRecordsDetailedTable.rows.length,
        "globalStartIndex:",
        detailPayload.stats.globalStartIndex
      );

      const html = await ejs.renderFile(templatePath, { payload: detailPayload });

      const chunkPath = path.join(
        outputDir,
        `report-details-part-${i + 1}-${Date.now()}.pdf`
      );

      const browser = await puppeteer.launch({
        headless: true,
        args: ["--no-sandbox"],
      });

      const page = await browser.newPage();
      await page.emulateMediaType("screen");
      await page.setContent(html, {
        waitUntil: ["domcontentloaded", "networkidle0"],
      });

      await page.pdf({
        path: chunkPath,
        format: "A4",
        printBackground: true,
        margin: {
          top: "10mm",
          right: "10mm",
          bottom: "10mm",
          left: "10mm",
        },
        scale: 0.9,
        preferCSSPageSize: true,
      });

      await browser.close();

      pdfPaths.push(chunkPath);
      await merger.add(chunkPath);
    }

    // -------------------- 3️⃣ MERGE PDFs --------------------
    const mergedFile = path.join(
      outputDir,
      `intelligence-report-merged-${Date.now()}.pdf`
    );

    await merger.save(mergedFile);

    return NextResponse.json(
      { message: "Merged PDF ready!", path: mergedFile },
      { status: 200 }
    );
  } catch (err) {
    console.error("PDF generation error:", err);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
