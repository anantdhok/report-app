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
var __turbopack_async_dependencies__ = __turbopack_handle_async_dependencies__([
    __TURBOPACK__imported__module__$5b$externals$5d2f$puppeteer__$5b$external$5d$__$28$puppeteer$2c$__esm_import$29$__
]);
[__TURBOPACK__imported__module__$5b$externals$5d2f$puppeteer__$5b$external$5d$__$28$puppeteer$2c$__esm_import$29$__] = __turbopack_async_dependencies__.then ? (await __turbopack_async_dependencies__)() : __turbopack_async_dependencies__;
;
;
;
;
;
async function POST(req) {
    try {
        let body = null;
        try {
            body = await req.json();
        } catch  {
            body = null;
        }
        let parsed;
        // 🟢 Worker / direct data
        if (body && (body.data || body.report)) {
            parsed = body.data || body;
        } else {
            // 🟢 Direct API call to /api/pdf-data
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
        // core object as before
        const core = parsed?.data?.data || {};
        const callRecords = Array.isArray(core.calls) ? core.calls : [];
        const smsRecords = Array.isArray(core.sms) ? core.sms : [];
        console.log("DEBUG calls length:", Array.isArray(core.calls) ? core.calls.length : "no array");
        console.log("DEBUG sms length:", Array.isArray(core.sms) ? core.sms.length : "no array");
        const templatePath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), "src", "views", "report.ejs");
        const outputDir = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), "generated");
        __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].mkdirSync(outputDir, {
            recursive: true
        });
        const target = core.target || {};
        const reportMetadata = core.reportMetadata || {};
        // ---------- FULL PAYLOAD FOR SINGLE BIG PDF ----------
        const payload = {
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
                generatedAt: Date.now()
            },
            // Summary sections (same as pehle)
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
            // FULL CALLS TABLE (no chunking here)
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
                rows: callRecords.map((c)=>[
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
            // (If later you want SMS table in same PDF, can add here)
            smsRecordsDetailedTable: {
                headers: [],
                rows: []
            }
        };
        console.log("API payload rows (calls):", payload.callRecordsDetailedTable.rows.length);
        const html = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$ejs$2f$lib$2f$ejs$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].renderFile(templatePath, {
            payload
        });
        const finalPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(outputDir, `intelligence-report-full-${Date.now()}.pdf`);
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
            path: finalPath,
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
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Full PDF ready!",
            path: finalPath
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

//# sourceMappingURL=%5Broot-of-the-server%5D__c5b8e259._.js.map