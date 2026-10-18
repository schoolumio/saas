/// Shared presentational building blocks for long-form technical reference
/// pages (installation, environment variables, architecture) — these are
/// aimed at developers evaluating or deploying the source code, distinct
/// from the school-facing product overview at /docs.
export function DocSection({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section className="space-y-3">
      <h2 className="text-xl font-semibold tracking-tight text-foreground">{title}</h2>
      <div className="space-y-3 text-sm leading-relaxed text-muted">{children}</div>
    </section>
  );
}

export function DocP({ children }: { children: React.ReactNode }) {
  return <p>{children}</p>;
}

export function DocInlineCode({ children }: { children: React.ReactNode }) {
  return <code className="rounded bg-muted-surface px-1.5 py-0.5 text-xs text-foreground">{children}</code>;
}

export function DocList({ items, ordered = false }: { items: React.ReactNode[]; ordered?: boolean }) {
  const Tag = ordered ? "ol" : "ul";
  return (
    <Tag className={ordered ? "list-decimal space-y-1.5 pl-5" : "list-disc space-y-1.5 pl-5"}>
      {items.map((item, i) => (
        <li key={i}>{item}</li>
      ))}
    </Tag>
  );
}

export function DocChecklist({ items }: { items: string[] }) {
  return (
    <ul className="space-y-1.5">
      {items.map((item) => (
        <li key={item} className="flex items-start gap-2">
          <span className="mt-0.5 h-4 w-4 flex-none rounded border border-border" aria-hidden />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );
}

export function DocCode({ children, language }: { children: string; language?: string }) {
  return (
    <div className="overflow-hidden rounded-md border border-border">
      {language && (
        <div className="border-b border-border bg-muted-surface px-4 py-1.5 text-xs font-medium uppercase tracking-wide text-muted">
          {language}
        </div>
      )}
      <pre className="overflow-x-auto bg-muted-surface p-4 text-xs text-foreground">
        <code>{children}</code>
      </pre>
    </div>
  );
}

export function DocTable({ headers, rows }: { headers: string[]; rows: React.ReactNode[][] }) {
  return (
    <div className="overflow-x-auto rounded-lg border border-border">
      <table className="w-full min-w-[480px] border-collapse text-left text-sm">
        <thead className="bg-muted-surface">
          <tr>
            {headers.map((h) => (
              <th key={h} className="px-4 py-2.5 text-xs font-medium uppercase tracking-wide text-muted">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-border">
          {rows.map((row, i) => (
            <tr key={i}>
              {row.map((cell, j) => (
                <td key={j} className="px-4 py-2.5 align-top text-foreground">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function DocCard({ children }: { children: React.ReactNode }) {
  return <div className="rounded-lg border border-border bg-surface p-6 text-sm leading-relaxed text-muted">{children}</div>;
}
