import type { Metadata } from "next";
import { RostersClient } from "./RostersClient";

export const metadata: Metadata = {
  title: "My Rosters | WH40K",
  description: "保存した WH40K ロスター一覧。",
};

export default function RostersPage() {
  return <RostersClient />;
}
