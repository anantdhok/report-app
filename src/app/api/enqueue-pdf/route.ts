// src/app/api/enqueue-pdf/route.ts
import { NextResponse } from "next/server";
import { enqueuePdfJob } from "@/lib/rabbitmq";
import fs from "fs";
import path from "path";

export async function POST() {
  try {
    const id = "job-" + Date.now();

    const dataPath = path.join(process.cwd(), "data.json");
    const raw = JSON.parse(fs.readFileSync(dataPath, "utf-8"));

    await enqueuePdfJob({
      id,
      payload: raw
    });

    console.log("✅ Enqueued job via /api/enqueue-pdf:", id);

    return NextResponse.json({ ok: true, jobId: id });
  } catch (err) {
    console.error("❌ enqueue-pdf error:", err);
    return NextResponse.json({ ok: false }, { status: 500 });
  }
}
