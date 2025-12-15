// // src/index.ts
// import fs from "fs";
// import path from "path";
// import amqp, { ConsumeMessage } from "amqplib";
// import dotenv from "dotenv";
// import ejs from "ejs";
// import PDFMerger from "pdf-merger-js";
// import puppeteer from "puppeteer";
// import fetch from "node-fetch";
// import { withLogging } from "./middlewares/logger";
// import { withErrorHandling } from "./middlewares/errorHandler";


// import { PrismaClient } from "@prisma/client";
// import { withLogging } from "./middlewares/logger.js";
// import { withErrorHandling } from "./middlewares/errorHandler.js";

// src/index.ts
import * as fs from "fs";
import path from "path";
import amqp, { ConsumeMessage } from "amqplib";
import dotenv from "dotenv";
import ejs from "ejs";
import PDFMerger from "pdf-merger-js";
import puppeteer from "puppeteer";
import fetch from "node-fetch";

import { PrismaClient } from "@prisma/client";
import { withLogging } from "./middlewares/logger";
import { withErrorHandling } from "./middlewares/errorHandler";
import { createApiServer } from "./api/server";




dotenv.config();

const prisma = new PrismaClient();

const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672";
const QUEUE_NAME = process.env.QUEUE_NAME || "pdf_report_queue";
const APP_URL = process.env.APP_URL || "http://localhost:3001";
const API_PORT = parseInt(process.env.API_PORT || "3001", 10);
const CHUNK_SIZE = 5000;

// Project root as base
const ROOT_DIR = path.resolve();
// EJS template ka path (src/views/report.ejs)
const TEMPLATE_PATH = path.join(ROOT_DIR, "src", "views", "report.ejs");

type JobStatus =
  | "queued"
  | "fetching_data"
  | "generating_structure"
  | "generating_chunks"
  | "merging_and_cleaning"
  | "completed"
  | "failed";

async function updateStatus(
  id: string,
  status: JobStatus,
  extra: Partial<{
    finalPdfPath: string;
    chunkPaths: string;
    errorMessage: string;
  }> = {}
) {
  await prisma.reportJob.update({
    where: { id },
    data: {
      status,
      finalPdfPath: extra.finalPdfPath,
      chunkPaths: extra.chunkPaths,
      errorMessage: extra.errorMessage,
      completedAt: status === "completed" ? new Date() : undefined
    }
  });
}

const processJob = withLogging(
  withErrorHandling(async (job: any) => {
    const requestId = job.id || job.requestId;
    console.log("➡️ Worker processing report:", requestId);

    try {
      // 1) FETCH DATA
      await updateStatus(requestId, "fetching_data");

      const reportJob = await prisma.reportJob.findUnique({
        where: { id: requestId }
      });
      if (!reportJob) throw new Error("ReportJob not found");

      const targetId = reportJob.targetId;

      const dataRes = await fetch(`${APP_URL}/api/pdf-data`, {
        method: "POST",
        body: JSON.stringify({ targetId }),
        headers: { "Content-Type": "application/json" }
      });

      if (!dataRes.ok) {
        const errorText = await dataRes.text();
        throw new Error(`Failed to fetch pdf-data: ${dataRes.status} - ${errorText}`);
      }

      const json: any = await dataRes.json();
      const core = json?.data?.data ?? {};

      const callRecords: any[] = Array.isArray(core.calls) ? core.calls : [];
      const smsRecords: any[] = Array.isArray(core.sms) ? core.sms : [];

      // 2) SUMMARY / STRUCTURE
      await updateStatus(requestId, "generating_structure");

      const outputDir = path.join(ROOT_DIR, "generated");
      fs.mkdirSync(outputDir, { recursive: true });

      const targetRaw = core.target || {};
      const reportMetadata = core.reportMetadata || {};

      await updateStatus(requestId, "generating_chunks");

      const merger = new PDFMerger();
      const chunkPaths: string[] = [];

      // ---------- SUMMARY PDF ----------
      {
        const summaryPayload = {
          title: "Intelligence Report",
          targetInfo: {
            code: targetRaw.code || targetRaw.targetCode || "N/A",
            number: targetRaw.targetNumber || targetRaw.phoneNumber || "Unknown",
            name: targetRaw.fullName || "N/A",
            aliases:
              Array.isArray(targetRaw.aliases) && targetRaw.aliases.length
                ? targetRaw.aliases.join(", ")
                : "None",
            categories:
              Array.isArray(targetRaw.category) && targetRaw.category.length
                ? targetRaw.category.join(", ")
                : "N/A",
            status:
              typeof targetRaw.isMarked === "boolean"
                ? targetRaw.isMarked
                  ? "Marked"
                  : "Unmarked"
                : "N/A"
          },
          stats: {
            totalCalls: callRecords.length,
            totalSMS: smsRecords.length,
            fileCount: reportMetadata.fileCount ?? "N/A",
            highPriorityCalls:
              callRecords.filter((c) => c?.criticality?.[0]?.value === "HIGH").length || 0,
            generatedAt: Date.now(),
            chunkNumber: 0,
            totalChunks: 0,
            globalStartIndex: 0
          },
          topCallsSummaries: core.matchedTargetKeywords || [],
          entities: core.locators || {
            persons: [],
            locations: [],
            organizations: []
          },
          keywordsSummary: core.matchedGlobalKeywords || {
            targetKeywords: [],
            globalKeywords: []
          },
          callRecordsDetailedTable: { headers: [], rows: [] },
          smsRecordsDetailedTable: { headers: [], rows: [] }
        };

        const html = await ejs.renderFile(TEMPLATE_PATH, { payload: summaryPayload });
        const summaryPath = path.join(outputDir, `${requestId}-summary-${Date.now()}.pdf`);

        const browser = await puppeteer.launch({
          headless: true,
          args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(60000);
        page.setDefaultTimeout(60000);
        await page.emulateMediaType("screen");
        await page.setContent(html, { waitUntil: "domcontentloaded", timeout: 60000 });
        await page.pdf({
          path: summaryPath,
          format: "A4",
          printBackground: true,
          margin: { top: "10mm", right: "10mm", bottom: "10mm", left: "10mm" },
          scale: 0.9,
          preferCSSPageSize: true
        });
        await browser.close();

        chunkPaths.push(summaryPath);
        await merger.add(summaryPath);
      }

      // ---------- CALL CHUNKS ----------
      const totalChunks = Math.ceil(callRecords.length / CHUNK_SIZE);

      for (let i = 0; i < totalChunks; i++) {
        const start = i * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, callRecords.length);
        const callsChunk = callRecords.slice(start, end);

        const detailPayload = {
          title: `Intelligence Report - Calls ${start + 1} to ${end}`,
          targetInfo: {
            code: targetRaw.code || targetRaw.targetCode || "N/A",
            number: targetRaw.targetNumber || targetRaw.phoneNumber || "Unknown",
            name: targetRaw.fullName || "N/A",
            aliases:
              Array.isArray(targetRaw.aliases) && targetRaw.aliases.length
                ? targetRaw.aliases.join(", ")
                : "None",
            categories:
              Array.isArray(targetRaw.category) && targetRaw.category.length
                ? targetRaw.category.join(", ")
                : "N/A",
            status:
              typeof targetRaw.isMarked === "boolean"
                ? targetRaw.isMarked
                  ? "Marked"
                  : "Unmarked"
                : "N/A"
          },
          stats: {
            totalCalls: callRecords.length,
            totalSMS: smsRecords.length,
            fileCount: reportMetadata.fileCount ?? "N/A",
            highPriorityCalls:
              callRecords.filter((c) => c?.criticality?.[0]?.value === "HIGH").length || 0,
            generatedAt: Date.now(),
            chunkNumber: i + 1,
            totalChunks,
            globalStartIndex: start
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
              "File"
            ],
            rows: callsChunk.map((c) => [
              c.callDatetime || "N/A",
              `${c.duration || 0}s`,
              c.callerNumber || "N/A",
              c.calleeNumber || "N/A",
              c.callType?.[0]?.value || c.callType || "N/A",
              c.category?.[0]?.value || "N/A",
              c.criticality?.[0]?.value || "N/A",
              c.callReadStatus || "N/A",
              c.language || "N/A",
              `${c.startLocation?.latitude || ""},${c.startLocation?.longitude || ""}`,
              c.fileName || "N/A"
            ])
          },
          smsRecordsDetailedTable: { headers: [], rows: [] }
        };

        const html = await ejs.renderFile(TEMPLATE_PATH, { payload: detailPayload });
        const chunkPath = path.join(
          outputDir,
          `${requestId}-part-${i + 1}-${Date.now()}.pdf`
        );

        const browser = await puppeteer.launch({
          headless: true,
          args: ["--no-sandbox", "--disable-setuid-sandbox"]
        });
        const page = await browser.newPage();
        page.setDefaultNavigationTimeout(60000);
        page.setDefaultTimeout(60000);
        await page.emulateMediaType("screen");
        await page.setContent(html, { waitUntil: "domcontentloaded", timeout: 60000 });
        await page.pdf({
          path: chunkPath,
          format: "A4",
          printBackground: true,
          margin: { top: "10mm", right: "10mm", bottom: "10mm", left: "10mm" },
          scale: 0.9,
          preferCSSPageSize: true
        });
        await browser.close();

        chunkPaths.push(chunkPath);
        await merger.add(chunkPath);
      }

      // ---------- MERGE ----------
      await updateStatus(requestId, "merging_and_cleaning", {
        chunkPaths: JSON.stringify(chunkPaths)
      });

      const finalPath = path.join(outputDir, `${requestId}-merged-${Date.now()}.pdf`);
      await merger.save(finalPath);

      for (const p of chunkPaths) {
        fs.unlink(p, () => { });
      }

      await updateStatus(requestId, "completed", { finalPdfPath: finalPath });

      console.log("✅ Report completed:", requestId, finalPath);
    } catch (err: any) {
      console.error("❌ Worker job error:", err);
      await updateStatus(requestId, "failed", {
        errorMessage: err?.message || "Unknown error"
      });
      throw err;
    }
  }),
  "processJob"
);

async function startWorker() {
  console.log("🚀 Worker starting...");
  const connection = await amqp.connect(RABBITMQ_URL);
  const channel = await connection.createChannel();

  await channel.assertQueue(QUEUE_NAME, { durable: true });
  await channel.prefetch(1);

  console.log("👷 PDF worker listening on queue:", QUEUE_NAME);

  setInterval(() => {
    console.log("❤️ worker alive");
  }, 5000);

  channel.consume(
    QUEUE_NAME,
    async (msg: ConsumeMessage | null) => {
      if (!msg) return;

      try {
        const content = msg.content.toString();
        const job = JSON.parse(content);

        console.log("📥 Job received:", job.id);

        await updateStatus(job.id, "queued");
        await processJob(job);

        channel.ack(msg);
        console.log("✅ Job done:", job.id);
      } catch (err) {
        console.error("❌ Worker error:", err);
        channel.nack(msg, false, false);
      }
    },
    { noAck: false }
  );
}

console.log("🔧 pdf-worker index.ts loaded");

async function start() {
  // Start API server first
  console.log("🌐 Starting API server...");
  createApiServer(API_PORT);

  // Then start worker
  await startWorker();
}

start().catch((err) => {
  console.error("Worker fatal error:", err);
  process.exit(1);
});
