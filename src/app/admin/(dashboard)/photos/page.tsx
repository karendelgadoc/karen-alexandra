import { getAllPhotos } from "@/lib/photos-db";
import PhotoGallery from "@/components/admin/PhotoGallery";

export const dynamic = "force-dynamic";
export const metadata = { title: "Photo Library" };

export default async function PhotosPage() {
  const photos = await getAllPhotos();
  const adminKey = process.env.ADMIN_SECRET ?? "";

  return (
    <div className="flex flex-col h-screen overflow-hidden">
      <div className="px-6 py-5 border-b border-stone-200 shrink-0">
        <h1 className="text-xl font-medium text-stone-800">Photo Library</h1>
        <p className="text-sm text-stone-500 mt-0.5">
          {photos.length} photos · drag &amp; drop or click Upload to add new ones
        </p>
      </div>
      <div className="flex-1 min-h-0">
        <PhotoGallery initialPhotos={photos} adminKey={adminKey} />
      </div>
    </div>
  );
}
