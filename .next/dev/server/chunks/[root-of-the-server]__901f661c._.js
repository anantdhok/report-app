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
"[externals]/util [external] (util, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("util", () => require("util"));

module.exports = mod;
}),
"[externals]/querystring [external] (querystring, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("querystring", () => require("querystring"));

module.exports = mod;
}),
"[externals]/assert [external] (assert, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("assert", () => require("assert"));

module.exports = mod;
}),
"[externals]/stream [external] (stream, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("stream", () => require("stream"));

module.exports = mod;
}),
"[externals]/events [external] (events, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("events", () => require("events"));

module.exports = mod;
}),
"[externals]/tls [external] (tls, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("tls", () => require("tls"));

module.exports = mod;
}),
"[externals]/net [external] (net, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("net", () => require("net"));

module.exports = mod;
}),
"[project]/src/lib/rabbitmq.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "enqueuePdfJob",
    ()=>enqueuePdfJob
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$amqplib$2f$channel_api$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/amqplib/channel_api.js [app-route] (ecmascript)");
;
const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672";
const QUEUE_NAME = "pdf_report_queue";
// --- Connection + channel pool ---
let connection = null;
let channels = [];
let channelIndex = 0;
const POOL_SIZE = 5;
async function initRabbitmq() {
    if (connection && channels.length > 0) {
        return;
    }
    const conn = await __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$amqplib$2f$channel_api$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["default"].connect(RABBITMQ_URL);
    connection = conn;
    connection.on("error", (err)=>{
        console.error("RabbitMQ connection error:", err);
    });
    connection.on("close", ()=>{
        console.warn("RabbitMQ connection closed, clearing pool");
        connection = null;
        channels = [];
        channelIndex = 0;
    });
    const createdChannels = [];
    for(let i = 0; i < POOL_SIZE; i++){
        const ch = await connection.createChannel();
        await ch.assertQueue(QUEUE_NAME, {
            durable: true
        });
        createdChannels.push(ch);
    }
    channels = createdChannels;
    console.log(`RabbitMQ: connected, queue: ${QUEUE_NAME}, channel pool size: ${POOL_SIZE}`);
}
async function getChannelFromPool() {
    await initRabbitmq();
    if (!connection || channels.length === 0) {
        throw new Error("No RabbitMQ channels available in pool");
    }
    const ch = channels[channelIndex];
    channelIndex = (channelIndex + 1) % channels.length;
    return ch;
}
async function enqueuePdfJob(job) {
    const ch = await getChannelFromPool();
    const finalJob = {
        ...job,
        createdAt: job.createdAt ?? new Date().toISOString()
    };
    const ok = ch.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(finalJob)), {
        persistent: true
    });
    if (!ok) {
        throw new Error("Failed to enqueue PDF job");
    }
    console.log(`Enqueued PDF job on pooled channel:`, finalJob.id);
    return finalJob.id;
}
}),
"[externals]/@prisma/client [external] (@prisma/client, cjs)", ((__turbopack_context__, module, exports) => {

const mod = __turbopack_context__.x("@prisma/client", () => require("@prisma/client"));

module.exports = mod;
}),
"[project]/src/lib/db.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "prisma",
    ()=>prisma
]);
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
;
const globalForPrisma = globalThis;
const prisma = globalForPrisma.prisma ?? new __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["PrismaClient"]({
    log: [
        "error",
        "warn"
    ]
});
if ("TURBOPACK compile-time truthy", 1) {
    globalForPrisma.prisma = prisma;
}
}),
"[project]/src/app/api/pdf/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$rabbitmq$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/rabbitmq.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/db.ts [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__ = __turbopack_context__.i("[externals]/@prisma/client [external] (@prisma/client, cjs)");
;
;
;
;
async function POST(req) {
    try {
        // 1) Body se data lene ki koshish
        let body = null;
        try {
            body = await req.json();
        } catch  {
            body = null;
        }
        let parsed;
        if (body && body.data) {
            // Direct mode: client ne JSON bheja hua hai
            parsed = body.data;
        } else {
            // Fallback: internal /api/pdf-data se lo
            const baseUrl = process.env.APP_URL || "http://localhost:3000";
            const res = await fetch(`${baseUrl}/api/pdf-data`, {
                method: "POST",
                cache: "no-store"
            });
            if (!res.ok) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    message: "Failed to fetch report data from /api/pdf-data"
                }, {
                    status: 500
                });
            }
            const json = await res.json();
            if (!json.ok || !json.data) {
                return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
                    message: "Invalid data from /api/pdf-data"
                }, {
                    status: 500
                });
            }
            // json = { ok, data }
            // json.data = { status, data }
            parsed = json.data;
        }
        // ---------- YAHAN SE NAYA JSON UNWRAP ----------
        // parsed = { status, data }
        // parsed.data = { data, filteredCount, page, ... }
        // parsed.data.data = { calls, sms, target?, matchedKeywords?, ... }
        const root = parsed; // { status, data }
        const inner = root?.data || {}; // { data, filteredCount, ... }
        const core = inner?.data || {}; // { calls, sms, target?, ... }
        // Ab yahan se arrays lo
        const callRecords = Array.isArray(core.calls) ? core.calls : [];
        const smsRecords = Array.isArray(core.sms) ? core.sms : [];
        // DEBUG: count dekhne ke liye
        console.log("DEBUG pdf counts:", callRecords.length, smsRecords.length);
        // Agar target object aata hai to use lo, warna best‑effort se derive karo
        const target = core.target || {
            code: "N/A",
            targetNumber: callRecords[0]?.callerNumber || callRecords[0]?.calleeNumber || "N/A",
            fullName: "Target",
            aliases: [],
            category: [],
            description: "",
            isActive: true,
            riskPriority: "HIGH",
            createdAt: callRecords[0]?.createdAt,
            updatedAt: callRecords[callRecords.length - 1]?.updatedAt,
            fileCount: callRecords.length + smsRecords.length,
            filteredFileCount: callRecords.length + smsRecords.length,
            criticalFileCount: callRecords.filter((c)=>c.criticality?.[0]?.value === "HIGH").length,
            filteredCriticalFileCount: callRecords.filter((c)=>c.criticality?.[0]?.value === "HIGH").length
        };
        const matchedKeywords = core.matchedKeywords || {};
        const clusteredMarkers = Array.isArray(core.clusteredMarkers) ? core.clusteredMarkers : [];
        const targetVocabulary = Array.isArray(core.targetVocabulary) ? core.targetVocabulary : [];
        const reportMetadata = core.reportMetadata || {};
        // ---------- BAAD KA SARA CODE WAHI (reportPayload, prisma, enqueue) ----------
        const extractEntities = (records, entityType)=>{
            return Array.from(new Set(records.flatMap((r)=>{
                const loc = r.callEntities?.Locator;
                const entity = loc?.find((l)=>l.type === entityType);
                return entity?.words || [];
            }).map((w)=>w.value)));
        };
        const getThreatLevel = (criticality)=>{
            return criticality === "HIGH" ? "🔴 CRITICAL" : criticality === "MEDIUM" ? "🟠 MODERATE" : "🟢 LOW";
        };
        const reportPayload = {
            title: `Intelligence Report - ${target.fullName || "Target"} (${target.targetNumber || "N/A"})`,
            coverPage: {
                classification: reportMetadata.classification || "CONFIDENTIAL",
                generatedAt: new Date().toLocaleString("en-IN"),
                reportId: reportMetadata.reportId || `RPT-${Date.now()}`,
                analyst: reportMetadata.analyst || "System Generated"
            },
            targetInfo: {
                code: target.code || "N/A",
                number: target.targetNumber || "N/A",
                name: target.fullName || "N/A",
                aliases: Array.isArray(target.aliases) ? target.aliases.join(", ") : "N/A",
                categories: Array.isArray(target.category) ? target.category.join(", ") : "N/A",
                description: target.description || "No description",
                status: target.isActive ? "🔴 ACTIVE" : "🟢 INACTIVE",
                riskPriority: target.riskPriority || getThreatLevel(target.riskLevel || "LOW"),
                createdAt: target.createdAt ? new Date(target.createdAt).toLocaleDateString() : "N/A",
                updatedAt: target.updatedAt ? new Date(target.updatedAt).toLocaleDateString() : "N/A"
            },
            userDetails: target.userDetails || {
                email: "N/A",
                phone: "N/A",
                address: target.address || "N/A",
                city: "N/A",
                state: "N/A",
                country: "N/A"
            },
            organizations: Array.isArray(target.organisations) ? target.organisations.map((org)=>({
                    name: org.name || org,
                    role: org.role || "Associated",
                    riskLevel: org.riskLevel || "UNKNOWN"
                })) : [],
            stats: {
                totalCalls: callRecords.length,
                totalSMS: smsRecords.length,
                totalRecords: callRecords.length + smsRecords.length,
                highPriorityCalls: callRecords.filter((c)=>c.criticality?.[0]?.value === "HIGH").length,
                mediumPriorityCalls: callRecords.filter((c)=>c.criticality?.[0]?.value === "MEDIUM").length,
                lowPriorityCalls: callRecords.filter((c)=>c.criticality?.[0]?.value === "LOW").length,
                highPrioritySMS: smsRecords.filter((s)=>s.criticality?.[0]?.value === "HIGH").length,
                fileCount: target.fileCount || callRecords.length + smsRecords.length,
                filteredFileCount: target.filteredFileCount || 0,
                criticalFiles: target.criticalFileCount || 0,
                filteredCriticalFileCount: target.filteredCriticalFileCount || 0,
                callCount: callRecords.length,
                smsCount: smsRecords.length,
                criticalCallCount: callRecords.filter((c)=>c.criticality?.[0]?.value === "HIGH").length,
                criticalSMSCount: smsRecords.filter((s)=>s.criticality?.[0]?.value === "HIGH").length,
                generatedAt: new Date().toISOString()
            },
            callRecordsDetailedTable: {
                headers: [
                    "DateTime",
                    "Duration",
                    "Caller",
                    "Callee",
                    "Type",
                    "Category",
                    "Priority",
                    "Status",
                    "Language",
                    "Location",
                    "File"
                ],
                rows: callRecords.map((c)=>[
                        c.callDatetime ? new Date(c.callDatetime).toLocaleString("en-IN") : "N/A",
                        c.duration ? `${c.duration}s` : "N/A",
                        c.callerNumber || "N/A",
                        c.calleeNumber || "N/A",
                        c.callType?.[0]?.value || "N/A",
                        Array.isArray(c.category) ? c.category.map((x)=>x.value || x).join(", ") : "General",
                        c.criticality?.[0]?.value || "N/A",
                        c.callReadStatus ? "✓ Read" : "Unread",
                        c.language || "N/A",
                        c.startLocation ? `${c.startLocation.latitude}, ${c.startLocation.longitude}` : "N/A",
                        c.fileName || "N/A"
                    ])
            },
            smsRecordsDetailedTable: {
                headers: [
                    "DateTime",
                    "From",
                    "Type",
                    "Category",
                    "Priority",
                    "Message",
                    "Status",
                    "File"
                ],
                rows: smsRecords.map((s)=>[
                        s.smsDatetime ? new Date(s.smsDatetime).toLocaleString("en-IN") : "N/A",
                        s.senderNumber || "Unknown",
                        s.smsType?.[0]?.value || "N/A",
                        Array.isArray(s.category) ? s.category.map((x)=>x.value || x).join(", ") : "General",
                        s.criticality?.[0]?.value || "N/A",
                        (s.message || "N/A").substring(0, 100),
                        s.smsReadStatus ? "✓ Read" : "Unread",
                        s.fileName || "N/A"
                    ])
            },
            topCallsSummaries: callRecords.slice(0, 10).map((c, idx)=>({
                    index: idx + 1,
                    time: c.callDatetime ? new Date(c.callDatetime).toLocaleString("en-IN") : "N/A",
                    from: c.callerNumber || "N/A",
                    to: c.calleeNumber || "N/A",
                    duration: c.duration ? `${c.duration}s` : "N/A",
                    priority: c.criticality?.[0]?.value || "N/A",
                    category: Array.isArray(c.category) ? c.category.map((x)=>x.value || x).join(", ") : "N/A",
                    summary: c.summary || "No summary available",
                    speakers: Array.isArray(c.speakers) && c.speakers.length > 0 ? c.speakers.join(", ") : "N/A",
                    comments: Array.isArray(c.comments) && c.comments.length > 0 ? c.comments.map((cm)=>cm.content || cm.text || cm).join("; ") : "N/A"
                })),
            entities: {
                persons: extractEntities(callRecords, "PERSON"),
                locations: extractEntities(callRecords, "LOCATION"),
                organizations: extractEntities(callRecords, "ORGANIZATION"),
                phoneNumbers: Array.from(new Set(callRecords.map((c)=>[
                        c.callerNumber,
                        c.calleeNumber
                    ]).flat().filter(Boolean)))
            },
            geographicData: {
                clusteredLocations: clusteredMarkers.map((marker)=>({
                        cluster: marker.cluster || "N/A",
                        latitude: marker.position?.[0] || marker.latitude || "N/A",
                        longitude: marker.position?.[1] || marker.longitude || "N/A",
                        count: marker.count || 0,
                        description: marker.description || "Cluster point"
                    })),
                callLocations: callRecords.filter((c)=>c.startLocation?.latitude).map((c)=>({
                        datetime: c.callDatetime ? new Date(c.callDatetime).toLocaleString("en-IN") : "N/A",
                        latitude: c.startLocation.latitude,
                        longitude: c.startLocation.longitude,
                        caller: c.callerNumber,
                        callee: c.calleeNumber
                    }))
            },
            keywordsSummary: {
                targetKeywords: (matchedKeywords.matchedTargetKeywords || []).slice(0, 20).map((k)=>({
                        keyword: k.keyword || "N/A",
                        label: k.label || "N/A",
                        callCount: k.callCount || 0,
                        smsCount: k.smsCount || 0,
                        totalCount: k.totalCount || 0,
                        threat: getThreatLevel(k.label || "LOW")
                    })),
                globalKeywords: (matchedKeywords.matchedGlobalKeywords || []).slice(0, 20).map((k)=>({
                        keyword: k.keyword || "N/A",
                        label: k.label || "N/A",
                        callCount: k.callCount || 0,
                        smsCount: k.smsCount || 0,
                        totalCount: k.totalCount || 0,
                        threat: getThreatLevel(k.label || "LOW")
                    }))
            },
            vocabularyAnalysis: targetVocabulary.slice(0, 30).map((v)=>({
                    word: v.phrase || v.word || v,
                    frequency: v.totalCount || v.frequency || v.count || 1,
                    context: "General",
                    language: v.language || "Unknown",
                    sentiment: v.label || "Neutral"
                })),
            threatAssessment: {
                overallThreat: target.riskPriority || getThreatLevel(callRecords.some((c)=>c.criticality?.[0]?.value === "HIGH") ? "HIGH" : "MEDIUM"),
                threatFactors: [
                    {
                        factor: "High Priority Communications",
                        count: callRecords.filter((c)=>c.criticality?.[0]?.value === "HIGH").length,
                        severity: "HIGH"
                    },
                    {
                        factor: "Suspicious Keywords Detected",
                        count: (matchedKeywords.matchedGlobalKeywords || []).filter((k)=>k.label === "HIGH").length,
                        severity: "HIGH"
                    },
                    {
                        factor: "Geographic Movement",
                        count: clusteredMarkers.length,
                        severity: "MEDIUM"
                    },
                    {
                        factor: "Associated Organizations",
                        count: (target.organisations || []).length,
                        severity: "MEDIUM"
                    },
                    {
                        factor: "Contact Network Size",
                        count: Array.from(new Set(callRecords.map((c)=>[
                                c.callerNumber,
                                c.calleeNumber
                            ]).flat().filter(Boolean))).length,
                        severity: target.riskLevel === "HIGH" ? "HIGH" : "MEDIUM"
                    }
                ],
                recommendations: [
                    "Continuous monitoring recommended",
                    "Cross-reference with known associates",
                    "Geographic tracking in priority areas",
                    "Keyword alert optimization needed",
                    "Network analysis expansion suggested"
                ]
            },
            rawJson: JSON.stringify(parsed, null, 2),
            summary: {
                reportTitle: `Intelligence Report - ${target.fullName || "Target"}`,
                targetNumber: target.targetNumber,
                targetCode: target.code,
                generatedDate: new Date().toLocaleString("en-IN"),
                totalPages: 25,
                dataPoints: {
                    calls: callRecords.length,
                    sms: smsRecords.length,
                    uniqueContacts: Array.from(new Set(callRecords.map((c)=>[
                            c.callerNumber,
                            c.calleeNumber
                        ]).flat().filter(Boolean))).length,
                    locations: clusteredMarkers.length,
                    keywords: (matchedKeywords.matchedGlobalKeywords || []).length
                }
            }
        };
        // 3) File record create karo
        const fileRecord = await __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$db$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["prisma"].file.create({
            data: {
                fileName: `intelligence-report-${Date.now()}.pdf`,
                status: __TURBOPACK__imported__module__$5b$externals$5d2f40$prisma$2f$client__$5b$external$5d$__$2840$prisma$2f$client$2c$__cjs$29$__["FileStatus"].queued,
                requestBy: "system",
                downloadUrl: ""
            }
        });
        // 4) RabbitMQ me job daalo
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$rabbitmq$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["enqueuePdfJob"])({
            id: fileRecord.id,
            payload: reportPayload
        });
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            fileId: fileRecord.id,
            status: fileRecord.status,
            message: "PDF generation queued"
        }, {
            status: 202
        });
    } catch (err) {
        console.error("❌ /api/pdf error:", err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            message: "Internal server error"
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__901f661c._.js.map