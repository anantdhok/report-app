## PDF Report Generation Workflow

### 1. Client App (Trigger & Initial State Update)

- User triggers PDF generation and sends a request to `POST /api/pdf` with report input.
- Store the server’s response (report ID + initial status) in local state for status polling.

### 2. Server Route (`/api/pdf`)

- Load base `reportData` from `data.json` and merge user-provided data if needed.
- Push a new job entry into the queue (mechanism TBD: Redis, BullMQ, etc.).
- Insert a new report record into the database with:
  - **Status:** `queued`
  - **Payload:** `reportData`
  - **Timestamps:** `createdAt`
- Return the DB entry (including `reportId`) to the client.

### 3. Worker (PDF Rendering Process)

- Continuously watch the queue for new report jobs.
- When a job arrives, pop it from the queue and begin processing.
- Update the corresponding DB record:
  - **Status:** `processing`
  - **Started timestamp**
- Render the PDF using the PDF template and input `reportData`.
- Upload the final PDF file to Blob Storage (service TBD) and retrieve the public or signed URL.
- Update the DB record:
  - **Status:** `completed` (or `failed` if errors)
  - **File URL** and `completedAt` timestamp
- Log any rendering errors in failure cases.

### 4. Client App (Polling & Display)

- Show “Generating report…” with a button or timer to fetch the latest status via a `/api/report/:id/status` route (TBD).
- Poll periodically; once status becomes `completed`, display the Blob Storage download link.
- **Optional:** Auto-refresh or toast notification on completion.
