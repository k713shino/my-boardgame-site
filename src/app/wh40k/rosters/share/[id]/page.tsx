import { Suspense } from "react";
import { SharedRosterById } from "./SharedRosterById";

export default async function SharedRosterByIdPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return (
    <Suspense fallback={<div className="py-20 text-center text-sm text-muted">読み込み中…</div>}>
      <SharedRosterById id={id} />
    </Suspense>
  );
}
