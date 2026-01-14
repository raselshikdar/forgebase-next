-- Seed sample projects
INSERT INTO projects (title, slug, description, content, tech_stack, live_url, github_url, featured, display_order)
VALUES
  (
    'E-Commerce Platform',
    'e-commerce-platform',
    'A full-featured e-commerce platform built with Next.js and Stripe integration.',
    'This project showcases a complete e-commerce solution with product management, shopping cart, checkout flow, and payment processing using Stripe. Built with performance and scalability in mind.',
    ARRAY['Next.js', 'TypeScript', 'Tailwind CSS', 'Stripe', 'Supabase'],
    'https://demo.example.com',
    'https://github.com/example/ecommerce',
    true,
    1
  ),
  (
    'Task Management App',
    'task-management-app',
    'A beautiful task management application with real-time collaboration features.',
    'Real-time collaborative task management with drag-and-drop, team workspaces, and productivity analytics. Features a clean, intuitive interface designed for productivity.',
    ARRAY['React', 'Node.js', 'Socket.io', 'PostgreSQL', 'Redis'],
    'https://tasks.example.com',
    'https://github.com/example/tasks',
    true,
    2
  ),
  (
    'AI Content Generator',
    'ai-content-generator',
    'An AI-powered content generation tool using OpenAI GPT models.',
    'Leverages the latest AI models to generate high-quality content for blogs, social media, and marketing materials. Includes templates, tone adjustment, and content optimization.',
    ARRAY['Next.js', 'OpenAI API', 'Vercel AI SDK', 'Tailwind CSS'],
    'https://ai.example.com',
    'https://github.com/example/ai-content',
    true,
    3
  ),
  (
    'Portfolio Website',
    'portfolio-website',
    'A modern personal portfolio website with blog and store functionality.',
    'This very website you are viewing! Built with Next.js, Supabase, and Tailwind CSS. Features dark mode, blog system with comments, and product store.',
    ARRAY['Next.js', 'Supabase', 'Tailwind CSS', 'Waline'],
    'https://portfolio.example.com',
    'https://github.com/example/portfolio',
    false,
    4
  );

-- Seed sample blog posts
INSERT INTO blogs (title, slug, excerpt, content, published, cover_image)
VALUES
  (
    'Building Modern Web Applications with Next.js 16',
    'building-modern-web-applications-nextjs-16',
    'Explore the latest features in Next.js 16 and how to leverage them for building performant web applications.',
    '## Introduction

Next.js 16 brings exciting new features that revolutionize how we build web applications. In this comprehensive guide, we will explore the key improvements and how to implement them effectively.

## Key Features

### Turbopack as Default
Turbopack is now the default bundler, offering significantly faster build times and hot module replacement.

### React Compiler Support
The stable React Compiler support means better performance out of the box with automatic optimizations.

### Improved Caching APIs
New caching APIs like `revalidateTag()` with cacheLife profiles and `updateTag()` provide more granular control over data freshness.

## Getting Started

To start using Next.js 16, create a new project or upgrade your existing one:

```bash
npx create-next-app@latest my-app
