# AI Rules for Book Market App

## Tech Stack Overview

- **Framework**: React 18 with TypeScript, built on Vite for fast development and optimized builds
- **UI Components**: shadcn/ui component library built on top of Radix UI primitives for accessible, composable components
- **Styling**: Tailwind CSS with custom design tokens (gold, teal, coral, purple, amber color palettes) and CSS variables for theming
- **Backend/Auth**: Supabase for PostgreSQL database, authentication, file storage, and real-time subscriptions
- **Routing**: React Router v6 for client-side navigation with protected routes support
- **Data Fetching**: TanStack Query (React Query) for server state management, caching, and synchronization
- **Animations**: Framer Motion for declarative animations, page transitions, and gesture-based interactions
- **Icons**: Lucide React for consistent, lightweight SVG iconography throughout the application
- **Forms**: React Hook Form with Zod validation for type-safe form handling
- **Notifications**: Sonner for toast notifications and user feedback

## Library Usage Rules

### UI Components
- **ALWAYS use shadcn/ui components** from `@/components/ui/` before creating custom components
- Import shadcn components like: `import { Button } from "@/components/ui/button"`
- Extend shadcn components via props/className composition rather than modifying source files
- For custom components, place them in `src/components/` and keep them under 100 lines
- Use the existing `Button` variants: `default`, `destructive`, `outline`, `secondary`, `ghost`, `link`, `gold`, `gold-outline`

### Styling & CSS
- **NEVER use inline styles** - always use Tailwind classes
- **NEVER use arbitrary values** like `w-[100px]` - use standard Tailwind scale or extend config
- Use the custom color tokens: `text-primary`, `bg-gold`, `text-accent`, `bg-coral-light`, etc.
- Use `cn()` utility from `@/lib/utils` for conditional class merging
- Use `font-display` for headings (Playfair Display) and `font-body` for body text (DM Sans)
- Shadows: `shadow-soft`, `shadow-card`, `shadow-gold` for consistent elevation

### Data & State Management
- **ALWAYS use TanStack Query** for Supabase data fetching - no direct supabase calls in components
- Use `useAuth()` hook from `@/hooks/useAuth` for authentication state
- Use `useToast()` from `@/hooks/use-toast` for notifications (not direct Sonner imports)
- Keep server state (Supabase) separate from client state (React state)

### Routing & Navigation
- **ALWAYS use React Router** components: `Link`, `useNavigate`, `useLocation` from `react-router-dom`
- Use `<ProtectedRoute>` wrapper for authenticated pages
- Keep route definitions in `src/App.tsx` - do not create new route files

### Forms & Validation
- **ALWAYS use React Hook Form** with Zod resolvers for form handling
- Use `@/components/ui/form` components: `Form`, `FormField`, `FormItem`, `FormLabel`, `FormControl`, `FormMessage`
- Validate with Zod schemas defined inline or in a `schemas/` folder

### Icons
- **ONLY use Lucide React** icons: `import { IconName } from "lucide-react"`
- Common icons: `BookOpen`, `Search`, `User`, `ShoppingCart`, `Star`, `ArrowRight`, `Loader2` (for loading states)

### Animations
- **Use Framer Motion** for entrance animations, page transitions, and hover effects
- Use `motion.div` with `initial`, `animate`, `exit`, and `transition` props
- Use `AnimatePresence` for mount/unmount animations
- Keep animation durations between 200ms-600ms for optimal perceived performance

### File Organization
- Pages go in `src/pages/` (e.g., `Dashboard.tsx`, `Marketplace.tsx`)
- Shared components go in `src/components/`
- Page-specific components go in `src/components/[page]/` (e.g., `src/components/home/`)
- Hooks go in `src/hooks/` with `.ts` extension
- Utilities go in `src/lib/`
- **NEVER create files outside these locations**

### TypeScript Patterns
- **ALWAYS use TypeScript** - no `.js` or `.jsx` files
- Define interfaces for component props and data structures
- Use `interface` over `type` for object shapes
- Use proper return types for functions
- Leverage Supabase generated types from `@/integrations/supabase/types`

### Supabase Integration
- Import client from `@/integrations/supabase/client`
- Use typed database calls: `supabase.from("table").select()`
- Handle errors with try/catch and toast notifications
- Use storage buckets: `book-assets` for covers and manuscripts

### Performance Rules
- Use `loading="lazy"` on images below the fold
- Use `React.memo()` for expensive components
- Use `useCallback` for event handlers passed to children
- Keep component files small - refactor when exceeding 100 lines

### Testing
- Use Vitest for unit tests
- Use React Testing Library for component tests
- Place tests next to source files with `.test.ts` or `.test.tsx` extension

## Common Patterns

### Creating a New Page
1. Create file in `src/pages/NewPage.tsx`
2. Add route in `src/App.tsx`
3. Use `motion.div` wrapper for page entrance animation
4. Use `container` class for consistent padding

### Creating a New Component
1. Check if shadcn/ui has it first
2. Create file in `src/components/ComponentName.tsx`
3. Export as default
4. Keep props interface minimal
5. Use `cn()` for className merging

### Fetching Data
```typescript
const { data, isLoading } = useQuery({
  queryKey: ["books"],
  queryFn: async () => {
    const { data, error } = await supabase.from("books").select("*");
    if (error) throw error;
    return data;
  },
});
```

### Form Pattern
```typescript
const form = useForm<FormValues>({
  resolver: zodResolver(schema),
  defaultValues: { ... },
});
```

## Prohibited Patterns

- ❌ No `any` types without justification
- ❌ No direct `window` or `document` access without checks
- ❌ No external CSS libraries (Bootstrap, Material UI, etc.)
- ❌ No jQuery or vanilla JS DOM manipulation
- ❌ No inline styles (`style={{ ... }}`)
- ❌ No `console.log` in production code (use proper error handling)
- ❌ No mixing of async/await and .then() chains (prefer async/await)