import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export interface StorageSaveOptions {
  buffer: Buffer;
  originalname: string;
  mimetype: string;
}

export class FileStorageService {
  private static readonly UPLOADS_ROOT = path.join(process.cwd(), 'uploads');
  private static readonly MEMORY_DIR = path.join(FileStorageService.UPLOADS_ROOT, 'memory');

  /**
   * Ensures necessary upload directories exist safely.
   */
  private static ensureDirectoryExists(): void {
    if (!fs.existsSync(FileStorageService.UPLOADS_ROOT)) {
      fs.mkdirSync(FileStorageService.UPLOADS_ROOT, { recursive: true });
    }
    if (!fs.existsSync(FileStorageService.MEMORY_DIR)) {
      fs.mkdirSync(FileStorageService.MEMORY_DIR, { recursive: true });
    }
  }

  /**
   * Map MIME type to safe file extension.
   */
  private static getExtensionFromMimeType(mimetype: string): string {
    switch (mimetype.toLowerCase()) {
      case 'image/jpeg':
      case 'image/jpg':
        return '.jpg';
      case 'image/png':
        return '.png';
      case 'image/webp':
        return '.webp';
      default:
        return '.bin';
    }
  }

  /**
   * Saves an uploaded file buffer with a collision-resistant UUID filename.
   * Returns a safe relative servable URL, e.g. `/uploads/memory/uuid.webp`.
   */
  public static async saveFile(file: StorageSaveOptions): Promise<string> {
    FileStorageService.ensureDirectoryExists();

    const uuid = crypto.randomUUID();
    const ext = FileStorageService.getExtensionFromMimeType(file.mimetype);
    const filename = `${uuid}${ext}`;
    const targetPath = path.join(FileStorageService.MEMORY_DIR, filename);

    // Verify path safety against directory traversal
    const normalizedPath = path.normalize(targetPath);
    if (!normalizedPath.startsWith(FileStorageService.UPLOADS_ROOT)) {
      throw new Error('Path traversal attempt detected during file storage');
    }

    await fs.promises.writeFile(normalizedPath, file.buffer);

    // Return safe relative servable URL using forward slashes
    return `/uploads/memory/${filename}`;
  }

  /**
   * Resolves a relative servable URL to its absolute filesystem path safely.
   * Returns null if path is invalid or attempts traversal outside UPLOADS_ROOT.
   */
  public static resolveFilePath(relativeUrl: string): string | null {
    if (!relativeUrl || typeof relativeUrl !== 'string') {
      return null;
    }

    // Only process local upload paths starting with /uploads/ or uploads/
    const cleanedPath = relativeUrl.replace(/^\//, '');
    if (!cleanedPath.startsWith('uploads/')) {
      return null;
    }

    const absolutePath = path.normalize(path.join(process.cwd(), cleanedPath));
    const uploadsRoot = path.normalize(FileStorageService.UPLOADS_ROOT);

    if (!absolutePath.startsWith(uploadsRoot)) {
      // Path traversal detected!
      return null;
    }

    return absolutePath;
  }

  /**
   * Safely deletes an internally stored image file.
   * Does not fail if the file is missing or if URL is an external link.
   */
  public static async deleteFile(relativeUrl: string): Promise<boolean> {
    try {
      const absolutePath = FileStorageService.resolveFilePath(relativeUrl);
      if (!absolutePath) {
        // Not a local stored file or unsafe path; safely ignore
        return false;
      }

      if (fs.existsSync(absolutePath)) {
        await fs.promises.unlink(absolutePath);
        return true;
      }
      return false;
    } catch (error) {
      console.warn(`FileStorageService: Safe error cleanup failure for ${relativeUrl}:`, error);
      return false;
    }
  }
}
