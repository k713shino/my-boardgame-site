const surveyFormUrl =
  process.env.NEXT_PUBLIC_SURVEY_FORM_URL ??
  "https://docs.google.com/forms/d/e/1FAIpQLScbW21jm8d8bXNfKu5idCvszoNWuF850v4IxOmukE57lDoF-w/viewform?usp=dialog";

export default function SurveyPage() {
  return (
    <div className="space-y-6">
      <header className="space-y-3 text-center sm:text-left">
        <span className="text-xs font-semibold uppercase tracking-[0.28em] text-teal-500 sm:tracking-[0.35em]">
          Survey
        </span>
        <h1 className="text-3xl font-black uppercase tracking-tight text-[color:var(--fg-body)]">
          アンケート
        </h1>
        <p className="text-sm text-muted sm:text-base">
          ボードゲームに関するご意見・ご感想をお寄せください。今後の運営の参考にさせていただきます。
        </p>
      </header>
      <div className="surface-card overflow-hidden rounded-2xl border border-slate-200 shadow-sm dark:border-slate-700">
        <div className="aspect-[4/5] w-full sm:aspect-[4/3]">
          <iframe src={surveyFormUrl} className="h-full w-full" title="アンケートフォーム">
            読み込み中…
          </iframe>
        </div>
      </div>
    </div>
  );
}
