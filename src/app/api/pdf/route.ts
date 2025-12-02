import fs from "fs";
import path from "path";
import { createElement } from "react";
import { renderToBuffer } from "@react-pdf/renderer";

import PdfDocument from "@/components/report";

export async function GET() {
  // Load real data from data.json
  const dataPath = path.join(process.cwd(), "src", "data.json");

  // Check if the file exists
  if (!fs.existsSync(dataPath)) {
    return new Response("Data not available", {
      status: 404,
      headers: { "Content-Type": "text/plain" }
    });
  }

  // Read and parse the JSON data
  const rawData = fs.readFileSync(dataPath, "utf-8");
  const reportData = JSON.parse(rawData);

  // Render PDF to buffer using real data
  const pdfBuffer = await renderToBuffer(createElement(PdfDocument, { report: reportData }) as any);
  const pdfArray = new Uint8Array(pdfBuffer);
  return new Response(pdfArray, {
    status: 200,
    headers: {
      "Content-Type": "application/pdf",
      "Content-Disposition": 'attachment; filename="report.pdf"'
    }
  });
}
