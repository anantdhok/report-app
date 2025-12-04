// src/app/api/report/id/status/route.ts

// TODO: Implement report status lookup by ID.
// This endpoint will:
// - Read report metadata (from DB or JSON store)
// - Return { status, fileUrl? } for the given reportId
// - Be used by the client to poll PDF generation status

import { NextResponse } from "next/server";

export async function GET() {
  return NextResponse.json(
    {
      message: "Report status endpoint not implemented yet",
    },
    { status: 501 }
  );
}
