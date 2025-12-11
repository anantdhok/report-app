import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import fs from "fs/promises";

export async function DELETE(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params; // yahan await

    const job = await prisma.reportJob.findUnique({
      where: { id },
    });

    if (!job) {
      return NextResponse.json(
        { error: "Job not found" },
        { status: 404 }
      );
    }

    // PDF file delete kar (agar path hai)
    if (job.finalPdfPath) {
      try {
        await fs.unlink(job.finalPdfPath);
      } catch (err) {
        console.error("Failed to delete file:", err);
      }
    }

    // DB row delete
    await prisma.reportJob.delete({
      where: { id },
    });

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("DELETE /api/report/:id error:", error);
    return NextResponse.json(
      { error: "Failed to delete job" },
      { status: 500 }
    );
  }
}
