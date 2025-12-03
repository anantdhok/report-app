import amqp from "amqplib";

const RABBITMQ_URL =
  process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672";
const QUEUE_NAME = "pdf_report_queue";

let channel: amqp.Channel | null = null;

async function getChannel() {
  if (channel) {
    return channel;
  }

  const connection = await amqp.connect(RABBITMQ_URL);
  const ch = await connection.createChannel();

  await ch.assertQueue(QUEUE_NAME, { durable: true });

  connection.on("error", (err) => {
    console.error("RabbitMQ connection error:", err);
  });

  connection.on("close", () => {
    console.warn("RabbitMQ connection closed");
    channel = null;
  });

  channel = ch;
  console.log("RabbitMQ: connected, queue:", QUEUE_NAME);

  return ch;
}

export async function enqueuePdfJob(data: unknown) {
  const ch = await getChannel();

  const job = {
    id: `report_${Date.now()}`,
    payload: data,
    createdAt: new Date().toISOString(),
  };

  const ok = ch.sendToQueue(QUEUE_NAME, Buffer.from(JSON.stringify(job)), {
    persistent: true,
  });

  if (!ok) {
    throw new Error("Failed to enqueue PDF job");
  }

  console.log("Enqueued PDF job:", job.id);

  return job.id;
}
