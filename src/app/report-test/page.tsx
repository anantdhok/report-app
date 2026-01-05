"use client";

import { useEffect, useState } from "react";

type Status =
  | "queued"
  | "fetching_data"
  | "generating_structure"
  | "generating_chunks"
  | "merging_and_cleaning"
  | "completed"
  | "failed"
  | null;

const STEP_ORDER: Status[] = [
  "queued",
  "fetching_data",
  "generating_structure",
  "generating_chunks",
  "merging_and_cleaning",
  "completed",
];

function getProgressFromStatus(status: Status) {
  if (!status) return 0;
  const idx = STEP_ORDER.indexOf(status);
  if (idx === -1) return 0;
  return Math.round((idx / (STEP_ORDER.length - 1)) * 100);
}

const STATUS_LABEL: Record<string, string> = {
  queued: "Queued",
  fetching_data: "Fetching data",
  generating_structure: "Preparing structure",
  generating_chunks: "Generating chunks",
  merging_and_cleaning: "Merging & cleaning",
  completed: "Completed",
  failed: "Failed",
};

export default function ReportTestPage() {
  const [requestId, setRequestId] = useState<string | null>(null);
  const [status, setStatus] = useState<Status>(null);
  const [isLoading, setIsLoading] = useState(false);

  async function handleCreate() {
    try {
      setIsLoading(true);
      setRequestId(null);
      setStatus(null);

      const res = await fetch("/api/report", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          targetId: "TGT_UI_TEST_1",
          requestBy: "atul",
        }),
      });

      const data = await res.json();
      setRequestId(data.requestId);
      setStatus(data.status); // "queued"
    } finally {
      setIsLoading(false);
    }
  }

  async function handleDelete() {
    if (!requestId) return;
    await fetch(`/api/report/${requestId}`, { method: "DELETE" });
    setRequestId(null);
    setStatus(null);
  }

  useEffect(() => {
    if (!requestId) return;

    const interval = setInterval(async () => {
      const res = await fetch(`/api/report/${requestId}/status`);
      if (!res.ok) return;
      const data = await res.json();
      setStatus(data.status as Status);

      if (data.status === "completed" || data.status === "failed") {
        clearInterval(interval);
      }
    }, 3000);

    return () => clearInterval(interval);
  }, [requestId]);

  const progress = getProgressFromStatus(status);
  const canDownload = status === "completed";
  const canDelete = status === "completed" || status === "failed";

  const statusLabel = status ? STATUS_LABEL[status] ?? status : "";

  return (
    <div
      style={{
        minHeight: "100vh",
        margin: 0,
        background:
          "radial-gradient(circle at top, #020617 0, #020617 40%, #020617 55%, #020617 100%)",
        backgroundColor: "#020617",
        color: "#e5e7eb",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        padding: 24,
        fontFamily: `system-ui, -apple-system, BlinkMacSystemFont, "SF Pro Text", sans-serif`,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 520,
          borderRadius: 24,
          border: "1px solid rgba(148,163,184,0.18)",
          background:
            "linear-gradient(145deg, rgba(15,23,42,0.98), rgba(15,23,42,0.92))",
          boxShadow:
            "0 30px 60px rgba(0,0,0,0.65), 0 0 0 1px rgba(15,23,42,0.9)",
          padding: 24,
          position: "relative",
          overflow: "hidden",
        }}
      >
        {/* subtle glow */}
        <div
          style={{
            position: "absolute",
            inset: 0,
            pointerEvents: "none",
            background:
              "radial-gradient(circle at top left, rgba(34,197,94,0.18), transparent 55%), radial-gradient(circle at top right, rgba(59,130,246,0.18), transparent 55%)",
            opacity: 0.9,
          }}
        />

        <div style={{ position: "relative", zIndex: 1 }}>
          {/* Header */}
          <div style={{ marginBottom: 20 }}>
            <h1
              style={{
                fontSize: 22,
                fontWeight: 600,
                letterSpacing: "-0.02em",
                marginBottom: 4,
              }}
            >
              PDF Report Generator
            </h1>
            <p
              style={{
                fontSize: 13,
                color: "#9ca3af",
                maxWidth: 360,
                lineHeight: 1.4,
              }}
            >
              Create a report, watch generation progress in real time, then
              download the final PDF.
            </p>
          </div>

          {/* Actions */}
          <div
            style={{
              display: "flex",
              gap: 10,
              marginBottom: 18,
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={handleCreate}
              disabled={isLoading}
              style={{
                padding: "9px 18px",
                borderRadius: 999,
                border: "none",
                background: isLoading
                  ? "rgba(34,197,94,0.6)"
                  : "linear-gradient(135deg,#22c55e,#4ade80)",
                color: "#020617",
                fontSize: 14,
                fontWeight: 600,
                cursor: isLoading ? "default" : "pointer",
                boxShadow: isLoading
                  ? "none"
                  : "0 0 0 1px rgba(34,197,94,0.4), 0 12px 25px rgba(22,163,74,0.45)",
                transition: "transform 0.12s ease, box-shadow 0.12s ease",
              }}
              onMouseDown={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "scale(0.97)";
              }}
              onMouseUp={(e) => {
                (e.currentTarget as HTMLButtonElement).style.transform =
                  "scale(1)";
              }}
            >
              {isLoading ? "Creating..." : "Create Report"}
            </button>

            {canDownload && requestId && (
              <a
                href={`/api/report/${requestId}/download`}
                target="_blank"
                style={{
                  padding: "9px 18px",
                  borderRadius: 999,
                  border: "1px solid rgba(148,163,184,0.6)",
                  background:
                    "linear-gradient(135deg, rgba(15,23,42,0.9), rgba(15,23,42,0.95))",
                  color: "#e5e7eb",
                  fontSize: 14,
                  fontWeight: 500,
                  textDecoration: "none",
                  cursor: "pointer",
                }}
              >
                Download PDF
              </a>
            )}

            {canDelete && requestId && (
              <button
                onClick={handleDelete}
                style={{
                  padding: "9px 18px",
                  borderRadius: 999,
                  border: "1px solid rgba(248,113,113,0.6)",
                  background:
                    "linear-gradient(135deg, rgba(15,23,42,0.95), rgba(30,64,175,0.2))",
                  color: "rgb(248,113,113)",
                  fontSize: 14,
                  fontWeight: 500,
                  cursor: "pointer",
                }}
              >
                Delete
              </button>
            )}
          </div>

          {/* Card */}
          <div
            style={{
              borderRadius: 16,
              border: "1px solid rgba(15,23,42,0.9)",
              background:
                "linear-gradient(145deg, rgba(15,23,42,0.96), rgba(15,23,42,0.98))",
              padding: 16,
            }}
          >
            {/* Progress bar */}
            {status && (
              <div style={{ marginBottom: 14 }}>
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    fontSize: 12,
                    marginBottom: 4,
                    color: "#9ca3af",
                  }}
                >
                  <span>Progress</span>
                  <span>{progress}%</span>
                </div>
                <div
                  style={{
                    width: "100%",
                    height: 8,
                    borderRadius: 999,
                    background: "#020617",
                    overflow: "hidden",
                  }}
                >
                  <div
                    style={{
                      width: `${progress}%`,
                      height: "100%",
                      borderRadius: 999,
                      background:
                        status === "failed"
                          ? "#ef4444"
                          : progress === 100
                          ? "#22c55e"
                          : "linear-gradient(90deg,#22c55e,#0ea5e9)",
                      transition: "width 0.35s ease",
                    }}
                  />
                </div>
              </div>
            )}

            {/* Request + status info */}
            {requestId ? (
              <>
                <p
                  style={{
                    fontSize: 11,
                    color: "#6b7280",
                    marginBottom: 2,
                  }}
                >
                  Request ID
                </p>
                <p
                  style={{
                    fontSize: 13,
                    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco",
                    wordBreak: "break-all",
                    marginBottom: 10,
                  }}
                >
                  {requestId}
                </p>

                {status && (
                  <>
                    <p
                      style={{
                        fontSize: 11,
                        color: "#6b7280",
                        marginBottom: 2,
                      }}
                    >
                      Status
                    </p>
                    <div
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 6,
                        marginBottom: 4,
                      }}
                    >
                      <span
                        style={{
                          width: 8,
                          height: 8,
                          borderRadius: "999px",
                          background:
                            status === "completed"
                              ? "#22c55e"
                              : status === "failed"
                              ? "#ef4444"
                              : "#eab308",
                          boxShadow:
                            status === "completed"
                              ? "0 0 8px rgba(34,197,94,0.9)"
                              : "none",
                        }}
                      />
                      <span
                        style={{
                          fontSize: 13,
                          fontWeight: 500,
                        }}
                      >
                        {statusLabel}
                      </span>
                    </div>

                    <p
                      style={{
                        fontSize: 12,
                        color: "#9ca3af",
                      }}
                    >
                      {status === "queued" && "Waiting in queue..."}
                      {status === "fetching_data" &&
                        "Fetching source data for the report..."}
                      {status === "generating_structure" &&
                        "Preparing PDF layout and structure..."}
                      {status === "generating_chunks" &&
                        "Rendering individual PDF chunks (pages)..."}
                      {status === "merging_and_cleaning" &&
                        "Merging chunks and cleaning temporary files..."}
                      {status === "completed" &&
                        "Report is ready. Click Download PDF to save it."}
                      {status === "failed" &&
                        "Something went wrong while generating the report."}
                    </p>
                  </>
                )}
              </>
            ) : (
              <p
                style={{
                  fontSize: 13,
                  color: "#6b7280",
                }}
              >
                No active report. Click &quot;Create Report&quot; to start a new
                job.
              </p>
            )}
          </div>

          <p
            style={{
              fontSize: 10,
              color: "#6b7280",
              textAlign: "right",
              marginTop: 10,
            }}
          >
            Async worker · RabbitMQ · Prisma
          </p>
        </div>
      </div>
    </div>
  );
}
