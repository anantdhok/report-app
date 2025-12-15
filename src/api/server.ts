// src/api/server.ts
import express, { Request, Response } from "express";
import cors from "cors";
import { PrismaClient } from "@prisma/client";
import amqp from "amqplib";
import fs from "fs";
import path from "path";

const prisma = new PrismaClient();

export function createApiServer(port: number = 3001) {
    const app = express();

    app.use(cors());
    app.use(express.json());

    // Health check endpoint
    app.get("/health", (req: Request, res: Response) => {
        res.json({ status: "ok", timestamp: new Date().toISOString() });
    });

    // PDF Data endpoint - fetches data for PDF generation
    app.post("/api/pdf-data", async (req: Request, res: Response) => {
        try {
            const { targetId } = req.body;

            if (!targetId) {
                return res.status(400).json({
                    error: "targetId is required"
                });
            }

            console.log("📊 Fetching data for targetId:", targetId);

            console.log("📊 Fetching data for targetId:", targetId);

            // Read from dummy.json
            const dummyPath = path.join(process.cwd(), "dummy.json");

            if (!fs.existsSync(dummyPath)) {
                console.error("❌ dummy.json not found at:", dummyPath);
                return res.status(404).json({ error: "Data source not found" });
            }

            console.log("📂 Reading data from:", dummyPath);
            const rawData = fs.readFileSync(dummyPath, "utf-8");
            const jsonData = JSON.parse(rawData);

            // Structure expected by the worker is: { data: { data: { ... } } }
            // The file already seems to have this structure based on the user's input
            // But let's verify if we need to wrap it or not.
            // If dummy.json starts with { "status": true, "data": { "data": { ... } } }
            // Then we can just return it directly or normalize it.

            // Just ensuring we match the structure our worker expects
            // Worker expects: const core = json?.data?.data ?? {};

            res.json(jsonData);
        } catch (error: any) {
            console.error("❌ Error fetching pdf-data:", error);
            res.status(500).json({
                error: "Failed to fetch data",
                message: error.message
            });
        }
    });

    // Report Generation endpoint - creates a job and enqueues to RabbitMQ
    app.post("/api/report", async (req: Request, res: Response) => {
        try {
            const { targetId } = req.body;

            if (!targetId) {
                return res.status(400).json({
                    error: "targetId is required"
                });
            }

            console.log("📝 Creating report job for targetId:", targetId);

            // Create job in database
            const reportJob = await prisma.reportJob.create({
                data: {
                    targetId,
                    status: "queued"
                }
            });

            console.log("✅ Job created with ID:", reportJob.id);

            // Enqueue to RabbitMQ
            const RABBITMQ_URL = process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672";
            const QUEUE_NAME = process.env.QUEUE_NAME || "pdf_report_queue";

            const connection = await amqp.connect(RABBITMQ_URL);
            const channel = await connection.createChannel();
            await channel.assertQueue(QUEUE_NAME, { durable: true });

            const jobMessage = {
                id: reportJob.id,
                targetId: reportJob.targetId,
                requestId: reportJob.id
            };

            channel.sendToQueue(
                QUEUE_NAME,
                Buffer.from(JSON.stringify(jobMessage)),
                { persistent: true }
            );

            console.log("📤 Job enqueued to RabbitMQ:", reportJob.id);

            await channel.close();
            await connection.close();

            // Return job details
            res.status(201).json({
                success: true,
                jobId: reportJob.id,
                status: reportJob.status,
                message: "Report generation job created and queued successfully"
            });

        } catch (error: any) {
            console.error("❌ Error creating report job:", error);
            res.status(500).json({
                error: "Failed to create report job",
                message: error.message
            });
        }
    });

    // Get Report Status - Polling endpoint
    app.get("/api/report/:id", async (req: Request, res: Response) => {
        try {
            const { id } = req.params;

            const job = await prisma.reportJob.findUnique({
                where: { id }
            });

            if (!job) {
                return res.status(404).json({ error: "Job not found" });
            }

            res.json({
                id: job.id,
                status: job.status,
                finalPdfPath: job.finalPdfPath,
                errorMessage: job.errorMessage,
                completedAt: job.completedAt
            });
        } catch (error: any) {
            console.error("❌ Error fetching job status:", error);
            res.status(500).json({ error: "Internal server error" });
        }
    });

    const server = app.listen(port, () => {
        console.log(`🌐 API Server running on http://localhost:${port}`);
    });

    return server;
}
