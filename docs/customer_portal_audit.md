# Customer Portal Implementation & API Contract Audit Report

**Date:** August 21, 2026  
**Target Application:** `web-frontend` (Customer Portal)  
**Reference API:** `backend` (Express.js + Prisma API Contracts)  
**Scope:** Architecture, Environment/Config, DTO/Schema Compatibility, Feature Completeness, State & Routing, Phased Action Plan  
**Constraint Status:** Read-Only Backend Enforcement — All remediation actions are strictly scoped to `web-frontend/`.

---

## Executive Summary

An exhaustive audit of the Customer Portal implementation in `web-frontend` against the backend endpoints, controllers, services, and Zod schemas in `backend/` reveals significant architectural divergence, endpoint naming collisions, duplicate/conflicting API client implementations, schema typing mismatches (such as string-vs-number budget payloads), and critical missing pages that currently lead to 404s in core navigation flows.

### Summary of Critical Findings

| Severity     | Category          | Issue Description                                                                                                                                                                                            | Impact                                                                        |
| :----------- | :---------------- | :----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | :---------------------------------------------------------------------------- |
| **CRITICAL** | Auth & State      | `authApi.getMe()` response unwrapping mismatch in `AuthProvider.tsx` (`response.user` vs direct `response`).                                                                                                 | User auth state evaluates to `undefined`, breaking authenticated role-checks. |
| **CRITICAL** | API Routing       | Two conflicting job/application client implementations (`src/features/*` vs `src/lib/api/*`). The active UI imports routes that do not exist (`/api/v1/jobs/customer/jobs`, `/api/v1/applications/job/:id`). | Core customer pages crash or 404 upon data fetching.                          |
| **CRITICAL** | DTO / Zod         | `JobForm.tsx` sends `budget` as a string (`"500.00"`), but backend Zod schema requires `z.number().positive()`.                                                                                              | Job posting fails with 400 Bad Request validation errors.                     |
| **CRITICAL** | API Envelope      | `GET /api/v1/jobs` returns `{ success: true, jobs: [...], meta: {...} }` rather than `{ success: true, data: [...] }`.                                                                                       | Public and customer job feeds unwrap `undefined` data.                        |
| **HIGH**     | Missing Routes    | Missing `/customer/jobs` (My Jobs), `/customer/workers` (Find Workers), `/customer/profile`, and `/customer/settings`.                                                                                       | 4 out of 5 sidebar navigation links lead to 404.                              |
| **HIGH**     | Direct Booking    | Public worker detail page (`/worker/[id]`) "Hire" modal redirects to non-existent `/dashboard` instead of calling `POST /api/v1/jobs/direct`.                                                                | Customer cannot hire or send direct service requests to specific workers.     |
| **HIGH**     | Reviews & Ratings | Zero review services, hooks, or UI modals exist in frontend despite backend supporting bidirectional job reviews (`POST /api/v1/reviews`).                                                                   | Customers cannot review workers upon job completion.                          |
| **MEDIUM**   | Auth / Cookies    | `middleware.ts` checks `servicehub_access_token` and `accessToken`, but backend sets cookie `access_token`. Middleware does not protect `/customer/*`.                                                       | Inconsistent session recognition and missing customer route protection.       |

---

## 1. Environment & Configuration Audit

### 1.1 Port & URL Expectations

```
┌────────────────────────────────────────────────────────┐
│                   PORT COLLISION RISK                  │
├──────────────────────────┬─────────────────────────────┤
│ Backend Default Port     │ 3000 (backend/src/config/env.ts:7)
│ Backend FRONTEND_URL     │ http://localhost:3000 (env.ts:13)
│ Frontend NEXT_PUBLIC_API │ http://localhost:3000 (web-frontend/src/config/env.ts:4)
│ Next.js Default Port     │ 3000 (next dev)
└──────────────────────────┴─────────────────────────────┘
```

- **Issue:** Both the backend (`backend/src/config/env.ts:7`) and the Next.js frontend (`web-frontend/src/config/env.ts:4`) default to port `3000`.
- **CORS Guard:** `backend/src/config/cors.ts` strictly validates that incoming requests match `origin === env.FRONTEND_URL`. If the frontend is run on `http://localhost:3001` or `http://localhost:5173` without updating the backend `.env` (`FRONTEND_URL`), CORS rejection occurs.
- **Remediation Recommendation (Frontend):** Standardize frontend `.env.local` to point `NEXT_PUBLIC_API_URL="http://localhost:5000"` (or the designated backend server port) and document the port configuration clearly in `DEVELOPMENT.md`.

### 1.2 Cookie Name Inconsistencies

- **Backend:**
  - `backend/src/controllers/telegram.controller.ts:89`: Sets cookie `name: "access_token"`.
  - `backend/src/controllers/auth.controller.ts:58`: Clears cookie `"access_token"`.
- **Frontend Middleware (`web-frontend/src/middleware.ts:47-50`):**
  - Only checks `servicehub_access_token`, `accessToken`, and `token`. It **fails** to inspect `access_token`.
- **Impact:** Authenticated sessions established via Telegram OAuth or HTTP-only cookies are ignored by Next.js Edge middleware.

### 1.3 JWT Payload & Role Claims

- **Backend Token Signing (`backend/src/services/auth.service.ts:48`):**
  ```typescript
  jwt.sign(
    { id: userId, role: user.systemRole },
    env.JWT_SECRET,
    accessOptions,
  );
  ```
  The token payload contains `role: "USER" | "ADMIN"`, **not** the active operational role (`"CUSTOMER"` | `"WORKER"`).
- **Frontend Middleware Expectation (`web-frontend/src/middleware.ts:67`):**
  Attempts to parse `payload.lastActiveRole || payload.role` from the JWT token and match against `"WORKER"`. Since `payload.role` is `"USER"`, the check fails unless fallback cookies (`servicehub_active_role`, `lastActiveRole`, or `activeRole`) are present.
- **Customer Route Protection:**
  `web-frontend/src/middleware.ts:109` only matches `matcher: ["/worker/:path*"]`. It provides **zero** middleware protection for `/customer/:path*` routes.

---

## 2. DTO & API Contract Comparison

### 2.1 Response Envelope Structure

The backend utilizes two distinct response patterns across different controllers:

#### Pattern A: Standard Envelope with `data` (`sendSuccess` in `response.util.ts`)

```json
{
  "success": true,
  "data": { ... },
  "meta": { "page": 1, "limit": 10, "total": 10, "totalPages": 1 }
}
```

- Used by: `worker.controller.ts`, `auth.controller.ts`, `search.controller.ts`, `notification.controller.ts`, `upload.controller.ts`, `payment.controller.ts`.

#### Pattern B: Root Spread Envelope (`job.controller.ts` & `review.controller.ts`)

```json
// GET /api/v1/jobs
{
  "success": true,
  "jobs": [ ... ],
  "meta": { "page": 1, "limit": 10, "total": 5, "totalPages": 1 }
}

// GET /api/v1/customers/:id/reviews
{
  "data": [ ... ],
  "meta": { "page": 1, "limit": 10, "total": 2, "totalPages": 1 }
}
```

#### Frontend Client Breakdown (`web-frontend/src/lib/api.ts`):

- `apiClient.get<T>()` explicitly extracts `(response.data as ApiSuccessResponse<T>).data`.
- When calling `GET /api/v1/jobs`, `response.data` has keys `jobs` and `meta`, so `response.data.data` resolves to `undefined`.
- When calling `GET /api/v1/customers/:id/reviews`, `response.data.success` is `undefined`, triggering `if (!response.data.success) throw new ApiError(...)`.

#### Error Envelope Mismatch (`web-frontend/src/types/api.ts`):

- **Backend Error Response:**
  ```json
  {
    "success": false,
    "error": {
      "code": "VALIDATION_ERROR",
      "message": "Title must be at least 5 characters",
      "fields": { "title": "Too short" }
    }
  }
  ```
- **Frontend Type Definition:**
  ```typescript
  export interface ApiErrorResponse {
    success: false;
    error: string; // <-- Expected string, received object
  }
  ```
- In `web-frontend/src/lib/api.ts:40`, `error.response?.data?.error` evaluates to an object. When treated as a string, it displays `[object Object]` in the UI.

---

### 2.2 Duplicated & Broken API Service Layers

The frontend contains two parallel, conflicting architectures for Jobs and Applications:

```
                  ┌────────────────────────────────────────────────────────┐
                  │                 FRONTEND DIVERGENCE                    │
                  └────────────────────────────────────────────────────────┘
                                 /                         \
                                /                           \
          ┌───────────────────────────┐       ┌───────────────────────────┐
          │  src/features/jobs/       │       │  src/lib/api/jobs.ts      │
          │  src/features/proposals/  │       │  src/lib/api/applications │
          │  (USED IN CUSTOMER PAGES) │       │  (CORRECT CONTRACTS)      │
          └───────────────────────────┘       └───────────────────────────┘
```

#### Detailed Endpoint Mapping Analysis:

| Operation                | Invocation in Customer UI (`src/features/*`)                               | Contract in `src/lib/api/*`                                           | Actual Backend Route (`backend/src/routes/*`)                       | Status                        |
| :----------------------- | :------------------------------------------------------------------------- | :-------------------------------------------------------------------- | :------------------------------------------------------------------ | :---------------------------- |
| **Get My Jobs**          | `GET /api/v1/jobs/customer/jobs` (`features/jobs/api.ts:5`)                | `GET /api/v1/jobs/my` (`lib/api/jobs.ts:29`)                          | `GET /api/v1/jobs/my` (`job.routes.ts:44`)                          | ❌ **BROKEN IN UI** (404)     |
| **Get Worker Jobs**      | `GET /api/v1/jobs/worker/jobs` (`features/jobs/api.ts:9`)                  | `GET /api/v1/jobs/my` (`lib/api/jobs.ts:29`)                          | `GET /api/v1/jobs/my` (`job.routes.ts:44`)                          | ❌ **BROKEN IN UI** (404)     |
| **Public Jobs**          | `GET /api/v1/jobs/public` (`features/jobs/api.ts:22`)                      | `GET /api/v1/jobs` (`lib/api/jobs.ts:19`)                             | `GET /api/v1/jobs` (`job.routes.ts:20`)                             | ❌ **BROKEN IN UI** (404)     |
| **Job Proposals / Bids** | `GET /api/v1/applications/job/:id` (`features/proposals/hooks.ts:10`)      | `GET /api/v1/jobs/:jobId/applications` (`lib/api/applications.ts:45`) | `GET /api/v1/jobs/:jobId/applications` (`job.routes.ts:86`)         | ❌ **BROKEN IN UI** (404)     |
| **Submit Bid**           | `POST /api/v1/applications` (`features/proposals/hooks.ts:20`)             | `POST /api/v1/jobs/:jobId/apply` (`lib/api/applications.ts:25`)       | `POST /api/v1/jobs/:jobId/apply` (`job.routes.ts:77`)               | ❌ **BROKEN IN UI** (404)     |
| **Accept Bid**           | `PATCH /api/v1/applications/:id/accept` (`features/proposals/hooks.ts:43`) | `POST /api/v1/applications/:id/accept` (`lib/api/applications.ts:56`) | `POST /api/v1/applications/:id/accept` (`application.routes.ts:17`) | ❌ **BROKEN IN UI** (404/405) |
| **Reject Bid**           | _Not implemented in `src/features`_                                        | `POST /api/v1/applications/:id/reject` (`lib/api/applications.ts:66`) | `POST /api/v1/applications/:id/reject` (`application.routes.ts:25`) | ⚠️ Missing in UI              |
| **Direct Booking**       | _Not implemented in `src/features`_                                        | `POST /api/v1/jobs/direct` (`lib/api/jobs.ts:52`)                     | `POST /api/v1/jobs/direct` (`job.routes.ts:36`)                     | ⚠️ Modal redirects to 404     |
| **Direct Respond**       | _Not implemented in `src/features`_                                        | `PATCH /api/v1/jobs/:id/direct-respond` (`lib/api/jobs.ts:64`)        | `PATCH /api/v1/jobs/:id/direct-respond` (`job.routes.ts:60`)        | ✅ Correct in `lib/api`       |
| **Job Status Patch**     | _Not implemented in `src/features`_                                        | `PATCH /api/v1/jobs/:id/status` (`lib/api/jobs.ts:78`)                | `PATCH /api/v1/jobs/:id/status` (`job.routes.ts:69`)                | ⚠️ Missing UI trigger         |

---

### 2.3 Casing & Field Schema Mismatches

#### 1. Job Creation Budget

- **Frontend Form (`JobForm.tsx:18-20` & `features/jobs/types.ts:22`):**
  ```typescript
  budget: z.string().regex(/^\d+(\.\d{1,2})?$/); // Sent as "500.00" (string)
  ```
- **Backend Zod Schema (`backend/src/dtos/job.dto.ts:8`):**
  ```typescript
  budget: z.number().positive("Budget must be a positive number");
  ```
- **Failure Mode:** Backend rejects form submission with `400 Bad Request`: `budget: Expected number, received string`.

#### 2. Auth `getMe` Initialization

- **Backend Controller (`backend/src/controllers/auth.controller.ts:16`):**
  Returns `{ success: true, data: UserPublicDto }` (User object is directly in `data`).
- **Frontend Auth Service (`web-frontend/src/lib/api/auth.ts:4-11`):**
  ```typescript
  export interface GetMeResponse {
    user: UserProfile;
  }
  return await apiClient.get<GetMeResponse>("/api/v1/auth/me");
  ```
- **Frontend Provider (`web-frontend/src/providers/AuthProvider.tsx:20`):**
  ```typescript
  const response = await authApi.getMe();
  setUser(response.user); // response is ALREADY the user object -> response.user is undefined!
  ```
- **Failure Mode:** `setUser(undefined)` clears user state on every page load, breaking authentication.

#### 3. Accept Application Response Envelope

- **Frontend Type (`web-frontend/src/types/applications.ts:24-30`):**
  ```typescript
  export interface AcceptApplicationResponse {
    message: string;
    jobId: string;
    assignedWorkerId: string;
    agreedBudget: string | number;
    status: string;
  }
  ```
- **Backend Service Return (`backend/src/services/application.service.ts:221`):**
  ```typescript
  return { application: acceptedApp, job: updatedJob };
  ```

#### 4. Worker & Customer Profile Casing

- **Backend Models:** Uses camelCase fields (`paymentRate`, `ratingAvg`, `experienceYears`, `profilePhoto`, `issuedDate`, `imageUrl`, `fileUrl`).
- **Frontend Types (`web-frontend/src/types/worker.ts:40-64`):**
  Defines snake_case fields (`experience_years`, `payment_rate`, `rating_avg`, `profile_photo`).
- **Frontend UI Components (`PublicWorkerProfilePage:353, 455`):**
  Reads `profile.payment_rate` (which is `undefined` because backend returns `paymentRate`), resulting in fallback values or empty prices.

#### 5. Review Objects

- **Backend (`backend/src/services/review.service.ts:193-206`):**
  - `getWorkerReviews` returns: `customer: { name: string, avatar: null }`, `job: { title: string, category: string }`.
  - `getCustomerReviews` returns: `worker: { id: string, user: { name: string } }`, `job: { id: string, title: string }`.
- **Frontend Types (`web-frontend/src/types/worker.ts:90-110`):**
  Expects `customer: { id, name, avatarUrl }` and `job: { id, title, category: { id, name } }`.

---

## 3. Feature Completeness & Gap Analysis

```
┌────────────────────────────────────────────────────────────────────────┐
│                    CUSTOMER PORTAL FEATURE MATRIX                      │
├────────────────────────────────┬────────────┬─────────────┬────────────┤
│ Feature                        │ Backend    │ Frontend API│ Frontend UI│
├────────────────────────────────┼────────────┼─────────────┼────────────┤
│ Customer Dashboard             │ ✅ Ready   │ ⚠️ Broken   │ ⚠️ Partial │
│ Create Marketplace Job         │ ✅ Ready   │ ⚠️ Broken   │ ⚠️ Partial │
│ Create Direct Booking          │ ✅ Ready   │ ✅ Ready    │ ❌ Missing │
│ View My Jobs Listing Page      │ ✅ Ready   │ ✅ Ready    │ ❌ Missing │
│ Job Detail & Application List  │ ✅ Ready   │ ⚠️ Broken   │ ⚠️ Partial │
│ Accept Worker Bid              │ ✅ Ready   │ ⚠️ Broken   │ ⚠️ Partial │
│ Reject Worker Bid              │ ✅ Ready   │ ✅ Ready    │ ❌ Missing │
│ Cancel / Complete Job Status   │ ✅ Ready   │ ✅ Ready    │ ❌ Missing │
│ Search & Filter Workers        │ ✅ Ready   │ ❌ Missing  │ ❌ Missing │
│ Public Worker Profile & Review │ ✅ Ready   │ ✅ Ready    │ ✅ Ready   │
│ Submit Job Review (1-5 Stars)  │ ✅ Ready   │ ❌ Missing  │ ❌ Missing │
│ Customer Profile & History     │ ✅ Ready   │ ❌ Missing  │ ❌ Missing │
│ Chapa Escrow Checkout Trigger  │ ✅ Ready   │ ❌ Missing  │ ❌ Missing │
└────────────────────────────────┴────────────┴─────────────┴────────────┘
```

### 3.1 Job Creation & Posting

- **Current State:** `src/app/(dashboard)/customer/jobs/new/page.tsx` renders `JobForm.tsx`.
- **Gaps:**
  1. `JobForm.tsx` sends string `budget` rather than integer/float.
  2. `useCreateJob` imports from `@/features/jobs/hooks` instead of `@/hooks/useJobs`.
  3. No location or sub-category selection fields are provided.
  4. No feedback redirect with toast notification upon successful job creation.

### 3.2 Customer Dashboard & My Jobs List

- **Current State:** `src/app/(dashboard)/customer/dashboard/page.tsx` renders recent jobs via `RecentJobs`.
- **Gaps:**
  1. Calls broken hook `useCustomerJobs` (which requests `/api/v1/jobs/customer/jobs`).
  2. No dedicated `/customer/jobs/page.tsx` exists. When a user clicks "My Jobs" in the sidebar, Next.js renders a 404 page.
  3. No distinction between `POSTING` marketplace jobs vs `DIRECT` booking jobs.
  4. No status filter tabs (All, Open, In Progress, Completed, Cancelled).

### 3.3 Worker Applications / Proposal Review

- **Current State:** `src/app/(dashboard)/customer/jobs/[id]/page.tsx` displays job details and proposal cards.
- **Gaps:**
  1. Uses `useJobProposals(id)` which hits nonexistent `/api/v1/applications/job/:id`. Must be switched to `useJobApplications(id)` from `src/hooks/useApplications.ts`.
  2. Bid acceptance calls `PATCH` instead of `POST /api/v1/applications/:id/accept`.
  3. No "Reject Bid" button exists on proposals.
  4. When an application is accepted and the job transitions to `IN_PROGRESS`, there is no trigger to launch the Chapa checkout flow (`POST /api/v1/payments/checkout`).

### 3.4 Direct Worker Booking Flow

- **Backend Capability:** `POST /api/v1/jobs/direct` accepts `{ targetWorkerId, categoryId, title, description, budget }` and creates a `PENDING` job assigned to that worker.
- **Current State:** On `PublicWorkerProfilePage` (`/worker/[id]`), clicking "Hire" opens a modal whose "Proceed to Booking" button executes `router.push('/dashboard')` (which 404s).
- **Gaps:**
  1. No Direct Booking modal form exists to capture category, title, description, and budget.
  2. No direct booking integration with `jobsApi.createDirectJob()`.
  3. Direct requests are not highlighted on the customer dashboard.

### 3.5 Worker Search & Discovery for Customers

- **Backend Capability:** `GET /api/v1/search/providers` and `GET /api/v1/workers` support searching by keyword, category UUID, minimum rating, budget rate min/max, and sorting by rating/rate/jobs.
- **Current State:** The customer sidebar has a "Find Workers" link (`/customer/workers`) which returns a 404.
- **Gaps:**
  1. `src/lib/api/workers.ts` lacks a `searchProviders(params)` / `getWorkers(params)` query method.
  2. No `/customer/workers/page.tsx` search UI exists (search input, category filters, rate slider, worker cards with ratings).

### 3.6 Reviews & Ratings

- **Backend Capability:** Bidirectional reviews for `COMPLETED` jobs via `POST /api/v1/reviews` with `{ jobId, rating (1-5), comment }`, `PUT /api/v1/reviews/:id`, and `GET /api/v1/reviews/my`.
- **Current State:** Zero review submission hooks, forms, or modals exist in `web-frontend`.
- **Gaps:**
  1. No `src/lib/api/reviews.ts` or `src/hooks/useReviews.ts`.
  2. No "Leave a Review" modal when a customer marks a job as `COMPLETED` or visits a completed job's detail page.
  3. No customer reviews display tab on the profile page.

### 3.7 Customer Profile & Dashboard Layout

- **Current State:**
  1. `src/app/(dashboard)/layout.tsx` hardcodes mock user `{ name: "Sarah Customer", role: "CUSTOMER" }`.
  2. `/customer/profile` and `/customer/settings` routes are missing.
- **Gaps:**
  1. `DashboardLayout` must consume dynamic authenticated user data from `useAuthStore`.
  2. A dedicated `/customer/profile/page.tsx` is required to display customer details, average rating (as a client), and job history.

---

## 4. Phased Action Plan for Incremental Implementation

To maintain strict stability and support atomic pull requests, the remediation and feature completion should be executed across 5 focused, sequential phases.

```
┌────────────────────────────────────────────────────────────────────────┐
│                       INCREMENTAL ROADMAP                              │
├─────────┬──────────────────────────────────────────────────────────────┤
│ Phase 1 │ Core API, Envelope Alignment & Auth Normalization            │
│ Phase 2 │ Unified Job Management & Bids Review (Customer Portal)       │
│ Phase 3 │ Worker Discovery & Direct Booking Flow                       │
│ Phase 4 │ Bidirectional Reviews & Completed Job Lifecycle              │
│ Phase 5 │ Customer Profile, Layout Integration & Route Protection      │
└─────────┴──────────────────────────────────────────────────────────────┘
```

---

### Phase 1: Core API, Envelope Alignment & Auth Normalization

**Objective:** Resolve all network layer defects, response envelope parsing issues, duplicate client divergence, and auth store initialization.

1. **API Client & Envelope Rectification (`src/lib/api.ts` & `src/types/api.ts`):**
   - Update `ApiErrorResponse` type to reflect the structured backend error object `{ code, message, fields }`.
   - Update `axiosInstance` response interceptor to extract `error.response?.data?.error?.message || error.message` so user-facing errors are clear strings.
   - Add support for un-enveloped arrays or custom envelopes (e.g. `jobs` / `data` / `meta` sibling structures) without dropping pagination metadata.
2. **Auth API & Provider Fix (`src/lib/api/auth.ts`, `src/providers/AuthProvider.tsx`, `src/stores/authStore.ts`):**
   - Fix `authApi.getMe` return type to return `UserProfile` directly.
   - Fix `AuthProvider.tsx` to call `setUser(response)` directly.
   - Update `UserProfile` type to match backend `UserPublicDto` (`lastActiveRole`, `customerProfile`, `worker`).
3. **Deprecate & Remove Conflicting Feature APIs:**
   - Consolidate `src/features/jobs/` and `src/features/proposals/` into `src/lib/api/jobs.ts`, `src/lib/api/applications.ts`, `src/hooks/useJobs.ts`, and `src/hooks/useApplications.ts`.
   - Delete redundant/broken query hooks in `src/features/*`.
4. **Unit Verification:**
   - Run existing API tests and ensure all mock expectations match exact backend contracts.

---

### Phase 2: Unified Job Management & Bids Review (Customer Portal)

**Objective:** Enable flawless marketplace job creation, customer dashboard job list, "My Jobs" page, and proposal acceptance/rejection.

1. **Job Form Schema & Submission (`src/components/features/jobs/JobForm.tsx`):**
   - Update Zod validation schema to transform/coerce `budget` to a positive number: `z.coerce.number().positive()`.
   - Switch hook import to `useCreateJob` from `@/hooks/useJobs`.
   - Add toast notifications on success and redirect to `/customer/jobs`.
2. **Customer Dashboard Page (`src/app/(dashboard)/customer/dashboard/page.tsx`):**
   - Switch from `useCustomerJobs` (which hits a 404) to `useJobs({ ... })` or a dedicated `useCustomerJobs` query wrapper calling `GET /api/v1/jobs/my`.
   - Display active jobs with source tags (`Marketplace` vs `Direct Request`).
3. **Create Dedicated "My Jobs" Page (`src/app/(dashboard)/customer/jobs/page.tsx`):**
   - Build the missing page for the sidebar navigation `/customer/jobs`.
   - Implement status filtering tabs (`All`, `Open`, `In Progress`, `Completed`, `Direct Requests`).
   - Render `JobCard` list with applicant count, budget, and quick actions.
4. **Customer Job Details & Proposals (`src/app/(dashboard)/customer/jobs/[id]/page.tsx`):**
   - Replace proposal hooks with `useJobApplications(jobId)` and `useAcceptApplication(jobId)` from `@/hooks/useApplications`.
   - Add "Reject Proposal" action button with confirmation dialog via `useRejectApplication(jobId)`.
   - Add Job Status Actions: "Cancel Job" (`PATCH /api/v1/jobs/:id/status` with `CANCELLED`) and "Mark as Completed" (`COMPLETED`).
   - Add empty state when no proposals have been submitted yet.

---

### Phase 3: Worker Discovery & Direct Booking Flow

**Objective:** Allow customers to browse/filter verified workers and initiate direct service requests.

1. **Worker Search API & Hooks (`src/lib/api/workers.ts` & `src/hooks/useWorker.ts`):**
   - Add `workersApi.searchWorkers(params: WorkerQueryDto): Promise<{ workers: WorkerProfile[]; meta: PaginationMeta }>` hitting `GET /api/v1/search/providers`.
   - Add `useSearchWorkers(params)` hook supporting pagination, category filtering, search keywords, and rate range.
2. **Customer Worker Discovery Page (`src/app/(dashboard)/customer/workers/page.tsx`):**
   - Build the missing `/customer/workers` page.
   - Include category filter bar, search input, sort selector (`Rating`, `Hourly Rate`, `Experience`), and paginated grid of worker cards.
   - Add direct "Book Now" and "View Profile" actions on each worker card.
3. **Direct Booking Modal (`src/components/features/worker/DirectBookingModal.tsx`):**
   - Build a comprehensive modal form on `PublicWorkerProfilePage` (`/worker/[id]`) and `/customer/workers`.
   - Form fields: Category picker (pre-selected to worker's services), Job Title, Detailed Description, Proposed Budget/Hourly Total.
   - Connect to `jobsApi.createDirectJob` via `useCreateDirectJob()`.
   - On success, navigate customer to the newly created direct job details page.

---

### Phase 4: Bidirectional Reviews & Completed Job Lifecycle

**Objective:** Deliver complete review & rating capabilities for customers on completed contracts.

1. **Review API & Hooks Layer (`src/lib/api/reviews.ts` & `src/hooks/useReviews.ts`):**
   - Create `reviewsApi` supporting:
     - `createReview(payload: { jobId: string; rating: number; comment?: string })`: `POST /api/v1/reviews`
     - `getMyReviews()`: `GET /api/v1/reviews/my`
     - `getWorkerReviews(workerId, params)`: `GET /api/v1/workers/:id/reviews`
     - `getCustomerReviews(customerId, params)`: `GET /api/v1/customers/:id/reviews`
     - `updateReview(reviewId, payload)`: `PUT /api/v1/reviews/:id`
     - `deleteReview(reviewId)`: `DELETE /api/v1/reviews/:id`
   - Create corresponding React Query hooks (`useCreateReview`, `useMyReviews`, `useCustomerReviews`).
2. **Review Submission Modal (`src/components/features/reviews/ReviewModal.tsx`):**
   - Interactive 1-5 star selector, optional text commentary textarea, and submit button.
   - Automatic trigger upon clicking "Mark as Completed" or when viewing a `COMPLETED` job that has not yet been reviewed by the customer.
3. **Job Detail Review Banner (`src/app/(dashboard)/customer/jobs/[id]/page.tsx`):**
   - Display submitted review details or prompt the customer to review the completed contract.

---

### Phase 5: Customer Profile, Layout Integration & Route Protection

**Objective:** Connect real authentication data to layout headers/sidebars, implement customer profile page, and enforce Edge middleware protection.

1. **Dynamic Layout & Navigation (`src/app/(dashboard)/layout.tsx`, `Header.tsx`, `Sidebar.tsx`):**
   - Remove hardcoded mock customer (`"Sarah Customer"`).
   - Integrate `useAuthStore` to populate dynamic user name, avatar, and active role in `Header.tsx` and `Sidebar.tsx`.
   - Implement real "Log Out" handlers calling `authApi.logout()` and clearing client state.
2. **Customer Profile Page (`src/app/(dashboard)/customer/profile/page.tsx`):**
   - Build the missing `/customer/profile` page.
   - Display account info, joined date, customer reputation/rating average (from backend `CustomerProfile.ratingAvg`), and recent service activity history.
   - Display customer reviews received from service providers (`GET /api/v1/customers/:id/reviews`).
3. **Edge Middleware & Cookie Alignment (`src/middleware.ts`):**
   - Add `"access_token"` to the extracted cookie list in `extractAuth()`.
   - Extend `config.matcher` to include `"/customer/:path*"`.
   - Ensure unauthenticated visits to `/customer/*` redirect to `/login?returnUrl=...`.
4. **End-to-End Regression Verification:**
   - Run Vitest test suite (`pnpm test` / `npm test`).
   - Perform end-to-end user journey check: Post Marketplace Job ➔ Receive Bid ➔ Accept Bid ➔ Mark Completed ➔ Leave 5-Star Review.

---

## 5. Verification Checklist

- [ ] `JobForm` submits `budget` as numeric value without Zod validation failure.
- [ ] Customer Dashboard renders active jobs without throwing 404 network errors.
- [ ] Clicking "My Jobs" in the sidebar navigates to `/customer/jobs` without 404.
- [ ] Customer Job Detail page fetches proposals via `GET /api/v1/jobs/:id/applications`.
- [ ] Bid Acceptance sends `POST /api/v1/applications/:id/accept` and correctly updates job state to `IN_PROGRESS`.
- [ ] Worker Search page at `/customer/workers` allows searching and filtering service providers.
- [ ] Direct Booking modal on `/worker/[id]` submits `POST /api/v1/jobs/direct` and creates a `PENDING` direct job.
- [ ] Completed jobs display a review prompt and successfully submit `POST /api/v1/reviews`.
- [ ] Auth state persists accurately without `response.user` resolving to `undefined`.
- [ ] No modifications made to `backend/` files.
