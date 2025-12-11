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
"[externals]/fs [external] (fs, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("fs", () => require("fs"));

module.exports = mod;
}),
"[externals]/path [external] (path, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("path", () => require("path"));

module.exports = mod;
}),
"[project]/src/app/api/pdf-data/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

// src/app/api/pdf-data/route.ts
__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/fs [external] (fs, cjs)");
var __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/path [external] (path, cjs)");
;
;
;
async function POST() {
    try {
        const dataPath = __TURBOPACK__imported__module__$5b$externals$5d2f$path__$5b$external$5d$__$28$path$2c$__cjs$29$__["default"].join(process.cwd(), "data.json");
        const raw = JSON.parse(__TURBOPACK__imported__module__$5b$externals$5d2f$fs__$5b$external$5d$__$28$fs$2c$__cjs$29$__["default"].readFileSync(dataPath, "utf-8"));
        const payload = raw?.data?.data || {};
        const calls = payload.calls || payload.callRecords || [];
        const sms = payload.sms || payload.smsRecords || [];
        // 🔥 Target ko first call/sms + extra fields se derive karo
        const firstCall = Array.isArray(calls) && calls.length > 0 ? calls[0] : null;
        const targetDerived = payload.target || (firstCall ? {
            // yeh values tumhare report.pdf me dikh rahi hain
            code: payload.targetCode || `TGT${firstCall.callerNumber || firstCall.calleeNumber || ""}`,
            targetNumber: payload.targetNumber || firstCall.callerNumber || firstCall.calleeNumber || "",
            fullName: payload.fullName || "Unknown",
            aliases: payload.aliases || [],
            category: payload.category || [],
            isMarked: payload.isMarked ?? false,
            fileCount: payload.fileCount ?? payload.reportMetadata?.totalCalls ?? calls.length ?? 0,
            criticalFileCount: payload.criticalFileCount ?? payload.reportMetadata?.criticalKeywords ?? 0,
            filteredFileCount: payload.filteredFileCount ?? calls.length ?? 0,
            filteredCriticalFileCount: payload.filteredCriticalFileCount ?? payload.reportMetadata?.highPriorityKeywords ?? 0,
            callCount: payload.callCount ?? calls.length ?? 0,
            criticalCallCount: payload.criticalCallCount ?? 0,
            smsCount: payload.smsCount ?? sms.length ?? 0,
            criticalSMSCount: payload.criticalSMSCount ?? 0
        } : {});
        const core = {
            target: targetDerived,
            calls,
            sms,
            matchedTargetKeywords: payload.matchedKeywords?.data?.matchedTargetKeywords || payload.matchedTargetKeywords || [],
            matchedGlobalKeywords: payload.matchedKeywords?.data?.matchedGlobalKeywords || payload.matchedGlobalKeywords || [],
            locators: payload.locators || [],
            reportMetadata: payload.reportMetadata || {
                totalCalls: Array.isArray(calls) ? calls.length : 0,
                totalSMS: Array.isArray(sms) ? sms.length : 0,
                fileCount: targetDerived.fileCount ?? (Array.isArray(calls) ? calls.length : 0)
            }
        };
        console.log("API /api/pdf-data core keys:", Object.keys(core || {}));
        console.log("API /api/pdf-data core.target keys:", Object.keys(core.target || {}));
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            data: {
                data: core
            }
        });
    } catch (err) {
        console.error("❌ pdf-data error:", err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            error: "Data load failed"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__6caaccfa._.js.map