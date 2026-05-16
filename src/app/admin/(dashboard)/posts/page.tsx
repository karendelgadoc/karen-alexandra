import Link from "next/link";
import { getAllPostsAdmin } from "@/lib/posts-db";
import DeleteButton from "./DeleteButton";

export const dynamic = "force-dynamic";

export default async function AdminPostsPage() {
  const posts = await getAllPostsAdmin();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-xl font-semibold text-stone-800">Blog Posts</h1>
          <p className="text-sm text-stone-500 mt-0.5">{posts.length} post{posts.length !== 1 ? "s" : ""} en total</p>
        </div>
        <Link
          href="/admin/posts/new"
          className="bg-stone-900 text-white text-sm px-4 py-2 rounded hover:bg-stone-700 transition-colors"
        >
          + Nuevo post
        </Link>
      </div>

      {posts.length === 0 ? (
        <div className="text-center py-16 text-stone-400">
          <p className="mb-4">No hay posts todavía.</p>
          <Link href="/admin/posts/new" className="text-stone-600 hover:text-stone-900 underline text-sm">
            Crear el primero →
          </Link>
        </div>
      ) : (
        <div className="bg-white border border-stone-200 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-stone-200 bg-stone-50">
                <th className="text-left px-4 py-3 font-medium text-stone-600">Título</th>
                <th className="text-left px-4 py-3 font-medium text-stone-600 hidden md:table-cell">Categoría</th>
                <th className="text-left px-4 py-3 font-medium text-stone-600 hidden md:table-cell">Fecha</th>
                <th className="text-left px-4 py-3 font-medium text-stone-600">Estado</th>
                <th className="px-4 py-3" />
              </tr>
            </thead>
            <tbody>
              {posts.map((post, i) => (
                <tr key={post.id} className={`border-b border-stone-100 last:border-0 ${i % 2 === 0 ? "" : "bg-stone-50/50"}`}>
                  <td className="px-4 py-3">
                    <div>
                      <p className="font-medium text-stone-800">{post.title}</p>
                      <p className="text-xs text-stone-400 mt-0.5">/blog/{post.slug}</p>
                    </div>
                  </td>
                  <td className="px-4 py-3 text-stone-600 hidden md:table-cell">{post.category}</td>
                  <td className="px-4 py-3 text-stone-500 hidden md:table-cell">
                    {new Date(post.date).toLocaleDateString("es-ES", { year: "numeric", month: "short", day: "numeric" })}
                  </td>
                  <td className="px-4 py-3">
                    <span className={`inline-block px-2 py-0.5 rounded-full text-xs ${post.published ? "bg-green-100 text-green-700" : "bg-stone-100 text-stone-500"}`}>
                      {post.published ? "Publicado" : "Borrador"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center gap-3 justify-end">
                      <Link
                        href={`/blog/${post.slug}`}
                        target="_blank"
                        className="text-stone-400 hover:text-stone-600 text-xs"
                      >
                        Ver
                      </Link>
                      <Link
                        href={`/admin/posts/${post.id}/edit`}
                        className="text-stone-600 hover:text-stone-900 font-medium text-xs"
                      >
                        Editar
                      </Link>
                      <DeleteButton id={post.id} title={post.title} />
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
