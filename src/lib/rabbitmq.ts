import amqp from "amqplib";

const RABBITMQ_URL =
  process.env.RABBITMQ_URL || "amqp://guest:guest@localhost:5672";
const QUEUE_NAME = "pdf_report_queue";

// --- Connection + channel pool ---
let connection: any = null;
let channels: any[] = [];
let channelIndex = 0;
const POOL_SIZE = 5;

async function initRabbitmq(): Promise<void> {
  if (connection && channels.length > 0) return;

  const conn = await amqp.connect(RABBITMQ_URL);
  connection = conn;

  connection.on("error", (err: any) => {
    console.error("RabbitMQ connection error:", err);
  });

  connection.on("close", () => {
    console.warn("RabbitMQ connection closed, clearing pool");
    connection = null;
    channels = [];
    channelIndex = 0;
  });

  const createdChannels: any[] = [];

  for (let i = 0; i < POOL_SIZE; i++) {
    const ch = await connection.createChannel();
    await ch.assertQueue(QUEUE_NAME, { durable: true });
    createdChannels.push(ch);
  }

  channels = createdChannels;
  console.log(
    `RabbitMQ: connected, queue: ${QUEUE_NAME}, channel pool size: ${POOL_SIZE}`
  );
}

async function getChannelFromPool(): Promise<any> {
  await initRabbitmq();

  if (!connection || channels.length === 0) {
    throw new Error("No RabbitMQ channels available in pool");
  }

  const ch = channels[channelIndex];
  channelIndex = (channelIndex + 1) % channels.length;
  return ch;
}

/**
 * Job object should already contain {id, payload, ...}
 */
export async function enqueuePdfJob(job: {
  id: string;
  payload: unknown;
  createdAt?: string;
}) {
  const ch = await getChannelFromPool();

  const finalJob = {
    ...job,
    createdAt: job.createdAt ?? new Date().toISOString(),
  };

  const ok = ch.sendToQueue(
    QUEUE_NAME,
    Buffer.from(JSON.stringify(finalJob)),
    {
      persistent: true,
    }
  );

  if (!ok) {
    throw new Error("Failed to enqueue PDF job");
  }

  console.log(`Enqueued PDF job: ${finalJob.id}`);

  return finalJob.id;
}
