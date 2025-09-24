import { v2 as cloudinary, type ConfigAndUrlOptions, type UploadApiErrorResponse, type UploadApiOptions, type UploadApiResponse } from "cloudinary";

export type CloudinaryUploadOptions = {
  folder?: string;
  publicId?: string;
  tags?: string[];
};

export type CloudinaryUploadResult = {
  publicId: string;
  url: string;
  width?: number;
  height?: number;
  format?: string;
};

let configured = false;

function ensureConfigured(): void {
  if (configured) return;

  const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
  const apiKey = process.env.CLOUDINARY_API_KEY;
  const apiSecret = process.env.CLOUDINARY_API_SECRET;

  if (!cloudName || !apiKey || !apiSecret) {
    throw new Error(
      "Cloudinary environment variables are not set. Please provide CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET."
    );
  }

  cloudinary.config({
    cloud_name: cloudName,
    api_key: apiKey,
    api_secret: apiSecret,
  });

  configured = true;
}

export function isCloudinaryReady(): boolean {
  return Boolean(
    process.env.CLOUDINARY_CLOUD_NAME &&
      process.env.CLOUDINARY_API_KEY &&
      process.env.CLOUDINARY_API_SECRET
  );
}

export function getCloudinaryUrl(publicId: string, options?: ConfigAndUrlOptions): string {
  ensureConfigured();
  return cloudinary.url(publicId, { secure: true, ...options });
}

export async function uploadBufferToCloudinary(
  buffer: Buffer,
  options?: CloudinaryUploadOptions
): Promise<CloudinaryUploadResult> {
  ensureConfigured();

  const folder = options?.folder ?? process.env.CLOUDINARY_UPLOAD_FOLDER;
  const uploadOptions: UploadApiOptions = {
    resource_type: "image",
  };

  if (folder) uploadOptions.folder = folder;
  if (options?.publicId) uploadOptions.public_id = options.publicId;
  if (options?.tags?.length) uploadOptions.tags = options.tags.join(",");

  return new Promise((resolve, reject) => {
    const uploadStream = cloudinary.uploader.upload_stream(
      uploadOptions,
      (error: UploadApiErrorResponse | undefined, result: UploadApiResponse | undefined) => {
        if (error) return reject(error);
        if (!result) return reject(new Error("Cloudinary upload failed without a result."));

        resolve({
          publicId: result.public_id,
          url: result.secure_url ?? result.url,
          width: result.width ?? undefined,
          height: result.height ?? undefined,
          format: result.format ?? undefined,
        });
      }
    );

    uploadStream.end(buffer);
  });
}
