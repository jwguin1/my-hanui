import type { Metadata } from "next";
import CategoryListPage from "@/components/CategoryListPage";

export const revalidate = 60;

export const metadata: Metadata = {
  title: "통증",
  description:
    "근골격계 통증, 신경포착증후군, 초음파 유도 치료 등 일산한의원의 통증 관련 의학정보입니다.",
  openGraph: {
    title: "통증 | 일산한의원",
    description:
      "근골격계 통증, 신경포착증후군, 초음파 유도 치료 등 일산한의원의 통증 관련 의학정보입니다.",
  },
  alternates: {
    canonical: "https://www.ilsanhan.com/pain",
  },
};

export default function PainListPage() {
  return <CategoryListPage category="pain" />;
}
