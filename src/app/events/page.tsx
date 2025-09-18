export default function EventsPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">イベント・参加申込</h1>
      <p>直近のボードゲーム会はこちらからお申込みください。</p>
      <div className="aspect-[4/3] w-full">
        <iframe
          src="https://docs.google.com/forms/d/e/1FAIpQLScbW21jm8d8bXNfKu5idCvszoNWuF850v4IxOmukE57lDoF-w/viewform?usp=dialog"
          className="w-full h-[80vh] border rounded"
          title="イベント申込フォーム"
        >
          読み込み中…
        </iframe>
      </div>
    </div>
  );
}
