<a href="https://vercel.com/oss">
  <img alt="Vercel OSS Program" src="https://vercel.com/oss/program-badge.svg" />
</a>

# Invoicely

> [!CAUTION]
> This project has been greatly simplifed from the original repository for local use. Authentication is omitted, databases and file storage run locally in Docker containers.
> The original repository is available [here](https://github.com/legions-developer/invoicely).

## 🚀 Quick Start

### Prerequisites

#### Development
- **Node.js**: Version 20 or higher
- **Yarn**: Version 4.9.1 or higher (automatically managed via `packageManager` field)
- **PostgreSQL**: Database for storing application data

#### Production

* **Docker**: version 27.3.1 or higher

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/alphatrann/invoicely.git
   cd invoicely
   ```

#### Development
1. **Install dependencies**

   ```bash
   yarn install
   ```

2. **Set up environment variables**

   ```bash
   # Create symlinks for environment variables across apps
   yarn sys-link
   ```

3. **Set up the database**

   ```bash
   # Generate database schema
   yarn db:generate

   # Run database migrations
   yarn db:migrate
   ```

4. **Start development server**
   ```bash
   yarn dev
   ```

#### Production
Simply run:
```bash
docker compose up -d
```

This will automatically build images and spin up containers: storage (MinIO), database (Postgres), frontend and reverse proxy (Caddy)

## 🛠️ Tech Stack

### Core Framework

- **Next.js 15.3.1** - React framework with App Router
- **React 19** - UI library
- **TypeScript 5.8.2** - Type-safe JavaScript

### API & State Management

- **tRPC 11.1.2** - End-to-end type-safe APIs
- **TanStack Query 5.76.1** - Server state management
- **Jotai 2.12.3** - Atomic state management
- **Zod 3.25.7** - Schema validation

### UI & Styling

- **Tailwind CSS 4** - Utility-first CSS framework
- **Radix UI** - Headless UI components
- **Shadcn/ui** - Re-usable components built on Radix
- **Lucide React** - Icon library
- **Motion 12.10.5** - Animation library
- **Next Themes** - Theme management

### Database

- **Drizzle ORM 0.43.1** - Type-safe database ORM
- **PostgreSQL**

### File Storage & PDF

- **Cloudflare R2** - Object storage
- **React PDF 9.2.1** - PDF generation

### Development Tools

- **Turbo 2.5.3** - Monorepo build system
- **ESLint 9** - Code linting
- **Prettier 3.5.3** - Code formatting
- **Husky 9.1.7** - Git hooks

### Analytics & Monitoring

- **React Scan** - Performance debugging

### Utilities

- **Date-fns 4.1.0** - Date manipulation
- **Lodash 4.17.21** - Utility functions
- **Decimal.js 10.5.0** - Arbitrary precision decimal arithmetic
- **UUID 11.1.0** - Unique identifier generation

## 📁 Project Structure

```
invoicely
│ .dockerignore
│ .env
│ .prettierrc
│ .yarnrc.yml
│ Caddyfile
│ compose.yml
│ Dockerfile
│ drizzle.config.ts
│ env-links.sh
│ LICENSE
│ package.json
│ README.md
│ turbo.json
│ yarn.lock
├───apps
│   └──web
│      ├──public
│      └──src
│         ├──app
│         ├──assets
│         ├──components
│         ├──constants
│         ├──global
│         ├──hooks
│         ├──lib
│         ├──trpc
│         ├──types
│         └──zod-schemas
└──packages
   ├──db
   ├──eslint-config
   ├──typescript-config
   └──utilities
```


## 🔧 Environment Variables

Create a `.env` file in the root directory with the following variables:

```bash
# Database
POSTGRES_USER=root
POSTGRES_PASSWORD=password
POSTGRES_DB=invoicely

DATABASE_URL="postgres://${POSTGRES_USER}:${POSTGRES_PASSWORD}@postgres:5432/${POSTGRES_DB}"

# Public URLs
NEXT_PUBLIC_BASE_URL="http://localhost"
NEXT_PUBLIC_TRPC_BASE_URL="http://localhost/api/trpc"

MINIO_ROOT_USER=minio
MINIO_ROOT_PASSWORD=minio123
MINIO_BUCKET_NAME="invoicely"
NEXT_PUBLIC_MINIO_PUBLIC_DOMAIN="http://localhost:9000/invoicely"
MINIO_ENDPOINT="http://minio:9000"
MINIO_ACCESS_KEY_ID="${MINIO_ROOT_USER}"
MINIO_SECRET_ACCESS_KEY="${MINIO_ROOT_PASSWORD}"
```

### Environment Management

The project uses a symlink-based approach for environment management:

- Run `yarn sys-link` to create symlinks from the root `.env` file to all apps
- This ensures consistent environment variables across the monorepo
- Environment variables are validated using `@t3-oss/env-nextjs` and Zod

## 📜 Available Scripts

### Root Level Scripts

```bash
yarn dev              # Start development servers for all apps
yarn build            # Build all apps for production
yarn start            # Start production servers
yarn lint             # Lint all packages
yarn lint:fix         # Fix linting issues
yarn format           # Format code with Prettier
yarn check-types      # Type check all packages

# Database Operations
yarn db:generate      # Generate database schema
yarn db:migrate       # Run database migrations
yarn db:push          # Push schema changes to database
yarn db:studio        # Open Drizzle Studio

# Utility Scripts
yarn sys-link         # Create environment symlinks
yarn reset-repo       # Clean all build artifacts
```

### App-Specific Scripts (apps/web)

```bash
yarn dev              # Start Next.js development server
yarn build            # Build for production
yarn start            # Start production server
yarn lint             # Lint the web app
```

## 🎯 Naming Conventions

### Files and Directories

- **Directories**: Use lowercase with dashes (e.g., `components/auth-wizard`)
- **Components**: Use PascalCase for component files (e.g., `UserProfile.tsx`)
- **Client Components**: Add `.client.tsx` suffix for components using `"use client"`
- **Utilities**: Use camelCase for utility files (e.g., `formatCurrency.ts`)

### Variables and Functions

- **Variables**: Use camelCase (e.g., `userName`, `isLoading`, `hasError`)
- **Constants**: Use SCREAMING_SNAKE_CASE (e.g., `R2_PUBLIC_URL`, `TOAST_OPTIONS`)
- **Functions**: Use camelCase with descriptive verbs (e.g., `createInvoice`, `validateEmail`)
- **Booleans**: Prefix with auxiliary verbs (e.g., `isLoading`, `hasPermission`, `canEdit`)

### TypeScript Types

- **Interfaces**: Use PascalCase (e.g., `UserProfile`, `InvoiceData`)
- **Zod Schemas**: Prefix with "Zod" (e.g., `ZodInvoiceSchema`, `ZodUserSchema`)
- **Type Exports**: Use named exports, avoid default exports

### Code Style

- Use the `function` keyword for pure functions
- Prefer named exports over default exports
- Use functional and declarative programming patterns
- Structure files: exported component, subcomponents, helpers, static content, types

## 📚 Libraries and Documentation

### Core Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [React Documentation](https://react.dev)
- [TypeScript Documentation](https://www.typescriptlang.org/docs)

### API & Data Management

- [tRPC Documentation](https://trpc.io/docs)
- [TanStack Query Documentation](https://tanstack.com/query/latest)
- [Jotai Documentation](https://jotai.org)
- [Zod Documentation](https://zod.dev)

### Database & Authentication

- [Drizzle ORM Documentation](https://orm.drizzle.team)
- [PostgreSQL Documentation](https://postgresql.org/docs)

### UI & Styling

- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Radix UI Documentation](https://www.radix-ui.com)
- [Shadcn/ui Documentation](https://ui.shadcn.com)
- [Lucide Icons](https://lucide.dev)

### Development Tools

- [Turbo Documentation](https://turbo.build/repo/docs)
- [ESLint Documentation](https://eslint.org/docs)
- [Prettier Documentation](https://prettier.io/docs)

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.