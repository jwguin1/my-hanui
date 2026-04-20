import type { Metadata } from "next";
import CategoryListPage from "@/components/CategoryListPage";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "다이어트",
  description:
    "체중 관리, 대사 질환, 인크레틴 등 일산한의원의 다이어트 관련 의학 연구입니다.",
  openGraph: {
    title: "다이어트 | 일산한의원",
    description:
      "체중 관리, 대사 질환, 인크레틴 등 일산한의원의 다이어트 관련 의학 연구입니다.",
  },
  alternates: {
    canonical: "https://www.ilsanhan.com/diet",
  },
};

export default function DietListPage() {
  return <CategoryListPage category="diet" />;
}
