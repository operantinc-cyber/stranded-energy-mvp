"use client";

const statuses = [
  "New",
  "Data Requested",
  "Screening",
  "Memo Drafted",
  "Pursue",
  "Watch",
  "Reject",
  "Archived",
] as const;

export function StatusSelect({
  action,
  currentStatus,
}: {
  action: (formData: FormData) => void | Promise<void>;
  currentStatus: string;
}) {
  const options = statuses.includes(
    currentStatus as (typeof statuses)[number],
  )
    ? [...statuses]
    : [currentStatus, ...statuses];

  return (
    <form action={action}>
      <label className="grid gap-1 text-xs font-semibold text-zinc-600">
        Status
        <select
          className="h-9 rounded-md border border-zinc-300 bg-white px-2 text-sm font-medium text-zinc-900 shadow-sm"
          defaultValue={currentStatus}
          name="status"
          onChange={(event) => event.currentTarget.form?.requestSubmit()}
        >
          {options.map((status) => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
      </label>
      <button className="sr-only" type="submit">
        Save status
      </button>
    </form>
  );
}
