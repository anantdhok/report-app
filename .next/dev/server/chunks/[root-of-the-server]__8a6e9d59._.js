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
"[project]/src/app/api/enqueue-pdf/route.ts [app-route] (ecmascript)", ((__turbopack_context__) => {
"use strict";

__turbopack_context__.s([
    "POST",
    ()=>POST
]);
var __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/node_modules/next/server.js [app-route] (ecmascript)");
var __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$rabbitmq$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__ = __turbopack_context__.i("[project]/src/lib/rabbitmq.ts [app-route] (ecmascript)"); // ya "../lib/rabbitmq" agar alias nahi hai
;
;
async function POST() {
    try {
        const id = "job-" + Date.now();
        await (0, __TURBOPACK__imported__module__$5b$project$5d2f$src$2f$lib$2f$rabbitmq$2e$ts__$5b$app$2d$route$5d$__$28$ecmascript$29$__["enqueuePdfJob"])({
            id,
            payload: {} // abhi /api/pdf khud data.json se lega
        });
        console.log("✅ Enqueued job via /api/enqueue-pdf:", id);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: true,
            jobId: id
        });
    } catch (err) {
        console.error("❌ enqueue-pdf error:", err);
        return __TURBOPACK__imported__module__$5b$project$5d2f$node_modules$2f$next$2f$server$2e$js__$5b$app$2d$route$5d$__$28$ecmascript$29$__["NextResponse"].json({
            ok: false
        }, {
            status: 500
        });
    }
}
}),
];

//# sourceMappingURL=%5Broot-of-the-server%5D__8a6e9d59._.js.map