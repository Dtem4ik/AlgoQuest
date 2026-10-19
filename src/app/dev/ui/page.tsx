import type { Metadata } from "next";
import { UiShowcase } from "@/components/dev/UiShowcase";

export const metadata: Metadata = {
  title: "Витрина UI · AlgoQuest",
  robots: { index: false },
};

export default function DevUiPage() {
  return <UiShowcase />;
}
