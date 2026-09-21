# Skill Roadmap Tracker

Skill Roadmap Tracker is a passcode-protected learning roadmap for people who want to become stronger web developers and prepare for professional software development work. It turns a broad set of technical skills into an organized checklist that can be reviewed, practiced, and improved over time.

The project is intentionally more than a static list of technologies. It is a foundation for a practical learning system that connects knowledge, practice projects, job-readiness criteria, and consistent progress.

## Purpose

Web development covers a large and constantly changing set of skills. It is easy to collect tutorials without developing a clear learning sequence or knowing what to practice next. This project provides a structured path through the core areas needed to build, test, secure, deploy, and maintain modern web applications.

The roadmap currently covers areas such as:

- Deep JavaScript and TypeScript
- HTML, CSS, React, and Next.js
- Backend development and Node.js
- REST APIs and HTTP
- PostgreSQL and Prisma
- Authentication, authorization, and web security
- Validation, error handling, and testing
- Git, GitHub, Docker, Linux, and VPS administration
- Deployment, production operations, performance, and scalability
- User interface, user experience, and accessibility
- Supporting tools, Golang, and ASP.NET Core
- Professional and interview skills
- Practice projects and job-readiness criteria

Each area is designed to support a progression from fundamentals to practical implementation. The goal is not to finish a checklist as quickly as possible. The goal is to build durable understanding and demonstrate it through real work.

## Vision

This repository is a starting point. It should continue to grow into a greater and more useful platform for learning and professional development.

Future growth can include:

- More detailed explanations for every roadmap item.
- Curated references, examples, and recommended exercises.
- Practice tasks that turn each topic into measurable work.
- Projects that combine several skills into complete applications.
- Progress history, notes, milestones, and personal learning goals.
- Stronger job-readiness assessments and interview preparation.
- Difficulty levels and suggested learning sequences.
- Review reminders that encourage long-term retention.
- Community contributions that improve topics, resources, and projects.
- Better reporting so learners can understand their strengths and gaps.

The roadmap should remain practical, honest, and maintainable. New features should help learners understand what to learn, why it matters, how to practice it, and how to demonstrate the result.

## Current application

The application provides a protected checklist experience backed by the project’s own database schema. Access is controlled through a passcode session system. The application data and session flow are independent from third-party social-login scaffolding.

The current production flow uses:

1. A passcode unlock page.
2. A server-side session for protected access.
3. Roadmap items organized by section and order.
4. Persistent progress stored in PostgreSQL when `DATABASE_URL` is configured.
5. A PGLite fallback for local development and environments without a configured database.
6. Database migrations for the application schema and seeded roadmap content.

## Technology

The project is built with:

- React
- TanStack Start and TanStack Router
- TypeScript
- Vite
- Tailwind CSS
- TanStack Query
- PostgreSQL through `pg`
- PGLite for the local fallback database
- Kysely-compatible SQL patterns
- Vercel and Nitro for production deployment

## Getting started

### Requirements

- Node.js
- npm
- A PostgreSQL database for production-like use
- Bun is also supported by the repository lockfile and Vercel build configuration

### Install dependencies

```bash
npm install
```

### Start the development server

```bash
npm run dev
```

The development server runs on port `8080` by default.

### Configure the database

For local development, the application can use its PGLite fallback without a database connection string. To use PostgreSQL, create a `.env` file or configure the environment in your deployment platform:

```bash
DATABASE_URL=postgresql://user:password@host:5432/database?sslmode=require
```

For Vercel deployments using Supabase, use a Supabase connection-pooler URL rather than a direct database hostname when the deployment environment cannot reach the direct IPv6 endpoint. Keep the connection string private and configure it for the required Vercel environments.

### Run validation

```bash
npm run typecheck
npm test
npm run build
```

The build applies pending production migrations when `DATABASE_URL` is available. Without `DATABASE_URL`, it uses the local PGLite fallback during development and skips the external database migration step during the build.

## Project structure

```text
migrations/       Application schema and seeded roadmap data
public/            Static assets, icons, and web manifest
scripts/           Seed generation, migration, preview, and validation tools
src/components/    Reusable interface components
src/lib/           Database, session, item, and application logic
src/routes/        Application routes, including the unlock route
src/styles.css     Global styles and design tokens
```

## Contributing

Contributions are welcome when they make the roadmap clearer, more practical, or more useful for learners. A good contribution should explain the problem it solves and preserve the roadmap’s learning purpose.

Examples of valuable contributions include improving a topic description, adding a realistic practice project, correcting an ordering issue, improving accessibility, strengthening tests, or making the progress experience easier to understand.

Before opening a pull request:

1. Keep changes focused and explain the reason for the change.
2. Preserve the passcode session flow unless the change specifically concerns access control.
3. Update seed data through the project’s generator when roadmap content changes.
4. Run typechecking, tests, and the production build.
5. Confirm that migrations are safe to apply more than once.
6. Describe any follow-up work that belongs in a future change.

## Long-term goal

The long-term goal is to grow Skill Roadmap Tracker from a useful checklist into a living learning platform. It should help someone move from uncertainty to a clear plan, from a plan to deliberate practice, and from practice to evidence of professional ability.

The project will become greater through steady improvements: better content, better exercises, better feedback, and a better understanding of what learners need to build real confidence. Every feature should support that direction.

## License

No license has been specified yet. Until a license is added, the repository should be treated as source-available for review but not automatically available for unrestricted reuse.

## References

[1]: https://react.dev "React documentation"
[2]: https://tanstack.com/start/latest "TanStack Start documentation"
[3]: https://www.typescriptlang.org/docs/ "TypeScript documentation"
[4]: https://vercel.com/docs "Vercel documentation"
[5]: https://supabase.com/docs "Supabase documentation"