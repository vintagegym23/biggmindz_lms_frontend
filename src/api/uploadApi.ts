import { apiClient } from './client';

export interface UploadResult {
  assetId: string;
  secureUrl: string;
  durationSeconds?: number;
  bytes?: number;
  format?: string;
}

interface CloudinaryUploadResponse {
  public_id: string;
  secure_url: string;
  format?: string;
  bytes?: number;
  duration?: number;
  width?: number;
  height?: number;
  original_filename?: string;
}

const CLOUDINARY_RESOURCE_TYPE: Record<'VIDEO' | 'IMAGE', 'video' | 'image'> = {
  VIDEO: 'video',
  IMAGE: 'image'
};

function uploadToCloudinary(
  file: File,
  cloudName: string,
  cloudinaryResourceType: 'video' | 'image',
  fields: { apiKey: string; timestamp: number; signature: string; folder: string },
  onProgress?: (percent: number) => void
): Promise<CloudinaryUploadResponse> {
  return new Promise((resolve, reject) => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('api_key', fields.apiKey);
    formData.append('timestamp', String(fields.timestamp));
    formData.append('signature', fields.signature);
    formData.append('folder', fields.folder);

    const xhr = new XMLHttpRequest();
    xhr.open('POST', `https://api.cloudinary.com/v1_1/${cloudName}/${cloudinaryResourceType}/upload`);
    xhr.upload.onprogress = (event) => {
      if (event.lengthComputable && onProgress) {
        onProgress(Math.round((event.loaded / event.total) * 100));
      }
    };
    xhr.onload = () => {
      if (xhr.status >= 200 && xhr.status < 300) {
        resolve(JSON.parse(xhr.responseText));
      } else {
        reject(new Error('Upload to Cloudinary failed.'));
      }
    };
    xhr.onerror = () => reject(new Error('Upload to Cloudinary failed. Check your connection and try again.'));
    xhr.send(formData);
  });
}

export const uploadApi = {
  /**
   * Direct browser -> Cloudinary upload using a short-lived signature from
   * our own server (the Cloudinary API secret never reaches the browser).
   * Confirms the resulting asset with our backend so it becomes a real
   * Asset row that can be attached to a lesson/course.
   */
  async uploadFile(
    file: File,
    folder: string,
    resourceType: 'VIDEO' | 'IMAGE',
    onProgress?: (percent: number) => void
  ): Promise<UploadResult> {
    const cloudinaryResourceType = CLOUDINARY_RESOURCE_TYPE[resourceType];

    const signRes = await apiClient.post('/uploads/sign', { folder, resourceType: cloudinaryResourceType });
    const { timestamp, signature, apiKey, cloudName } = signRes.data.data as {
      timestamp: number;
      signature: string;
      apiKey: string;
      cloudName: string;
    };

    const cloudinaryResponse = await uploadToCloudinary(
      file,
      cloudName,
      cloudinaryResourceType,
      { apiKey, timestamp, signature, folder },
      onProgress
    );

    const confirmRes = await apiClient.post('/uploads/confirm', {
      publicId: cloudinaryResponse.public_id,
      resourceType,
      secureUrl: cloudinaryResponse.secure_url,
      format: cloudinaryResponse.format,
      bytes: cloudinaryResponse.bytes,
      durationSeconds: cloudinaryResponse.duration,
      width: cloudinaryResponse.width,
      height: cloudinaryResponse.height,
      originalFilename: cloudinaryResponse.original_filename
    });

    return {
      assetId: confirmRes.data.data.id as string,
      secureUrl: cloudinaryResponse.secure_url,
      durationSeconds: cloudinaryResponse.duration,
      bytes: cloudinaryResponse.bytes,
      format: cloudinaryResponse.format
    };
  }
};
