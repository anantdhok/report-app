import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/db";
import fs from "fs/promises";

export async function GET(
  _req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;

    const job = await prisma.reportJob.findUnique({
      where: { id },
    });

    if (!job || !job.finalPdfPath) {
      return NextResponse.json(
        { error: "PDF not found" },
        { status: 404 }
      );
    }

    const fileBuffer = await fs.readFile(job.finalPdfPath);

    // Response send kar do
    const res = new NextResponse(fileBuffer, {
      status: 200,
      headers: {
        "Content-Type": "application/pdf",
        "Content-Disposition": `attachment; filename="${id}.pdf"`,
      },
    });

    // Background cleanup
    (async () => {
      try {
        if (job.finalPdfPath) {
          await fs.unlink(job.finalPdfPath);
        }
      } catch (err) {
        console.error("Failed to delete file after download:", err);
      }

      try {
        await prisma.reportJob.delete({ where: { id } });
      } catch (err) {
        console.error("Failed to delete job after download:", err);
      }
    })();

    return res;
  } catch (error) {
    console.error("GET /api/report/:id/download error:", error);
    return NextResponse.json(
      { error: "Failed to download PDF" },
      { status: 500 }
    );
  }
}
