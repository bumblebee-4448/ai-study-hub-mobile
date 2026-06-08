export { DocumentDetailScreen, DocumentHomeScreen, EditDocumentScreen, UploadScreen } from "./screens";
export { useDocument, useDocumentSearch, useQuickPrompts, useUploadDocument } from "./hooks";
export { useDocumentStore } from "./store/documentStore";

export type {
  Course,
  Document,
  DocumentDetail,
  EditDocumentParams,
  PickedFile,
  QuickPrompt,
  RelatedDocument,
  UploadCategory,
  UploadStatus,
} from "./types";

export { EditDocumentFormSchema, UploadFormSchema } from "./schemas/documentSchema";
export type { EditDocumentFormType, UploadFormType } from "./schemas/documentSchema";
