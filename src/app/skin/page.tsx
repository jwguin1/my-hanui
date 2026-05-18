import type { Metadata } from "next";
import CategoryListPage from "@/components/CategoryListPage";
import { categoryMetadata } from "@/lib/categories";

export const revalidate = 60;

export const metadata: Metadata = categoryMetadata("skin");

export default function SkinListPage() {
  return <CategoryListPage category="skin" />;
}
