import fs from "fs";
import path from "path";
import { NextResponse } from "next/server";
import { enqueuePdfJob } from "@/lib/rabbitmq";

export async function GET() {
  const dataPath = path.join(process.cwd(), "src", "data.json");

  try {
    if (!fs.existsSync(dataPath)) {
      return new NextResponse("Data not available", {
        status: 404,
        headers: { "Content-Type": "text/plain" },
      });
    }

    const raw = fs.readFileSync(dataPath, "utf-8");
    const parsed = JSON.parse(raw);

    console.log("Loaded report data from data.json");

    const reportId = await enqueuePdfJob(parsed);

    console.log("Enqueued PDF job:", reportId);

    return NextResponse.json(
      {
        reportId,
        status: "queued",
        message: "PDF generation job has been queued",
      },
      { status: 202 }
    );
  } catch (err) {
    console.error("Error in /api/pdf:", err);

    return new NextResponse("Internal Server Error", {
      status: 500,
      headers: { "Content-Type": "text/plain" },
    });
  }
}
