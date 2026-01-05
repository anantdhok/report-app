import path from "path";
import fs from "fs";
import ejs from "ejs";
import puppeteer from "puppeteer";

async function main() {
  const templatePath = path.join(process.cwd(), "src", "views", "report.ejs");

  const data = {
    title: "Sample Report",
    table: {
      headers: ["Name", "Age", "City"],
      rows: [
        ["Atul", 23, "Pune"],
        ["Raj", 25, "Delhi"],
        ["Neha", 27, "Mumbai"],
      ],
    },
    paragraphs: [
      "This is a sample report generated using EJS and Puppeteer.",
      "You can feed real data from data.json or your database.",
    ],
    keyValues: {
      project: "PDF Service",
      environment: "Development",
      generatedBy: "Local script",
      generatedAt: new Date().toISOString(),
    },
  };

  // 1) EJS se HTML render
  const html = await ejs.renderFile(templatePath, data);

  // 2) Puppeteer se PDF
  const browser = await puppeteer.launch();
  const page = await browser.newPage();

  await page.setContent(html, { waitUntil: "networkidle0" });

  const outputDir = path.join(process.cwd(), "generated");
  fs.mkdirSync(outputDir, { recursive: true });

  const outputPath = path.join(outputDir, "sample-report.pdf");

  await page.pdf({
    path: outputPath,
    format: "A4",
    printBackground: true,
  });

  await browser.close();

  console.log("✅ PDF generated at:", outputPath);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
