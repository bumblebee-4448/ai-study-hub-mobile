/**
 * Document Feature - Public API
 * Feature-based architecture: all public exports go through index.ts
 * Features can import from: shared/, services/, stores/, theme/
 * Features CANNOT import from other features
 */

// Components
export {
  AISearchInput,
  CarouselSection,
  CourseCard,
  DocumentCard,
  Header,
  QuickChips,
} from "./components";

// Screens
export { DocumentHomeScreen, UploadScreen } from "./screens";


// Hooks
export { useDocument, useDocumentSearch, useQuickPrompts, useUploadDocument } from "./hooks";


// Store
export { useDocumentStore } from "./store/documentStore";

// Types
export type {
  Course,
  Document,
  DocumentState,
  PickedFile,
  QuickPrompt,
  UploadCategory,
  UploadFormData,
  UploadStatus,
} from "./types";


// Schemas
export {
  CourseSchema,
  DocumentSchema,
  QuickPromptSchema,
  UploadFormSchema,
} from "./schemas/documentSchema";

