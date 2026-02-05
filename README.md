# Dr. Kamran Akram — Portfolio Website

A modern, high-performance portfolio and consultancy site built with Next.js (App Router), Supabase, and Tailwind CSS.
Includes a Gallery system with Admin CRUD, Calendly integration, and secure admin authentication.

## Work Structure
- `src/app`: App Router routes, API handlers, and page layouts (including `admin`, `gallery`, `consulting`, `projects`, and more).
- `src/components`: Reusable UI and page sections (admin, forms, layout, loaders, providers, resume, sections, ui).
- `src/lib`: Shared utilities and services (Supabase clients, auth helpers, email, and common utilities).
- `src/data`: Static content and navigation data.
- `src/types`: Shared TypeScript types.
- `public`: Static assets.
- `supabase-schema.sql`: Database schema reference.

## Technologies
- Framework: Next.js 16 (App Router), React 19, TypeScript
- Styling: Tailwind CSS v4, tw-animate-css, styled-components
- UI/UX: Radix UI, Framer Motion, Motion One, GSAP, Lenis
- 3D/Media: Three.js, @react-three/fiber, Spline, Lottie
- Forms/Date: React Hook Form, React Day Picker, React Datepicker, date-fns
- Auth/DB/Storage: Supabase (Auth, Database, Storage, RLS)
- Email: Nodemailer
- Utilities: clsx, class-variance-authority, tailwind-merge

## Integrations
- Calendly (consultation booking)
- Supabase Storage (gallery images)
