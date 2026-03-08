/**
 * Client-side image compression using Canvas API.
 * Converts images to WebP format with configurable quality.
 * Videos and non-image files are returned as-is.
 */

interface CompressionOptions {
  maxWidth?: number;
  maxHeight?: number;
  quality?: number; // 0-1, default 0.8
}

interface CompressionResult {
  file: File;
  originalSize: number;
  compressedSize: number;
  wasCompressed: boolean;
}

const DEFAULT_OPTIONS: CompressionOptions = {
  maxWidth: 1920,
  maxHeight: 1920,
  quality: 0.8,
};

export const isImageFile = (file: File): boolean => {
  return file.type.startsWith("image/") && !file.type.includes("svg");
};

export const compressImage = (
  file: File,
  options: CompressionOptions = {}
): Promise<CompressionResult> => {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  // Skip non-image files (videos, SVGs, etc.)
  if (!isImageFile(file)) {
    return Promise.resolve({
      file,
      originalSize: file.size,
      compressedSize: file.size,
      wasCompressed: false,
    });
  }

  return new Promise((resolve, reject) => {
    const img = new Image();
    const url = URL.createObjectURL(file);

    img.onload = () => {
      URL.revokeObjectURL(url);

      let { width, height } = img;

      // Scale down if exceeds max dimensions
      if (width > opts.maxWidth! || height > opts.maxHeight!) {
        const ratio = Math.min(opts.maxWidth! / width, opts.maxHeight! / height);
        width = Math.round(width * ratio);
        height = Math.round(height * ratio);
      }

      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;

      const ctx = canvas.getContext("2d");
      if (!ctx) {
        resolve({ file, originalSize: file.size, compressedSize: file.size, wasCompressed: false });
        return;
      }

      ctx.drawImage(img, 0, 0, width, height);

      canvas.toBlob(
        (blob) => {
          if (!blob || blob.size >= file.size) {
            // If compressed is larger, use original
            resolve({
              file,
              originalSize: file.size,
              compressedSize: file.size,
              wasCompressed: false,
            });
            return;
          }

          const compressedFile = new File([blob], file.name.replace(/\.[^.]+$/, ".webp"), {
            type: "image/webp",
            lastModified: Date.now(),
          });

          resolve({
            file: compressedFile,
            originalSize: file.size,
            compressedSize: compressedFile.size,
            wasCompressed: true,
          });
        },
        "image/webp",
        opts.quality
      );
    };

    img.onerror = () => {
      URL.revokeObjectURL(url);
      // On error, return original
      resolve({ file, originalSize: file.size, compressedSize: file.size, wasCompressed: false });
    };

    img.src = url;
  });
};

export const formatBytes = (bytes: number): string => {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i];
};
