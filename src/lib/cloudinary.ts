import { env } from "@/config/env";

export interface CloudinaryUploadResponse {
  secure_url: string;
  public_id: string;
  format?: string;
  resource_type?: string;
  bytes?: number;
  width?: number;
  height?: number;
}

export interface UploadOptions {
  uploadPreset?: string;
  folder?: string;
  resourceType?: "image" | "raw" | "auto" | "video";
}

/**
 * Uploads a file (image or document) to Cloudinary via unsigned upload.
 */
export async function uploadToCloudinary(
  file: File | Blob,
  options: UploadOptions = {},
): Promise<CloudinaryUploadResponse> {
  const cloudName = env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;
  const uploadPreset =
    options.uploadPreset || env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET;
  const resourceType = options.resourceType || "auto";

  if (!cloudName) {
    throw new Error("Cloudinary cloud name is missing in configuration.");
  }

  const formData = new FormData();
  formData.append("file", file);
  formData.append("upload_preset", uploadPreset);

  if (options.folder) {
    formData.append("folder", options.folder);
  }

  const endpoint = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;

  let response: Response;
  try {
    response = await fetch(endpoint, {
      method: "POST",
      body: formData,
    });
  } catch (networkError: unknown) {
    const rawMessage =
      networkError instanceof Error
        ? networkError.message
        : String(networkError);
    if (
      rawMessage === "Failed to fetch" ||
      rawMessage.toLowerCase().includes("network")
    ) {
      throw new Error(
        "Unable to connect to Cloudinary upload service. Please check your internet connection and cloud configuration.",
      );
    }
    throw new Error(`Upload network error: ${rawMessage}`);
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    const errorMessage =
      errorData?.error?.message ||
      `Cloudinary upload failed with status ${response.status}`;
    throw new Error(errorMessage);
  }

  const data: CloudinaryUploadResponse = await response.json();
  return data;
}

/**
 * Convenience helper to upload an image to Cloudinary and return its secure URL.
 */
export async function uploadImage(
  file: File | Blob,
  folder = "servicehub/portfolio",
): Promise<string> {
  const result = await uploadToCloudinary(file, {
    folder,
    resourceType: "image",
  });
  return result.secure_url;
}

/**
 * Convenience helper to upload a document/certificate to Cloudinary and return its secure URL.
 */
export async function uploadDocument(
  file: File | Blob,
  folder = "servicehub/certificates",
): Promise<string> {
  const result = await uploadToCloudinary(file, {
    folder,
    resourceType: "auto",
  });
  return result.secure_url;
}
