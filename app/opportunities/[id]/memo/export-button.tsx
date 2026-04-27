"use client";

export function ExportMarkdownButton({
  filename,
  markdown,
}: {
  filename: string;
  markdown: string;
}) {
  return (
    <button
      className="inline-flex h-10 items-center justify-center rounded-md border border-zinc-300 px-4 text-sm font-semibold text-zinc-700 transition hover:bg-zinc-50"
      onClick={() => {
        const blob = new Blob([markdown], { type: "text/markdown" });
        const url = URL.createObjectURL(blob);
        const anchor = document.createElement("a");
        anchor.href = url;
        anchor.download = filename;
        anchor.click();
        URL.revokeObjectURL(url);
      }}
      type="button"
    >
      Export Markdown
    </button>
  );
}

