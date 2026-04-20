import type { Metadata } from "next";
import CategoryListPage from "@/components/CategoryListPage";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "자율신경",
  description:
    "자율신경 기능, 스트레스, 수면 등 일산한의원의 자율신경계 관련 건강정보입니다.",
  openGraph: {
    title: "자율신경 | 일산한의원",
    description:
      "자율신경 기능, 스트레스, 수면 등 일산한의원의 자율신경계 관련 건강정보입니다.",
  },
  alternates: {
    canonical: "https://www.ilsanhan.com/autonomic",
  },
};

export default function AutonomicListPage() {
  return <CategoryListPage category="autonomic" />;
}
