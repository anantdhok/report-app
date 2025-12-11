module.exports = [
"[externals]/next/dist/compiled/next-server/app-route-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-route-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-route-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/@opentelemetry/api [external] (next/dist/compiled/@opentelemetry/api, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/@opentelemetry/api", () => require("next/dist/compiled/@opentelemetry/api"));

module.exports = mod;
}),
"[externals]/next/dist/compiled/next-server/app-page-turbo.runtime.dev.js [external] (next/dist/compiled/next-server/app-page-turbo.runtime.dev.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js", () => require("next/dist/compiled/next-server/app-page-turbo.runtime.dev.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-unit-async-storage.external.js [external] (next/dist/server/app-render/work-unit-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-unit-async-storage.external.js", () => require("next/dist/server/app-render/work-unit-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/work-async-storage.external.js [external] (next/dist/server/app-render/work-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/work-async-storage.external.js", () => require("next/dist/server/app-render/work-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/shared/lib/no-fallback-error.external.js [external] (next/dist/shared/lib/no-fallback-error.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/shared/lib/no-fallback-error.external.js", () => require("next/dist/shared/lib/no-fallback-error.external.js"));

module.exports = mod;
}),
"[externals]/next/dist/server/app-render/after-task-async-storage.external.js [external] (next/dist/server/app-render/after-task-async-storage.external.js, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("next/dist/server/app-render/after-task-async-storage.external.js", () => require("next/dist/server/app-render/after-task-async-storage.external.js"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/puppeteer [external] (puppeteer, esm_import)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

const mod = await __turbopack_context__.y("puppeteer");

__turbopack_context__.n(mod);
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, true);}),
"[externals]/fs/promises [external] (fs/promises, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs/promises", () => require("fs/promises"));

module.exports = mod;
}),
"[project]/src/app/api/pdf/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

return __turbopack_context__.a(async (__turbopack_handle_async_dependencies__, __turbopack_async_result__) => { try {

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ejs$2f$lib$2f$ejs$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/ejs/lib/ejs.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$puppeteer__$5b$external$5d$__$28$puppeteer$2c$__esm_import$29$__ = __turbopack_context__.i("[externals]/puppeteer [external] (puppeteer, esm_import)");
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$merger$2d$js$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/pdf-merger-js/index.js [app-route] (ecmascript)");
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$puppeteer__$5b$external$5d$__$28$puppeteer$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$puppeteer__$5b$external$5d$__$28$puppeteer$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
;
const CHUNK_SIZE = 5000;
async function POST(req) {
    try {
        let body = null;
        try {
            body = await req.json();
        } catch  {
            body = null;
        }
        let parsed;
        // 🟢 Worker se
        if (body && (body.data || body.report)) {
            parsed = body.data || body;
        } else {
            // 🟢 Direct API call
            const baseUrl = process.env.APP_URL || "http://localhost:3000";
            const res = await fetch(`${baseUrl}/api/pdf-data`, {
                method: "POST",
                cache: "no-store"
            });
            if (!res.ok) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    message: "Failed to fetch report data"
                }, {
                    status: 500
                });
            }
            const json = await res.json();
            parsed = json?.data;
        }
        const core = parsed?.data?.data || {};
        console.log("DEBUG parsed keys:", parsed && Object.keys(parsed));
        console.log("DEBUG calls length:", Array.isArray(core.calls) ? core.calls.length : "no array");
        console.log("DEBUG sms length:", Array.isArray(core.sms) ? core.sms.length : "no array");
        const callRecords = Array.isArray(core.calls) ? core.calls : [];
        const smsRecords = Array.isArray(core.sms) ? core.sms : [];
        console.log("API payload rows:", callRecords.length, smsRecords.length);
        const templatePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), "src", "views", "report.ejs");
        const outputDir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), "generated");
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].mkdirSync(outputDir, {
            recursive: true
        });
        const merger = new __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$pdf$2d$merger$2d$js$2f$index$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"]();
        const pdfPaths = [];
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
                    status: target.status || "N/A"
                },
                stats: {
                    totalCalls: callRecords.length,
                    totalSMS: smsRecords.length,
                    fileCount: reportMetadata.fileCount || "N/A",
                    highPriorityCalls: callRecords.filter((c)=>c?.criticality?.[0]?.value === "HIGH").length || 0,
                    generatedAt: Date.now(),
                    // summary ke liye indexing important nahi, default 0
                    chunkNumber: 0,
                    totalChunks: 0,
                    globalStartIndex: 0
                },
                topCallsSummaries: core.topCallsSummaries || [],
                entities: core.entities || {
                    persons: [],
                    locations: [],
                    organizations: []
                },
                keywordsSummary: core.keywordsSummary || {
                    targetKeywords: [],
                    globalKeywords: []
                },
                callRecordsDetailedTable: {
                    headers: [],
                    rows: []
                },
                smsRecordsDetailedTable: {
                    headers: [],
                    rows: []
                }
            };
            const html = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ejs$2f$lib$2f$ejs$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].renderFile(templatePath, {
                payload: summaryPayload
            });
            const summaryPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(outputDir, `report-summary-${Date.now()}.pdf`);
            const browser = await __TURBOPACK__imported__module__$5b$externals$5d2f$puppeteer__$5b$external$5d$__$28$puppeteer$2c$__esm_import$29$__["default"].launch({
                headless: true,
                args: [
                    "--no-sandbox"
                ]
            });
            const page = await browser.newPage();
            await page.emulateMediaType("screen");
            await page.setContent(html, {
                waitUntil: [
                    "domcontentloaded",
                    "networkidle0"
                ]
            });
            await page.pdf({
                path: summaryPath,
                format: "A4",
                printBackground: true,
                margin: {
                    top: "10mm",
                    right: "10mm",
                    bottom: "10mm",
                    left: "10mm"
                },
                scale: 0.9,
                preferCSSPageSize: true
            });
            await browser.close();
            pdfPaths.push(summaryPath);
            await merger.add(summaryPath);
        }
        // -------------------- 2️⃣ DETAIL PDFs (5000 rows per file) --------------------
        const totalChunks = Math.ceil(callRecords.length / CHUNK_SIZE);
        for(let i = 0; i < totalChunks; i++){
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
                    status: target.status || "N/A"
                },
                stats: {
                    totalCalls: callRecords.length,
                    totalSMS: smsRecords.length,
                    fileCount: reportMetadata.fileCount || "N/A",
                    highPriorityCalls: callRecords.filter((c)=>c?.criticality?.[0]?.value === "HIGH").length || 0,
                    generatedAt: Date.now(),
                    chunkNumber: i + 1,
                    totalChunks,
                    globalStartIndex: start
                },
                topCallsSummaries: [],
                entities: {
                    persons: [],
                    locations: [],
                    organizations: []
                },
                keywordsSummary: {
                    targetKeywords: [],
                    globalKeywords: []
                },
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
                    rows: callsChunk.map((c)=>[
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
                            c.fileName || "N/A"
                        ])
                },
                smsRecordsDetailedTable: {
                    headers: [],
                    rows: []
                }
            };
            console.log(`DETAIL CHUNK ${i + 1}/${totalChunks} rows:`, detailPayload.callRecordsDetailedTable.rows.length, "globalStartIndex:", detailPayload.stats.globalStartIndex);
            const html = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ejs$2f$lib$2f$ejs$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].renderFile(templatePath, {
                payload: detailPayload
            });
            const chunkPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(outputDir, `report-details-part-${i + 1}-${Date.now()}.pdf`);
            const browser = await __TURBOPACK__imported__module__$5b$externals$5d2f$puppeteer__$5b$external$5d$__$28$puppeteer$2c$__esm_import$29$__["default"].launch({
                headless: true,
                args: [
                    "--no-sandbox"
                ]
            });
            const page = await browser.newPage();
            await page.emulateMediaType("screen");
            await page.setContent(html, {
                waitUntil: [
                    "domcontentloaded",
                    "networkidle0"
                ]
            });
            await page.pdf({
                path: chunkPath,
                format: "A4",
                printBackground: true,
                margin: {
                    top: "10mm",
                    right: "10mm",
                    bottom: "10mm",
                    left: "10mm"
                },
                scale: 0.9,
                preferCSSPageSize: true
            });
            await browser.close();
            pdfPaths.push(chunkPath);
            await merger.add(chunkPath);
        }
        // -------------------- 3️⃣ MERGE PDFs --------------------
        const mergedFile = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(outputDir, `intelligence-report-merged-${Date.now()}.pdf`);
        await merger.save(mergedFile);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Merged PDF ready!",
            path: mergedFile
        }, {
            status: 200
        });
    } catch (err) {
        console.error("PDF generation error:", err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Internal Server Error"
        }, {
            status: 500
        });
    }
}
__turbopack_async_result__();
} catch(e) { __turbopack_async_result__(e); } }, false);}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__e66b9fd5._.js.map