import type { Metadata } from "next";
import ArticleForm from "../ArticleForm";

export const metadata: Metadata = { title: "New Article" };

export default function NewArticlePage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">New Article</h1>
      <ArticleForm />
    </div>
  );
}
