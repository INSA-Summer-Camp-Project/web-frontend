import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import {
  uploadToCloudinary,
  uploadImage,
  uploadDocument,
} from "@/lib/cloudinary";

describe("Cloudinary Upload Service", () => {
  const originalFetch = global.fetch;

  beforeEach(() => {
    vi.restoreAllMocks();
  });

  afterEach(() => {
    global.fetch = originalFetch;
  });

  it("uploads a file to Cloudinary successfully", async () => {
    const mockResponse = {
      secure_url: "https://res.cloudinary.com/demo/image/upload/sample.jpg",
      public_id: "sample_id",
      format: "jpg",
    };

    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => mockResponse,
    });

    const file = new File(["dummy content"], "sample.jpg", {
      type: "image/jpeg",
    });
    const result = await uploadToCloudinary(file, {
      folder: "test-folder",
      resourceType: "image",
    });

    expect(result.secure_url).toBe(
      "https://res.cloudinary.com/demo/image/upload/sample.jpg",
    );
    expect(global.fetch).toHaveBeenCalledWith(
      expect.stringContaining("/image/upload"),
      expect.objectContaining({
        method: "POST",
      }),
    );
  });

  it("uploadImage helper returns secure URL", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        secure_url: "https://res.cloudinary.com/demo/image/upload/image1.png",
      }),
    });

    const file = new File(["dummy content"], "image1.png", {
      type: "image/png",
    });
    const url = await uploadImage(file);

    expect(url).toBe("https://res.cloudinary.com/demo/image/upload/image1.png");
  });

  it("uploadDocument helper returns secure URL", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        secure_url: "https://res.cloudinary.com/demo/raw/upload/cert.pdf",
      }),
    });

    const file = new File(["dummy content"], "cert.pdf", {
      type: "application/pdf",
    });
    const url = await uploadDocument(file);

    expect(url).toBe("https://res.cloudinary.com/demo/raw/upload/cert.pdf");
  });

  it("throws an error when upload fails", async () => {
    global.fetch = vi.fn().mockResolvedValueOnce({
      ok: false,
      status: 400,
      json: async () => ({
        error: { message: "Invalid image file format" },
      }),
    });

    const file = new File(["dummy content"], "bad.xyz", {
      type: "application/octet-stream",
    });

    await expect(uploadToCloudinary(file)).rejects.toThrow(
      "Invalid image file format",
    );
  });
});
