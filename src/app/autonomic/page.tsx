import type { Metadata } from "next";
import CategoryListPage from "@/components/CategoryListPage";
import { categoryMetadata } from "@/lib/categories";

export const revalidate = 60;

export const metadata: Metadata = categoryMetadata("autonomic");

export default function AutonomicListPage() {
  return <CategoryListPage category="autonomic" />;
}
