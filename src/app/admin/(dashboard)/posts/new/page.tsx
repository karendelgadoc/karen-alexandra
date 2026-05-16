import Link from "next/link";
import PostForm from "@/components/admin/PostForm";

export default function NewPostPage() {
  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/posts" className="text-stone-400 hover:text-stone-600 text-sm">
          ← Posts
        </Link>
        <span className="text-stone-300">/</span>
        <h1 className="text-xl font-semibold text-stone-800">Nuevo post</h1>
      </div>
      <PostForm />
    </div>
  );
}
