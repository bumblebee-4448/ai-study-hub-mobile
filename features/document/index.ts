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
export {
  DocumentDetailScreen,
  DocumentHomeScreen,
  EditDocumentScreen,
  ModeratorDocumentDetailScreen,
  ModeratorReviewScreen,
  UploadScreen,
} from "./screens";

// Hooks
export {
  useDocument,
  useDocumentSearch,
  useQuickPrompts,
  useUploadDocument,
} from "./hooks";

// Store
export { useDocumentStore } from "./store/documentStore";

// Types
export type {
  Course,
  Document,
  DocumentDetail,
  DocumentState,
  EditDocumentParams,
  PickedFile,
  QuickPrompt,
  RelatedDocument,
  UploadCategory,
  UploadFormData,
  UploadStatus,
} from "./types";

// Schemas
export {
  EditDocumentFormSchema,
  UploadFormSchema,
  CourseSchema,
  DocumentSchema,
  QuickPromptSchema,
} from "./schemas/documentSchema";

export type {
  EditDocumentFormType,
  UploadFormType,
} from "./schemas/documentSchema";
