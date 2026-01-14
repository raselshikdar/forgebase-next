-- Sample blog posts
INSERT INTO blogs (title, slug, excerpt, content, published, cover_image) VALUES
('Getting Started with Next.js 15', 'getting-started-nextjs-15', 'Learn how to build modern web applications with Next.js 15 and its new features.', '# Getting Started with Next.js 15

Next.js 15 brings exciting new features and improvements...

## Key Features

- Improved performance
- Better caching
- Enhanced developer experience

## Getting Started

First, create a new project...', true, '/placeholder.svg?height=300&width=500'),
('Mastering TypeScript for React', 'mastering-typescript-react', 'A comprehensive guide to using TypeScript effectively in your React applications.', '# Mastering TypeScript for React

TypeScript has become essential for modern React development...', true, '/placeholder.svg?height=300&width=500'),
('Building Accessible Web Applications', 'building-accessible-web-apps', 'Best practices for creating inclusive and accessible web experiences.', '# Building Accessible Web Applications

Accessibility is not optional...', true, '/placeholder.svg?height=300&width=500'),
('The Power of Server Components', 'power-of-server-components', 'Understanding React Server Components and how they change web development.', '# The Power of Server Components

Server Components represent a paradigm shift...', true, '/placeholder.svg?height=300&width=500')
ON CONFLICT (slug) DO NOTHING;

-- Sample projects
INSERT INTO projects (title, slug, description, tech_stack, live_url, github_url, featured, display_order, cover_image) VALUES
('E-Commerce Platform', 'ecommerce-platform', 'A full-featured e-commerce platform with cart, checkout, and payment processing.', ARRAY['Next.js', 'TypeScript', 'Stripe', 'PostgreSQL'], 'https://example.com', 'https://github.com', true, 1, '/placeholder.svg?height=400&width=600'),
('Task Management App', 'task-management-app', 'A collaborative task management application with real-time updates.', ARRAY['React', 'Node.js', 'Socket.io', 'MongoDB'], 'https://example.com', 'https://github.com', true, 2, '/placeholder.svg?height=400&width=600'),
('Portfolio Template', 'portfolio-template', 'A modern, customizable portfolio template for developers and designers.', ARRAY['Next.js', 'Tailwind CSS', 'Framer Motion'], 'https://example.com', 'https://github.com', true, 3, '/placeholder.svg?height=400&width=600'),
('AI Chat Application', 'ai-chat-application', 'An intelligent chatbot powered by OpenAI with context-aware responses.', ARRAY['Next.js', 'OpenAI', 'Vercel AI SDK', 'PostgreSQL'], 'https://example.com', 'https://github.com', true, 4, '/placeholder.svg?height=400&width=600'),
('Blog Platform', 'blog-platform', 'A minimalist blogging platform with markdown support and SEO optimization.', ARRAY['Next.js', 'MDX', 'Prisma', 'PostgreSQL'], 'https://example.com', 'https://github.com', true, 5, '/placeholder.svg?height=400&width=600'),
('Weather Dashboard', 'weather-dashboard', 'A beautiful weather dashboard with forecasts and interactive maps.', ARRAY['React', 'TypeScript', 'OpenWeather API', 'Mapbox'], 'https://example.com', 'https://github.com', true, 6, '/placeholder.svg?height=400&width=600')
ON CONFLICT (slug) DO NOTHING;

-- Sample products
INSERT INTO products (title, slug, description, price, featured, active, cover_image) VALUES
('Next.js Starter Kit', 'nextjs-starter-kit', 'A production-ready Next.js starter with authentication, database, and more.', 49.00, true, true, '/placeholder.svg?height=400&width=400'),
('React Component Library', 'react-component-library', '50+ beautifully designed React components with full TypeScript support.', 79.00, true, true, '/placeholder.svg?height=400&width=400'),
('Full-Stack Course', 'fullstack-course', 'Learn to build production applications from scratch with modern technologies.', 149.00, true, true, '/placeholder.svg?height=400&width=400'),
('UI Design System', 'ui-design-system', 'A comprehensive design system with Figma files and coded components.', 99.00, true, true, '/placeholder.svg?height=400&width=400')
ON CONFLICT (slug) DO NOTHING;

-- Sample blog tags
INSERT INTO blog_tags (blog_id, tag)
SELECT id, 'Next.js' FROM blogs WHERE slug = 'getting-started-nextjs-15'
ON CONFLICT DO NOTHING;

INSERT INTO blog_tags (blog_id, tag)
SELECT id, 'Tutorial' FROM blogs WHERE slug = 'getting-started-nextjs-15'
ON CONFLICT DO NOTHING;

INSERT INTO blog_tags (blog_id, tag)
SELECT id, 'TypeScript' FROM blogs WHERE slug = 'mastering-typescript-react'
ON CONFLICT DO NOTHING;

INSERT INTO blog_tags (blog_id, tag)
SELECT id, 'React' FROM blogs WHERE slug = 'mastering-typescript-react'
ON CONFLICT DO NOTHING;

INSERT INTO blog_tags (blog_id, tag)
SELECT id, 'Accessibility' FROM blogs WHERE slug = 'building-accessible-web-apps'
ON CONFLICT DO NOTHING;

INSERT INTO blog_tags (blog_id, tag)
SELECT id, 'React' FROM blogs WHERE slug = 'power-of-server-components'
ON CONFLICT DO NOTHING;
