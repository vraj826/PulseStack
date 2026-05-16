import type { PropsWithChildren } from 'react';

export function Panel({ children, title }: PropsWithChildren<{ title: string }>) {
  return (
    <section className="rounded-2xl border border-white/10 bg-slate/70 p-4 shadow-2xl shadow-cyan/10">
      <div className="mb-3 flex items-center justify-between">
        <h2 className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan">{title}</h2>
      </div>
      {children}
    </section>
  );
}
