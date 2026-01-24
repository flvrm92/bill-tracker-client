# Bill Tracker Client

An Angular single-page application (SPA) for tracking bills, categories, and subcategories against a backend API. It provides authenticated access to manage financial data with a Material-themed UI, navigation, and light/dark theme support.

## Overview

Bill Tracker Client is the frontend for a bill-tracking system. Authenticated users can:

- Sign in and manage their session
- Create, view, update, copy, and delete bills
- Organize bills by categories and subcategories
- Work in a modern Angular Material layout with a responsive navigation menu
- Switch between light and dark themes

The app is built as a modular Angular 20 project, using a clear separation between core, shared, and feature modules.

## Tech Stack

- **Framework:** Angular 20
- **Language:** TypeScript
- **UI Library:** Angular Material (M2)
- **Styling:** SCSS with Tailwind CSS 3
- **Routing:** Angular Router (lazy-loaded feature modules)
- **HTTP & State:** Angular `HttpClient` with RxJS Observables and simple service-based state
- **Auth:** Custom auth module (login, change password), route guards, and JWT-like token handling
- **Notifications:** Angular Material snack-bar + SweetAlert2 dialogs/toasts
- **Build Tooling:** Angular CLI, Webpack (via Angular build system)
- **Testing:** Karma + Jasmine

## Features

### Authentication

- Login page with email/password form and validation
- Change-password page with strong password validation and password confirmation checks
- Session management using `sessionStorage` (token and expiration)
- Auth guard to protect feature routes
- HTTP interceptor to attach auth headers and redirect to login when unauthorized

### Bills

- Bills landing page listing existing bills
- Create and edit bill pages
- Ability to copy an existing bill
- CRUD operations backed by the API (`/bill` endpoints)

### Categories

- Categories landing page
- Create and edit category pages
- List, view, and delete categories
- CRUD operations backed by the API (`/category` endpoints)

### Subcategories

- Subcategories landing page
- Create and edit subcategory pages
- List subcategories, including by category
- CRUD operations backed by the API (`/subcategory` endpoints)

### Layout, Navigation, and Theming

- Configuration-driven navigation (top-level groups such as Home, Financial, Settings)
- Responsive navigation component that highlights the active route and supports nested items
- Light and dark theme support using Angular Material theming and CSS custom properties
- Theme toggle component that persists the selected theme and updates the document body classes
- Global progress indicator driven by an HTTP interceptor

## Getting Started

### Prerequisites

- Node.js (LTS version recommended)
- npm (comes with Node.js)

### Installation

Clone the repository and install dependencies:

```bash
npm install
```

### Running the Development Server

Start the Angular dev server:

```bash
npm start
```

By default, the app runs at:

- `http://localhost:4200/`

The frontend expects a backend API to be available; see **Configuration & Environments** for details.

### Running Tests

Run unit tests with Karma/Jasmine:

```bash
npm test
```

## NPM Scripts

The most relevant scripts in `package.json` are:

- `npm start` – Run the dev server (`ng serve`)
- `npm run build` – Build the application for production (`ng build`)
- `npm run watch` – Build the application in development mode and watch for changes
- `npm test` – Run unit tests with Karma

## Configuration & Environments

### API Base URL

- The API base URL is configured via the Angular environment files.
- Development configuration is defined in `src/environments/environment.ts`.
- Production configuration is defined in `src/environments/environment.production.ts`.
- Services for auth, bills, categories, and subcategories build their HTTP endpoints from this base URL.

Ensure that the appropriate environment file points to your backend API (for example, `http://localhost:5047` in development).

### Authentication State

- Auth state is stored in `sessionStorage` keys (for example, token and expiration).
- An auth state service exposes the current auth status and user token to other parts of the app.
- The auth HTTP interceptor reads this state to attach the authorization header and to decide when to redirect to the login page.

### Theming

- The current theme (light or dark) is persisted (for example, in `localStorage`).
- A theme service manages theme state and applies a corresponding CSS class to the document body.
- Angular Material theming is configured with custom palettes and CSS variables to support the theme toggle.

## Architecture

### Modules

- **App Module** – Root module that wires up routing, core/shared modules, feature modules, theme toggle, and navigation.
- **Core Module** – Infrastructure-level concerns such as HTTP interceptors, theme service, global navigation components, and application-wide providers.
- **Shared Layer** – Reusable services (auth, alerts), utility functions (HTTP error handling, validators), and other cross-cutting logic.
- **Feature Modules** –
	- `auth` – Login and change-password pages and routing
	- `home` – Post-login landing page
	- `bill` – Bill list and bill create/edit pages
	- `category` – Category list and create/edit pages
	- `subCategory` – Subcategory list and create/edit pages

### HTTP & Interceptors

- All API communication goes through Angular `HttpClient` services.
- A progress-bar interceptor toggles a loading indicator for active HTTP requests.
- An auth interceptor attaches auth headers where applicable and handles unauthorized responses by redirecting to the login route.

### Navigation

- Navigation items are defined in a central configuration file.
- A dedicated navigation component renders the menu, manages expanded/collapsed groups, and tracks the active route.

### Theming & Layout

- Custom Material themes and layout styles are defined under `src/themes` and global styles.
- A theme toggle component interacts with the theme service to switch between themes at runtime.

## Design Notes & Further Reading

- The `changes/layout.md` document contains additional design notes about layout, navigation, and theming decisions.

## Future Improvements

Potential areas for enhancement include:

- Adding more detailed dashboards or analytics for bills
- Improving accessibility and internationalization support
- Adding end-to-end tests and additional unit test coverage
- Documenting backend API contracts and error formats in more detail
