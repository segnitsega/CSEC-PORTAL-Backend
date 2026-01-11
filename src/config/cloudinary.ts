import { v2 as cloudinary, UploadApiResponse } from 'cloudinary';
import { PassThrough } from 'stream';
import { config } from './index';

cloudinary.config({
  cloud_name:  config.CLOUDINARY_CLOUD_NAME,
  api_key:     config.CLOUDINARY_API_KEY,
  api_secret:  config.CLOUDINARY_API_SECRET,
  secure:      true,
});

export const uploadToCloudinary = (
  buffer: Buffer,
  publicId: string
): Promise<UploadApiResponse> => {
  return new Promise((resolve, reject) => {
    const passthrough = new PassThrough();
    passthrough.end(buffer);

    const uploadStream = cloudinary.uploader.upload_stream(
      {
        folder: 'profile_pictures',
        public_id: publicId,
        resource_type: 'image',
      },
      (err: unknown, result: UploadApiResponse | undefined) => {
        if (err) return reject(err);
        resolve(result!);
      }
    );

    passthrough.pipe(uploadStream);
  });
};
