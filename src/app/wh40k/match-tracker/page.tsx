import type { Metadata } from "next";
import MatchTrackerClient from "./MatchTrackerClient";

export const metadata: Metadata = {
  title: "Match Tracker | WH40K",
  description: "VP・CP・ターン管理をひとつにまとめたゲーム中サポートUI。",
};

export default function MatchTrackerPage() {
  return <MatchTrackerClient />;
}
