import { NextResponse } from "next/server";

export async function GET() {
  try {
    const baseUrl = process.env.APP_URL || "http://localhost:3000";

    const res = await fetch(`${baseUrl}/api/pdf-data`, {
      method: "POST",
      cache: "no-store",
    });

    if (!res.ok) {
      return NextResponse.json(
        { message: "Failed to fetch data for export" },
        { status: 500 }
      );
    }

    const json = await res.json();
    if (!json.ok || !json.data) {
      return NextResponse.json(
        { message: "Invalid data from /api/pdf-data" },
        { status: 500 }
      );
    }

    const root: any = json.data;
    const inner = root?.data || {};
    const core = inner?.data || {};

    const callRecords: any[] = Array.isArray(core.calls) ? core.calls : [];

    const headers = [
      "callDatetime",
      "duration",
      "callerNumber",
      "calleeNumber",
      "callType",
      "category",
      "criticality",
      "fileName",
    ];

    const lines = [
      headers.join(","), // header row
      ...callRecords.map((c) => {
        const vals = [
          c.callDatetime || "",
          c.duration || "",
          c.callerNumber || "",
          c.calleeNumber || "",
          c.callType?.[0]?.value || "",
          Array.isArray(c.category)
            ? c.category.map((x: any) => x.value || x).join("|")
            : "",
          c.criticality?.[0]?.value || "",
          c.fileName || "",
        ];
        return vals
          .map((v) =>
            `"${String(v).replace(/"/g, '""').replace(/\r?\n/g, " ")}"`
          )
          .join(",");
      }),
    ];

    const csv = lines.join("\n");

    return new NextResponse(csv, {
      status: 200,
      headers: {
        "Content-Type": "text/csv; charset=utf-8",
        "Content-Disposition": `attachment; filename="calls-export.csv"`,
      },
    });
  } catch (err) {
    console.error("❌ /api/calls-export error:", err);
    return NextResponse.json(
      { message: "Internal server error" },
      { status: 500 }
    );
  }
}
