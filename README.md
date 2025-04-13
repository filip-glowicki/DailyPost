# DailyPost

DailyPost is a modern application for creating, editing, and managing posts using advanced AI technology. It streamlines the content creation process by automatically generating high-quality posts with customizable editing options, ensuring a seamless user experience.

## Table of Contents

- [Project Description](#project-description)
- [Tech Stack](#tech-stack)
- [Prerequisites](#prerequisites)
- [Getting Started Locally](#getting-started-locally)
- [Available Scripts](#available-scripts)
- [Project Scope](#project-scope)
- [Project Status](#project-status)
- [License](#license)

## Project Description

DailyPost is designed to simplify the post creation and management workflow by integrating AI-powered content generation with robust editing features. With both automatic and manual modes, users can quickly generate content using LLM's and then refine it as needed. The platform emphasizes secure authentication, intuitive categorization.

## Tech Stack

- **Frontend:** Next.js 15, React 19, TypeScript 5, Tailwind CSS 4, Shadcn/ui
- **Backend:** Supabase (PostgreSQL, Authentication, Backend-as-a-Service)
- **AI Integration:** OpenRouter.ai (utilizing GPT-4o mini for content generation)
- **CI/CD & Deployment:** GitHub Actions, Coolify

## Prerequisites

Before you begin, ensure you have the following installed:

- **Docker Desktop**: Required for running Supabase locally
  - [Install Docker Desktop for Mac](https://docs.docker.com/desktop/setup/install/mac-install/)
  - [Install Docker Desktop for other platforms](https://docs.docker.com/desktop/install/linux-install/)
- **Supabase CLI**: Required for local development and database migrations
  - [Install Supabase CLI](https://supabase.com/docs/guides/local-development/cli/getting-started)
- **Node.js**: Version v23.11.0 (see .nvmrc)

## Getting Started Locally

1. **Clone the repository:**
   ```bash
   git clone <repository_url>
   cd daily-post
   ```
2. **Ensure you are using the correct Node version:**
   - The project requires Node version listed in the `.nvmrc` (v23.11.0).
   - If you use [nvm](https://github.com/nvm-sh/nvm), run:
     ```bash
     nvm install
     nvm use
     ```
3. **Install dependencies:**
   ```bash
   pnpm install
   ```
4. **Set up local Supabase:**

   ```bash
   # Initialize Supabase project
   supabase init

   # Apply database migrations
   supabase migration up

   # Start local Supabase instance
   supabase start
   ```

   After starting Supabase locally, you'll receive local credentials. Use these for local development:

   ```bash
   # Example local environment variables (actual values will be shown after supabase start)
   SUPABASE_URL=http://localhost:54321
   SUPABASE_ANON_KEY=your-local-anon-key
   ```

5. **Run the development server:**
   ```bash
   pnpm run dev
   ```
6. **Open your browser** and navigate to [http://localhost:3000](http://localhost:3000) to view the application.

## Available Scripts

- `pnpm run dev` - Starts the application in development mode using Next.js with Turbopack.
- `pnpm run build` - Builds the application for production deployment.
- `pnpm run start` - Runs the production server.
- `pnpm run eslint:fix` - Lints the codebase and automatically fixes issues with ESLint and Prettier.
- `pnpm run prepare` - Sets up Husky for managing Git hooks.
- `pnpm run test:e2e` - Executes end-to-end tests using Playwright.
- `pnpm run test:e2e:ui` - Launches the Playwright test runner with a user interface.

## Project Scope

DailyPost is built with the following key features in mind:

- **Automated Post Generation:** Uses GPT-4o mini via OpenRouter.ai to generate high-quality content automatically.
- **Dual Mode Operation:** Allows users to switch between automatic and manual post creation modes.
- **Post Management:** Supports creating, editing, and deleting posts without maintaining previous versions.
- **Secure Access:** Ensures safe user authentication and authorization via Supabase.
- **Content Sharing:** Generates unique URLs for sharing posts on platforms like X (Twitter) and Facebook.
- **User Notifications:** Provides real-time notifications for character limits and other essential updates.

## Project Status

Currently in the MVP stage and under active development.

## License

This project is licensed under the MIT License.
