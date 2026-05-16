import { notFound } from "next/navigation";
import Link from "next/link";
import { getPostById } from "@/lib/posts-db";
import PostForm from "@/components/admin/PostForm";

interface Props {
  params: Promise<{ id: string }>;
}

export default async function EditPostPage({ params }: Props) {
  const { id } = await params;
  const post = await getPostById(id);
  if (!post) notFound();

  return (
    <div>
      <div className="flex items-center gap-3 mb-6">
        <Link href="/admin/posts" className="text-stone-400 hover:text-stone-600 text-sm">
          ← Posts
        </Link>
        <span className="text-stone-300">/</span>
        <h1 className="text-xl font-semibold text-stone-800">Editar post</h1>
      </div>
      <PostForm initialData={post} />
    </div>
  );
}
