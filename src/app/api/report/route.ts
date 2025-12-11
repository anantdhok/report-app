import { NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import { enqueuePdfJob } from "@/lib/rabbitmq";

export async function POST(req: Request) {
  try {
    const body = await req.json().catch(() => null);
    const targetId = body?.targetId as string | undefined;
    const requestBy = body?.requestBy as string | undefined;

    if (!targetId) {
      return NextResponse.json(
        { error: "targetId is required" },
        { status: 400 }
      );
    }

    const requestId = `rep_${Date.now()}`;

    await prisma.reportJob.create({
      data: {
        id: requestId,
        targetId,
        status: "queued",
        requestBy: requestBy || null,
      },
    });

    await enqueuePdfJob({
      id: requestId,
      payload: { requestId },
    });

    return NextResponse.json(
      { requestId, status: "queued" },
      { status: 202 }
    );
  } catch (err) {
    console.error("POST /api/report error:", err);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}
