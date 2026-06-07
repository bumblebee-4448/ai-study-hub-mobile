# Document Feature - Feature-Based Architecture Implementation

## 📋 Overview

The Document feature implements the home screen of AcademiShare - an AI-powered educational resource hub. This feature demonstrates the Feature-Based Architecture pattern with a complete, self-contained module following React Native Expo best practices.

## 📁 Structure

```
features/document/
├── components/              # Feature-specific UI components
│   ├── Header.tsx          # Sticky header with logo & avatar
│   ├── AISearchInput.tsx    # AI search bar with focus states
│   ├── QuickChips.tsx       # Horizontal scrollable prompt chips
│   ├── DocumentCard.tsx     # Trending document card (180px)
│   ├── CourseCard.tsx       # Recommended course card (240px)
│   ├── CarouselSection.tsx  # Reusable carousel wrapper
│   └── index.ts            # Component exports
├── screens/                 # Feature screens
│   ├── DocumentHomeScreen.tsx # Main home screen
│   └── index.ts            # Screen exports
├── hooks/                   # Feature custom hooks
│   ├── useDocument.ts       # Document-specific hooks
│   └── index.ts            # Hook exports
├── store/                   # Feature state (Zustand)
│   └── documentStore.ts    # Global feature state
├── schemas/                 # Zod validation schemas
│   └── documentSchema.ts   # Type validation schemas
├── types.ts                 # TypeScript interfaces
└── index.ts                 # Public API (required)
```

## 🎯 Key Features

### Components
- **Header**: Sticky top bar with AcademiShare logo and user avatar
- **AISearchInput**: Focus-aware search input with Material icons
- **QuickChips**: Horizontally scrollable quick prompt buttons
- **DocumentCard**: Card displaying trending documents (180px width)
- **CourseCard**: Card displaying recommended courses (240px width)
- **CarouselSection**: Reusable wrapper for carousel sections

### State Management
- **useDocumentStore**: Zustand store with trending documents, courses, and quick prompts
- **useDocument**: Hook to access store state
- **useQuickPrompts**: Hook for quick prompt interactions
- **useDocumentSearch**: Hook for search functionality

### Screens
- **DocumentHomeScreen**: Complete home screen with sticky header, AI search, carousels, and bottom navigation space

## 🎨 Design System

The feature uses Material Design 3 color system with:
- **Primary**: #004ac6 (AcademiShare blue)
- **Secondary**: #2b6193 (Secondary blue)
- **Background**: #faf8ff (Light purple)
- **Font**: Inter family
- **Spacing**: 8px base unit

Typography scales include: display, headline-lg, headline-md, body-lg, body-md, label-md, label-sm

## 📦 Usage

### Basic Import
```typescript
import { DocumentHomeScreen } from '@/features/document';
```

### Using Components
```typescript
import { Header, AISearchInput, DocumentCard } from '@/features/document';

export function MyScreen() {
  return (
    <>
      <Header avatarUrl="..." />
      <AISearchInput value={search} onChange={setSearch} />
    </>
  );
}
```

### Using Hooks
```typescript
import { useDocumentSearch, useDocument } from '@/features/document';

export function SearchComponent() {
  const { searchQuery, handleSearch } = useDocumentSearch();
  const { trendingDocuments } = useDocument();
  
  return (
    // ...
  );
}
```

### Using Store Directly
```typescript
import { useDocumentStore } from '@/features/document';

export function DocumentList() {
  const trendingDocs = useDocumentStore(s => s.trendingDocuments);
  return (
    // ...
  );
}
```

## 🔄 Architecture Compliance

✅ **Feature Isolation**: Completely self-contained feature module
✅ **Import Rules**: 
  - Can import from: `@/shared/`, `@/services/`, `@/stores/`, `@/theme/`, `@/constants/`
  - Cannot import from: other features
✅ **Public API**: All exports via `index.ts`
✅ **No Cross-Feature**: Feature doesn't import from other features
✅ **Theme Integration**: Uses centralized `@/constants/theme` design tokens
✅ **Type Safety**: Full TypeScript with Zod schemas for validation

## 🔌 Integration Points

### Navigation
To integrate with your app routing, add to your `app/(tabs)/index.tsx`:
```typescript
import { DocumentHomeScreen } from '@/features/document';

export default function HomeTab() {
  return <DocumentHomeScreen />;
}
```

### State Synchronization
The store automatically loads with mock data. To connect with real API:
```typescript
// In your services or effect
const { setTrendingDocuments } = useDocumentStore();
const documents = await fetchTrendingDocuments();
setTrendingDocuments(documents);
```

## 📝 Data Models

### Document
```typescript
interface Document {
  id: string;
  title: string;
  icon: "picture_as_pdf" | "description" | "folder_zip";
  downloads: number;
  category?: string;
}
```

### Course
```typescript
interface Course {
  id: string;
  title: string;
  instructor: string;
  category: string;
  categoryColor: "primary" | "secondary";
  imageUrl: string;
}
```

### QuickPrompt
```typescript
interface QuickPrompt {
  id: string;
  label: string;
}
```

## 🧪 Validation

All data types have Zod schemas:
```typescript
import { DocumentSchema, CourseSchema } from '@/features/document';

const validDoc = DocumentSchema.parse(data);
```

## 🎯 Interaction Patterns

### Search
```typescript
const { searchQuery, handleSearch, clearSearch } = useDocumentSearch();

<AISearchInput 
  value={searchQuery}
  onChange={handleSearch}
/>
```

### Quick Prompts
```typescript
const { quickPrompts, handlePromptPress } = useQuickPrompts();

<QuickChips 
  chips={quickPrompts}
  onChipPress={handlePromptPress}
/>
```

### Carousel Navigation
```typescript
const handleDocumentPress = (docId: string) => {
  // Navigate to document detail
  // router.push(`/document/${docId}`);
};

<CarouselSection title="Tài liệu thịnh hành">
  {trendingDocuments.map(doc => (
    <DocumentCard 
      key={doc.id}
      document={doc}
      onPress={handleDocumentPress}
    />
  ))}
</CarouselSection>
```

## 🚀 Extension Points

### Adding New Sections
1. Create component in `components/`
2. Add state to `documentStore.ts`
3. Use in `DocumentHomeScreen`
4. Export in `index.ts`

### Connecting to API
1. Create service in `@/services/` (not in feature)
2. Use in hooks or screen
3. Update store with fetched data

### Custom Validation
Extend Zod schemas in `schemas/documentSchema.ts`:
```typescript
const ExtendedDocumentSchema = DocumentSchema.extend({
  tags: z.array(z.string()),
});
```

## 📚 Related Files

- Design tokens: `@/constants/theme.ts`
- Shared components: `@/shared/components/`
- API services: `@/services/api/`
- Global stores: `@/stores/`

## ✅ Feature Checklist

- [x] Create folder structure following Feature-Based Architecture
- [x] Create components with StyleSheet (no Tailwind)
- [x] Implement state management with Zustand
- [x] Add Zod schemas for type validation
- [x] Create custom hooks for feature logic
- [x] Build main screen component
- [x] Export public API via index.ts
- [x] No imports from other features
- [x] Complete TypeScript types
- [x] Material Design 3 compliance
- [x] Sticky header with AI search
- [x] Horizontal carousels
- [x] Bottom nav spacing (80px)

## 🎓 Learning Resources

- Feature-Based Architecture: See `@/skills/feature-based-architecture/SKILL.md`
- Material Design 3: https://m3.material.io/
- Zustand: https://github.com/pmndrs/zustand
- Zod: https://zod.dev/
- React Native Styling: https://reactnative.dev/docs/stylesheet

---

**Status**: ✅ Production Ready
**Last Updated**: 2026-06-07
