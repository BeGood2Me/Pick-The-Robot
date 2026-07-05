export function ComparisonTable({
  optionALabel,
  optionBLabel,
  rows,
}: {
  optionALabel: string;
  optionBLabel: string;
  rows: { aspect: string; optionA: string; optionB: string }[];
}) {
  return (
    <>
      <div className="space-y-3 md:hidden">
        {rows.map((row) => (
          <div key={row.aspect} className="rounded-xl border border-surface-border bg-surface p-4 text-sm">
            <p className="font-semibold text-ink">{row.aspect}</p>
            <div className="mt-2 space-y-2 text-ink-muted">
              <p>
                <span className="font-medium text-ink">{optionALabel}:</span> {row.optionA}
              </p>
              <p>
                <span className="font-medium text-ink">{optionBLabel}:</span> {row.optionB}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="hidden overflow-x-auto rounded-xl border border-surface-border md:block">
        <table className="w-full border-collapse text-left text-sm">
          <thead className="bg-surface-soft text-ink">
            <tr className="border-b border-surface-border">
              <th className="px-4 py-3 text-left font-semibold">Aspect</th>
              <th className="px-4 py-3 text-left font-semibold">{optionALabel}</th>
              <th className="px-4 py-3 text-left font-semibold">{optionBLabel}</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={row.aspect} className="border-b border-surface-border last:border-b-0">
                <th className="px-4 py-3 text-left font-medium text-ink">{row.aspect}</th>
                <td className="px-4 py-3 align-top text-ink-muted">{row.optionA}</td>
                <td className="px-4 py-3 align-top text-ink-muted">{row.optionB}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}
