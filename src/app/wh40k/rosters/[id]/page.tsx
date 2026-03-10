import { RosterDetailClient } from "./RosterDetailClient";

export default async function RosterDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <RosterDetailClient id={id} />;
}
