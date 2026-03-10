import { Suspense } from "react";
import { SharedRosterClient } from "./SharedRosterClient";

export default function SharedRosterPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-sm text-muted">読み込み中…</div>
      }
    >
      <SharedRosterClient />
    </Suspense>
  );
}
