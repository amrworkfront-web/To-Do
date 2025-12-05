# System Documentation & Architecture Analysis

## 1. High-Level Overview

This application is a **Task Management System** built with **Next.js 16 (App Router)** on the frontend and a **Strapi Headless CMS** on the backend. It allows users to create, view, update, and delete tasks.

### Architecture
- **Client**: Next.js application serving the UI. It uses **Client Components** extensively for interactivity.
- **Server/Backend**: A **Strapi** instance running locally on port `1337`. The Next.js app communicates directly with Strapi via REST API calls from the browser.
- **Database**: Managed by Strapi (likely SQLite or Postgres, depending on Strapi config).

### Key Technologies
- **Framework**: [Next.js 16](https://nextjs.org/) (App Router)
- **Authentication**: [Clerk](https://clerk.com/) (`@clerk/nextjs`)
- **State Management & Data Fetching**: [React Query](https://tanstack.com/query/latest) (`@tanstack/react-query`)
- **HTTP Client**: [Axios](https://axios-http.com/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/) with [Shadcn UI](https://ui.shadcn.com/) components and [Framer Motion](https://www.framer.com/motion/) for animations.
- **Icons**: `lucide-react`

---

## 2. Authentication Flow (Clerk)

Authentication is handled entirely by **Clerk**.

### How it works:
1.  **Middleware Protection**: The `middleware.ts` file protects the entire application.
    -   Public Routes: `/sign-in`, `/sign-up`
    -   Protected Routes: All others (redirects to sign-in if unauthenticated).
2.  **User Session**: The `<ClerkProvider>` in `app/providers.tsx` wraps the application, managing the session context.
3.  **Accessing User Data**: Components use the `useUser()` hook from `@clerk/nextjs` to access the current user's profile and, crucially, their `id`.
4.  **Data Security**: The application uses the Clerk User ID to filter data in the backend queries (e.g., `filters[userId][$eq]=user_id`).

### Step-by-Step Flow:
1.  User visits the app.
2.  If not logged in, `middleware.ts` redirects to Clerk's hosted Sign-In page.
3.  User signs in.
4.  Clerk redirects back to the app.
5.  `useUser()` hook becomes `isLoaded: true` and provides the `user` object.
6.  Components (like `TasksList`) wait for `user.id` to be available before fetching data.

---

## 3. Data Fetching Layer (React Query)

The application uses **React Query** to manage server state, caching, and synchronization.

### Organization
-   **API Client**: Configured in `app/_utils/axiosClient.ts`. It sets a base URL (`http://localhost:1337/api`) and attaches a static API key.
-   **API Methods**: Defined in `app/_utils/taskApi.ts`. This file contains functions for all CRUD operations (`getTasks`, `createTask`, `deleteTask`, etc.).
-   **Query Keys**: The app uses a consistent key pattern: `["todos", user.id]`. This ensures that data is cached per user.

### Synchronization Strategy
-   **Fetching**: `useQuery` fetches data when the component mounts and `user.id` is available.
-   **Mutations**: `useMutation` handles updates (Create, Update, Delete).
-   **Invalidation**: On a successful mutation (`onSuccess`), the app calls `queryClient.invalidateQueries({ queryKey: ["todos", user.id] })`.
    -   This forces React Query to refetch the fresh data from the server, automatically updating the UI (e.g., the list of tasks and the stats).

### Full Flow:
1.  **User opens app**: `TasksList` component mounts.
2.  **Loading**: `useQuery` sees `isLoading` is true.
3.  **Fetch**: `queryFn` calls `taskApi.getTasks(user.id)`.
4.  **Display**: Data arrives, `TasksList` renders the list of tasks.
5.  **Stats**: Simultaneously, `StatsCard` mounts and performs the *same* fetch (deduplicated by React Query if timing aligns) to calculate counts.

---

## 4. API Architecture

The application does **not** use Next.js API Routes (`app/api` folder is missing). Instead, the client communicates **directly** with the Strapi backend.

### Endpoints (Strapi)
All endpoints are prefixed with `http://localhost:1337/api`.

| Method | Endpoint | Description | Protected? |
| :--- | :--- | :--- | :--- |
| `GET` | `/tasks?filters[userId][$eq]=...` | Fetches tasks for a specific user. | Yes (via API Key) |
| `POST` | `/tasks` | Creates a new task. | Yes (via API Key) |
| `DELETE` | `/tasks/:id` | Deletes a task by ID. | Yes (via API Key) |
| `PUT` | `/tasks/:id` | Updates a task (status or content). | Yes (via API Key) |

### Error Handling
-   Currently, there is minimal explicit error handling in the UI.
-   If an API call fails, `useQuery` will set `isError` to true, but the components generally don't render specific error messages.
-   Axios will throw errors for non-2xx responses.

---

## 5. Component Structure

### Key Components

1.  **`app/layout.tsx`**:
    -   **Responsibility**: Root layout. Wraps the app in `Providers`.
    -   **Structure**: Sidebar (left), Navbar (top), Main Content (center).

2.  **`app/providers.tsx`**:
    -   **Responsibility**: Configures global providers: `ClerkProvider`, `QueryClientProvider`, `ThemeProvider`.

3.  **`app/page.tsx` (Home)**:
    -   **Responsibility**: Dashboard composition.
    -   **Children**: `StatsCard`, `AddTask`, `TasksList`, `RightPanel`.

4.  **`app/components/tasks-list.tsx`**:
    -   **Responsibility**: Fetches and lists tasks.
    -   **Logic**: Uses `useQuery` to get tasks. Maps over data to render `Task` components.

5.  **`app/components/add-tsk.tsx`**:
    -   **Responsibility**: Form to create new tasks.
    -   **Logic**: Uses local state for inputs. Uses `useMutation` to POST data and invalidate queries.

6.  **`app/components/stats-card.tsx`**:
    -   **Responsibility**: Displays summary statistics (Total, Completed, Active).
    -   **Logic**: Fetches *all* tasks again (via `useQuery`) and calculates counts client-side.

---

## 6. State Management & UI Behavior

-   **Server State**: Managed by **React Query**. This is the source of truth for tasks.
-   **Local State**: Managed by `useState`. Used for form inputs (e.g., in `AddTask`) and UI toggles.
-   **Optimistic Updates**: Not currently implemented. The app waits for the server response before updating the UI (via invalidation).
-   **Loading States**: Components check `isLoading` from `useQuery` and `isLoaded` from Clerk to show "Loading..." text.

---

## 7. Folder Structure Walkthrough

```
app/
├── (auth)/             # Route group for authentication pages (Sign In/Up)
├── _utils/             # Utility functions
│   ├── axiosClient.ts  # Axios instance configuration (Base URL, Headers)
│   └── taskApi.ts      # API service layer (GET, POST, DELETE methods)
├── components/         # Reusable UI components
│   ├── add-tsk.tsx     # Task creation form
│   ├── navbar.tsx      # Top navigation
│   ├── right-panel.tsx # Right sidebar (calendar/profile)
│   ├── sidebar.tsx     # Left navigation sidebar
│   ├── stats-card.tsx  # Statistics dashboard
│   ├── task.tsx        # Individual task item
│   └── tasks-list.tsx  # List container for tasks
├── hooks/              # Custom hooks
│   └── useTask.ts      # (Currently unused/trivial) Returns user ID
├── layout.tsx          # Root layout (HTML structure, Providers wrapper)
├── middleware.ts       # Clerk authentication middleware
├── page.tsx            # Main dashboard page
└── providers.tsx       # Context providers (Clerk, React Query, Theme)
```

**Design Rationale**:
-   **`_utils`**: Separates API logic from UI components, making code cleaner and reusable.
-   **`components`**: Flat structure for components used in the dashboard.
-   **`providers.tsx`**: Keeps `layout.tsx` clean by isolating provider logic (which requires `"use client"`).

---

## 8. Full Data Flow Diagram

```mermaid
graph TD
    User[User] -->|Interacts| UI[Client UI (Next.js)]
    UI -->|1. Auth Check| Clerk[Clerk Auth]
    Clerk -->|2. Returns User ID| UI
    
    subgraph Data Fetching
    UI -->|3. useQuery| RQ[React Query]
    RQ -->|4. Call API| API[taskApi.ts]
    API -->|5. Axios Request| Axios[Axios Client]
    end
    
    subgraph Backend
    Axios -->|6. HTTP GET/POST| Strapi[Strapi CMS (localhost:1337)]
    Strapi -->|7. Database Query| DB[(Database)]
    DB -->|8. Data Return| Strapi
    end
    
    Strapi -->|9. JSON Response| Axios
    Axios -->|10. Data| RQ
    RQ -->|11. Update Cache| UI
    UI -->|12. Render Tasks| User
```

---

## 9. Evaluation: Good & Bad

### ✅ Good (Strengths)
1.  **Modern Stack**: Uses the latest Next.js 16 and React 19 features.
2.  **Clean Separation of Concerns**: API logic is isolated in `_utils/taskApi.ts`, keeping components focused on UI.
3.  **Robust State Management**: React Query handles caching, loading states, and refetching effectively.
4.  **Component Modularity**: The UI is broken down into small, manageable components (`StatsCard`, `Task`, `AddTask`).
5.  **Authentication**: Secure and simple auth implementation using Clerk.

### ❌ Bad (Weaknesses & Risks)
1.  **Security Risk (Critical)**: The `NEXT_PUBLIC_REST_API_KEY` is exposed to the client. If this key has broad permissions in Strapi, any user could potentially query *all* data by manually making requests.
2.  **Hardcoded Configuration**: The API URL (`http://localhost:1337/api`) is hardcoded in `axiosClient.ts`. This will break when deploying to production.
3.  **Inefficient Data Fetching**: `StatsCard` fetches *all* tasks just to count them. `TasksList` also fetches all tasks. While React Query helps, this is fetching full data objects when only counts are needed for the stats.
4.  **No Error UI**: Users are not notified if an API call fails (e.g., "Failed to create task").
5.  **Optimistic Updates Missing**: The UI waits for the server to respond before showing the new task, which can feel slightly sluggish compared to optimistic updates.

---

## 10. Feature Suggestions

1.  **Optimistic Updates**:
    -   *Why*: Make the app feel instant. Show the new task immediately in the list while the API request processes in the background.
2.  **Server-Side Filtering/Security**:
    -   *Why*: Instead of trusting the client to send the correct `userId`, use a Next.js Route Handler (`app/api/tasks`) as a proxy. The Route Handler can verify the Clerk session server-side and securely attach the Strapi API key, preventing key leakage.
3.  **Pagination or Infinite Scroll**:
    -   *Why*: As the task list grows, fetching all tasks at once will become slow.
4.  **Task Categories/Tags**:
    -   *Why*: Better organization. Add a `category` field to the Strapi model and UI.
5.  **Dark Mode Toggle**:
    -   *Why*: The `ThemeProvider` is installed, but a visible toggle button in the `Navbar` would improve UX.
