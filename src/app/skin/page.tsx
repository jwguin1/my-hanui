import type { Metadata } from "next";
import CategoryListPage from "@/components/CategoryListPage";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "피부",
  description:
    "피부 질환, 피부 노화, 한의학적 접근 등 일산한의원의 피부 관련 정보입니다.",
  openGraph: {
    title: "피부 | 일산한의원",
    description:
      "피부 질환, 피부 노화, 한의학적 접근 등 일산한의원의 피부 관련 정보입니다.",
  },
  alternates: {
    canonical: "https://www.ilsanhan.com/skin",
  },
};

export default function SkinListPage() {
  return <CategoryListPage category="skin" />;
}
