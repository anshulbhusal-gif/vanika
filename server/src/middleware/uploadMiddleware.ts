import multer, { FileFilterCallback } from 'multer';
import { Request, Response, NextFunction } from 'express';
import { AppError } from './errorMiddleware';

const ALLOWED_MIME_TYPES = new Set(['image/jpeg', 'image/png', 'image/webp']);
const MAX_FILE_SIZE_BYTES = 5 * 1024 * 1024; // 5 MB

const storage = multer.memoryStorage();

const fileFilter = (req: Request, file: Express.Multer.File, cb: FileFilterCallback): void => {
  if (!file || !file.mimetype) {
    return cb(new AppError('Invalid file upload. A file is required.', 400));
  }

  if (!ALLOWED_MIME_TYPES.has(file.mimetype.toLowerCase())) {
    return cb(new AppError('Unsupported file type. Only JPEG, PNG, and WebP image files are allowed.', 400));
  }

  cb(null, true);
};

const rawUpload = multer({
  storage,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: 1,
  },
  fileFilter,
});

/**
 * Middleware for single photo upload handling with safe error formatting.
 */
export const uploadSinglePhoto = (fieldName: string = 'photo') => {
  return (req: Request, res: Response, next: NextFunction): void => {
    const uploadHandler = rawUpload.single(fieldName);

    uploadHandler(req, res, (err: any) => {
      if (err) {
        if (err instanceof multer.MulterError) {
          if (err.code === 'LIMIT_FILE_SIZE') {
            return next(new AppError('File size exceeds the 5 MB limit. Please select a smaller photo.', 400));
          }
          return next(new AppError(`File upload error: ${err.message}`, 400));
        }
        return next(err);
      }
      next();
    });
  };
};
