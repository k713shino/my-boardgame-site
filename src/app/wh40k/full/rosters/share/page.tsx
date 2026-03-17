import { Suspense } from "react";
import { SharedRosterClient } from "../../../rosters/share/SharedRosterClient";

export default function FullSharedRosterPage() {
  return (
    <Suspense
      fallback={
        <div className="py-20 text-center text-sm text-muted">読み込み中…</div>
      }
    >
      <SharedRosterClient
        showDatasheetLinks={true}
        builderPath="/wh40k/full/builder"
      />
    </Suspense>
  );
}
