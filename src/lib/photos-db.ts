import { getServerClient } from "@/lib/insforge";

export interface Photo {
  id: string;
  storage_key: string | null;
  url: string;
  filename: string;
  title: string | null;
  alt_text: string | null;
  description: string | null;
  tags: string[];
  location: string | null;
  photographer: string | null;
  width: number | null;
  height: number | null;
  source: string;
  created_at: string;
  updated_at: string;
}

export interface PhotoInput {
  storage_key?: string;
  url: string;
  filename: string;
  title?: string;
  alt_text?: string;
  description?: string;
  tags?: string[];
  location?: string;
  photographer?: string;
  width?: number;
  height?: number;
  source?: string;
}

export async function getAllPhotos(): Promise<Photo[]> {
  const insforge = getServerClient();
  const { data, error } = await insforge.database
    .from("photos")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw new Error(error.message);
  return (data as Photo[]) ?? [];
}

export async function getPhotoById(id: string): Promise<Photo | null> {
  const insforge = getServerClient();
  const { data, error } = await insforge.database
    .from("photos")
    .select("*")
    .eq("id", id)
    .single();
  if (error) return null;
  return data as Photo;
}

export async function createPhoto(input: PhotoInput): Promise<Photo> {
  const insforge = getServerClient();
  const { data, error } = await insforge.database
    .from("photos")
    .insert([{ ...input, source: input.source ?? "library" }])
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Photo;
}

export async function updatePhoto(id: string, input: Partial<PhotoInput>): Promise<Photo> {
  const insforge = getServerClient();
  const { data, error } = await insforge.database
    .from("photos")
    .update(input)
    .eq("id", id)
    .select()
    .single();
  if (error) throw new Error(error.message);
  return data as Photo;
}

export async function deletePhoto(id: string, storageKey?: string | null): Promise<void> {
  const insforge = getServerClient();
  if (storageKey) {
    await insforge.storage.from("blog-images").remove(storageKey);
  }
  const { error } = await insforge.database.from("photos").delete().eq("id", id);
  if (error) throw new Error(error.message);
}
