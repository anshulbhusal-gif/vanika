# Caregiver Photo File Upload Architecture & Specification

## Overview

The Vanika Cognitive Care platform allows caregivers and family members to upload personal high-resolution photos (such as family celebrations, heritage events, or landmark memories) directly to the platform to generate personalized Memory Game content for elderly care recipients.

This capability complements the existing web image URL paste option (`Option B: Paste Image URL`), providing caregivers with maximum flexibility while keeping all patient vault content secure.

---

## Technical Specifications

| Parameter | Specification |
| :--- | :--- |
| **Supported Image Formats** | `image/jpeg`, `image/png`, `image/webp` |
| **Maximum File Size Limit** | 5 MB (5,242,880 bytes) |
| **Upload Multipart Field Name** | `photo` |
| **API Endpoint** | `POST /api/games/content/upload-photo` |
| **Delete Endpoint** | `DELETE /api/games/content/:id` |
| **Local File Storage Path** | `uploads/memory/<uuid>.<ext>` |
| **Public Static Route** | `/uploads/memory/<uuid>.<ext>` |
| **Required Permissions** | `CAREGIVER` or `ADMIN` role (Authenticated JWT) |

---

## Backend Architecture

### 1. Storage Abstraction Layer (`FileStorageService`)

- **Class Path**: `server/src/services/storage/FileStorageService.ts`
- **Collision-Resistant Naming**: Every uploaded file is assigned a randomly generated UUID v4 string (e.g. `c4b1a8d2-9f3e-4b2c-8a1d-7e9f3b2c1a0d.webp`). Raw client filenames are never used for storage.
- **Directory Traversal Protection**: All input paths are normalized via `path.normalize()`. System verifies that resolved target paths strictly originate within the base `uploads/` root directory.
- **Servable Relative URLs**: Returns safe web-accessible relative paths (`/uploads/memory/<uuid>.<ext>`) stored in `GameContentItem.mediaUrl`.

### 2. Upload Middleware (`uploadMiddleware`)

- **File Path**: `server/src/middleware/uploadMiddleware.ts`
- **Library**: `multer` (memory storage engine).
- **MIME Validation**: Validates `file.mimetype` against `image/jpeg`, `image/png`, and `image/webp`. Rejects non-image formats cleanly with HTTP 400.
- **Limits**: Enforces `fileSize: 5 * 1024 * 1024` bytes. Oversized files trigger a client-safe `AppError` without exposing internal stack traces or machine filesystem paths.

### 3. Automatic Cleanup on Deletion

When a `GameContentItem` is deleted via `GameService.deleteContentItem`:
1. System checks if `item.mediaUrl` starts with `/uploads/` or `uploads/`.
2. Invokes `FileStorageService.deleteFile(item.mediaUrl)` to safely remove the file from local disk.
3. Missing local files or remote external URLs (`http://...`) do not crash or prevent database deletion.

---

## Security & RBAC Enforcement

1. **Authentication & Authorization**: `POST /api/games/content/upload-photo` is guarded by `authMiddleware` and `requireRole('CAREGIVER', 'ADMIN')`.
2. **IDOR Ownership Tracking**: `GameContentItem.ownerUserId` is automatically bound to `req.user.id`. Caregivers can only delete content items that they own (`item.ownerUserId === req.user.id`).
3. **Static File Serving Protection**: Express serves `/uploads` with `dotfiles: 'ignore'` and `index: false`, preventing directory listing or access to hidden environment files.

---

## Future Cloud Storage Migration Strategy (AWS S3 / Cloudinary)

`FileStorageService` is designed with an abstract storage contract (`saveFile`, `resolveFilePath`, `deleteFile`).

To migrate from local disk storage to cloud storage (e.g., AWS S3):
1. Update `FileStorageService.saveFile` to upload the file buffer to S3 using `@aws-sdk/client-s3` PutObjectCommand.
2. Return the S3 bucket HTTPS URL or CDN URL (`https://cdn.vanika.in/memory/<uuid>.webp`).
3. Update `FileStorageService.deleteFile` to issue DeleteObjectCommand.
4. No changes are required in `gameService.ts`, `gameController.ts`, or the frontend React UI!

---

## Caregiver Dashboard Usage Guide

1. Navigate to **Caregiver Portal** → Click **+ Add Family Photo**.
2. Select between:
   - **Option A: Upload Photo**: Select a JPEG, PNG, or WebP image file up to 5 MB from your device.
   - **Option B: Paste Image URL**: Paste a direct web image link.
3. Verify the instant **Photo Preview** powered by `<SafeImage />`.
4. Enter memory details (Title, Person Name, Relationship, Audio Hint, and Choice Options).
5. Click **Save to Encrypted Vault**.
