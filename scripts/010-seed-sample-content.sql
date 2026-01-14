-- =============================================
-- SEED SAMPLE CONTENT
-- =============================================

-- Insert sample blog post if blogs table is empty
INSERT INTO blogs (title, slug, excerpt, content, published, featured, category, views)
SELECT 
    'Getting Started with Next.js 16',
    'getting-started-with-nextjs-16',
    'Learn how to build modern web applications with Next.js 16, the latest version of the React framework.',
    '# Getting Started with Next.js 16

Next.js 16 brings exciting new features and improvements to the React framework. In this guide, we''ll explore the key updates and how to get started.

## What''s New in Next.js 16

- **Turbopack is now stable** - The new bundler is faster than ever
- **React Compiler Support** - Automatic optimizations for your React code
- **Improved Caching** - Better control over data fetching and caching

## Getting Started

To create a new Next.js 16 project, run:

```bash
npx create-next-app@latest my-app
