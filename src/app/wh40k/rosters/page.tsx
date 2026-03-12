import type { Metadata } from "next";
import { RostersClient } from "./RostersClient";

export const metadata: Metadata = {
  title: "保存ロスター | WH40K",
  description: "保存した WH40K ロスター一覧。",
};

export default function RostersPage() {
  return <RostersClient />;
}
