export default function EventsPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-3 text-center sm:text-left">
        <span className="text-xs font-semibold uppercase tracking-[0.28em] text-indigo-500 sm:tracking-[0.35em]">Events</span>
        <h1 className="text-3xl font-black uppercase tracking-tight text-[color:var(--fg-body)]">イベント・参加申込</h1>
        <p className="text-sm text-muted sm:text-base">直近のボードゲーム会はこちらからお申込みください。</p>
      </header>
      <div className="surface-card overflow-hidden rounded-2xl border border-slate-200 shadow-sm dark:border-slate-700">
        <div className="aspect-[4/5] w-full sm:aspect-[4/3]">
          <iframe
            src="https://docs.google.com/forms/d/e/1FAIpQLScrZ0LiM1mB6uHHYluQxc2ihKbvJV6qF5SL7kNYqvvZtXQiWw/viewform?usp=dialog"
            className="h-full w-full"
            title="イベント申込フォーム"
          >
            読み込み中…
          </iframe>
        </div>
      </div>
    </div>
  );
}
