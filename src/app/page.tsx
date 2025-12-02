"use client";

export default function Home() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      {/* Download PDF Button */}
      <button
        className="px-6 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        onClick={() => {
          window.open("/api/pdf", "_blank");
        }}
      >
        Download PDF
      </button>
    </div>
  );
}
