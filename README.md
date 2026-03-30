🎵 Music Stream & Admin Platform

A modern, React-based music streaming platform built on the decentralized Swarm network. This project prioritizes security (Passkey), modularity, and high test coverage.

🌟 Key Features

🎧 User Experience

Advanced Playbar: Full playback control (Play/Pause, volume, seeking), playlist management, and real-time audio synchronization.

Discovery: Dynamic search across the library with category-based filtering.

Personalization: "Saved Songs" favorites management and a "Recently Played" history.

Account Management: Profile avatar uploads, Wallet integration, and secure Passkey (WebAuthn) authentication.

🛡 Administration

Pro Dashboard: Comprehensive statistics and system overview.

Content Management: Full CRUD operations for tracks, featuring an integrated audio dropzone and cover art processing.

User Management: Centralized administration of user data, roles, and permissions.

🌐 Infrastructure

Decentralized Storage: Direct integration with Swarm (Bee) for resilient media hosting.

Internationalization (i18n): Multi-language support across the UI, admin panels, and system feedback.

Resilience: Robust Error Boundary implementation to ensure a stable runtime environment.

🏗 Project Architecture

The source code is organized within the src directory using a modular, domain-driven approach:

components/: Atomic UI components (Admin modules, Playbar, UI primitives, Modals).

pages/: Route-level views (Home, Admin Dashboard, Profile, SongPage).

hooks/: Encapsulated business logic (e.g., usePlayback, useAdminAuth, useUploadSong).

context/: Global state management providers (Auth, Music, Notification, Loading).

i18n/: Structured translation assets (UI, Feedback, Modals).

swarm-gateway/: Low-level communication layer for the Swarm network.

styles/: Global SCSS architecture and design tokens (_variables.scss).

types/: Centralized TypeScript interfaces and type definitions.

🛠 Tech Stack

Core: React (TypeScript)

Styling: SASS/SCSS (Modular architecture)

State: React Context API

Testing: Vitest (Component and Hook level coverage)

Auth: Passkey (WebAuthn) & Custom Auth Context

Storage: Swarm (Bee Gateway)

Icons: Lucide-integrated solutions

🚀 Getting Started

Prerequisites

Node.js (v18+)

npm or yarn

Access to a Swarm Gateway (optional for local mock development)

Installation

Clone the repository:

git clone <repository-url>
cd music-platform


Install dependencies:

npm install


Launch development server:

npm run dev


Run test suite:

npm run test


🧪 Testing Conventions

This project follows a "colocation" strategy for testing. .test.tsx and .test.ts files are located directly alongside the components or hooks they verify.

# Run a specific test file
npm run test -- hooks/audio/usePlayback.test.ts


🌍 Internationalization (i18n)

Translations are managed within src/i18n, segmented by functional area (UI, Modals, Admin). To add a new language, ensure all sub-modules within this directory are updated to maintain UI consistency.