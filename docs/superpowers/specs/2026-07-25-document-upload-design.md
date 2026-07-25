# Document Upload Design

**Date:** 2026-07-25

## Goal

Make the mobile document upload flow create a document successfully through the existing NestJS document-processing pipeline without exposing Cloudinary credentials to the mobile app.

## Root cause

The mobile app sends `multipart/form-data` to `POST /documents/upload`, but the backend exposes only `POST /documents`, which accepts Cloudinary metadata as JSON (`fileUrl`, `publicId`, `sizeInBytes`, `format`, `resourceType`). No mobile Cloudinary integration exists, so the current request cannot satisfy the backend contract.

## Chosen architecture

Add a protected, verified-account backend endpoint `POST /documents/upload` that accepts one multipart file under the `file` field plus the existing document metadata fields. The backend will:

1. Validate the file presence, extension, MIME type, and configured size limit.
2. Upload the file to Cloudinary using server-only credentials and the `raw` resource type.
3. Map the Cloudinary response into the existing `CreateDocumentDto` contract.
4. Reuse `DocumentsService.create` so status, subject validation, processing enqueue, and moderator broadcast remain centralized.
5. Destroy the Cloudinary asset if document creation fails after upload.

The mobile app will continue using the existing document picker and form state, but will call the new endpoint. It will not send Cloudinary metadata, and it will let Axios set the multipart boundary automatically.

## API contract

`POST /api/v1/documents/upload`

Request:

- Header: `Authorization: Bearer <access-token>`
- Content type: `multipart/form-data`
- File field: `file`
- Text fields: `title`, optional `description`, optional `subjectId`, `isPublic` (`true` or `false`)

Response: the same wrapped document response returned by `POST /documents`, so the existing Axios response unwrapping and query invalidation continue to work.

## Validation and failure handling

- Missing file returns a client error before Cloudinary is called.
- Unsupported extension or configured size overflow is rejected using `SettingsService.validateDocumentUpload`.
- Cloudinary upload failure is returned as an internal upload error without creating a database record.
- Database/document creation failure triggers best-effort Cloudinary cleanup and preserves the original error.
- The existing asynchronous document processing enqueue remains unchanged.

## Testing

Backend Jest tests will cover the upload service/controller contract, Cloudinary response mapping, cleanup after document creation failure, and validation before upload. The mobile mapper/service will be tested through typecheck and focused pure helper coverage where the current mobile project has no configured Jest test command.

## Scope boundaries

This change does not implement chat, AI summary UI, authentication flows, or download/bookmark behavior. It only fixes the document upload path and its backend storage integration.
