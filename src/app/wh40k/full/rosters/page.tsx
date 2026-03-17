import type { Metadata } from "next";
import { RostersClient } from "../../rosters/RostersClient";

export const metadata: Metadata = {
  title: "保存ロスター | WH40K Full",
  robots: { index: false, follow: false },
};

export default function FullRostersPage() {
  return (
    <RostersClient
      builderPath="/wh40k/full/builder"
      rosterBasePath="/wh40k/full/rosters"
    />
  );
}
