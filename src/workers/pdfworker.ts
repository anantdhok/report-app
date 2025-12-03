import amqp from "amqplib";
import dotenv from "dotenv";

dotenv.config(); // .env se RABBITMQ_URL read karne ke liye

const RABBITMQ_URL =
  process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672";
const QUEUE_NAME = "pdf_report_queue";

async function startWorker() {
  try {
    const connection = await amqp.connect(RABBITMQ_URL);
    const channel = await connection.createChannel();

    await channel.assertQueue(QUEUE_NAME, { durable: true });
    await channel.prefetch(1);

    console.log("👷 PDF worker listening on queue:", QUEUE_NAME);

    channel.consume(
      QUEUE_NAME,
      async (msg) => {
        if (!msg) return;

        const content = msg.content.toString();
        const job = JSON.parse(content);

        console.log("📥 Received job from queue:", job);

        // yahi pe baad me:
        // - status = processing
        // - PDF generate
        // - upload
        // - status = completed
        // likhenge

        // Abhi ke liye sirf success maan ke ACK
        channel.ack(msg);
      },
      { noAck: false }
    );
  } catch (err) {
    console.error("Worker error:", err);
    process.exit(1);
  }
}

startWorker();
