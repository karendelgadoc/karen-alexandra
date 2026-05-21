// Client-side image compression for upload.
//
// Vercel's serverless functions cap request body at ~4.5 MB. Modern iPhone
// photos (especially Live Photos and recent iOS JPEGs) routinely exceed that,
// which is why some uploads worked and others failed silently. Compressing in
// the browser to a max long-edge of 3000 px at JPEG quality 0.85 produces files
// well under 1 MB while still looking sharp on retina displays.
//
// The site never displays a photo larger than ~1500 px wide (hero crops, blog
// images), so 3000 px is already 2× the practical render size — plenty of
// headroom.

const MAX_DIMENSION = 3000;
const TARGET_QUALITY = 0.85;
// Skip compression if file is already small. No point re-encoding a 400 KB jpeg.
const COMPRESS_THRESHOLD = 2 * 1024 * 1024; // 2 MB

export interface CompressionResult {
  file: File;
  compressed: boolean;
  originalSize: number;
  finalSize: number;
  // Filled when something went wrong but we still returned the original file.
  warning?: string;
}

export async function compressImageForUpload(input: File): Promise<CompressionResult> {
  const originalSize = input.size;

  // Below threshold? Don't touch it.
  if (originalSize <= COMPRESS_THRESHOLD) {
    return { file: input, compressed: false, originalSize, finalSize: originalSize };
  }

  // HEIC/HEIF: browsers can't decode it to a canvas. We can't compress it.
  // The user must convert before uploading.
  const t = input.type.toLowerCase();
  const n = input.name.toLowerCase();
  if (t.includes("heic") || t.includes("heif") || n.endsWith(".heic") || n.endsWith(".heif")) {
    return {
      file: input,
      compressed: false,
      originalSize,
      finalSize: originalSize,
      warning: "HEIC/HEIF format cannot be compressed in the browser. Convert to JPEG first (on iPhone: Settings → Camera → Formats → Most Compatible).",
    };
  }

  try {
    const bitmap = await loadBitmap(input);
    const { canvas, width, height } = drawToCanvas(bitmap, MAX_DIMENSION);
    bitmap.close?.();

    const blob = await canvasToBlob(canvas, "image/jpeg", TARGET_QUALITY);
    if (!blob) throw new Error("canvas.toBlob returned null");

    // If compression somehow made it bigger (rare; tiny PNGs of pure color),
    // keep the original.
    if (blob.size >= originalSize) {
      return { file: input, compressed: false, originalSize, finalSize: originalSize };
    }

    // Replace the extension with .jpg since we re-encoded as JPEG.
    const newName = input.name.replace(/\.[^.]+$/, "") + ".jpg";
    const compressed = new File([blob], newName, { type: "image/jpeg", lastModified: Date.now() });

    return {
      file: compressed,
      compressed: true,
      originalSize,
      finalSize: blob.size,
      warning: width === 0 || height === 0 ? "Image had 0 dimensions" : undefined,
    };
  } catch (e) {
    // Compression failed for some reason (corrupt image, unsupported format).
    // Return original; the upload may still succeed if small enough.
    return {
      file: input,
      compressed: false,
      originalSize,
      finalSize: originalSize,
      warning: `Could not compress in browser (${e instanceof Error ? e.message : "unknown error"}). Uploading original.`,
    };
  }
}

async function loadBitmap(file: File): Promise<ImageBitmap> {
  // createImageBitmap is the fastest path; it offloads decode to a worker.
  if (typeof createImageBitmap === "function") {
    return await createImageBitmap(file);
  }
  // Fallback: load via <img>.
  const url = URL.createObjectURL(file);
  try {
    const img = new Image();
    img.src = url;
    await new Promise<void>((resolve, reject) => {
      img.onload = () => resolve();
      img.onerror = () => reject(new Error("image decode failed"));
    });
    // Create an ImageBitmap from the loaded <img>.
    return await createImageBitmap(img);
  } finally {
    URL.revokeObjectURL(url);
  }
}

function drawToCanvas(bitmap: ImageBitmap, maxDim: number) {
  const ratio = Math.min(1, maxDim / Math.max(bitmap.width, bitmap.height));
  const width = Math.round(bitmap.width * ratio);
  const height = Math.round(bitmap.height * ratio);

  const canvas = document.createElement("canvas");
  canvas.width = width;
  canvas.height = height;
  const ctx = canvas.getContext("2d");
  if (!ctx) throw new Error("could not get 2d context");

  // Better downscale quality.
  ctx.imageSmoothingEnabled = true;
  ctx.imageSmoothingQuality = "high";

  ctx.drawImage(bitmap, 0, 0, width, height);
  return { canvas, width, height };
}

function canvasToBlob(canvas: HTMLCanvasElement, type: string, quality: number): Promise<Blob | null> {
  return new Promise((resolve) => canvas.toBlob(resolve, type, quality));
}

export function formatBytes(n: number): string {
  if (n < 1024) return `${n} B`;
  if (n < 1024 * 1024) return `${(n / 1024).toFixed(0)} KB`;
  return `${(n / (1024 * 1024)).toFixed(1)} MB`;
}
