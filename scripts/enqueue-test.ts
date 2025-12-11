import { enqueuePdfJob } from "../src/lib/rabbitmq.ts";

async function main() {
  const id = "test-job-" + Date.now();

  await enqueuePdfJob({
    id,
    payload: {} // abhi /api/pdf khud data.json se lega
  });

  console.log("✅ Enqueued job:", id);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
