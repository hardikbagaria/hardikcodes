# Blog System Architecture

## Overview
The blog system is integrated into the main Next.js application but is designed to work with a subdomain redirection strategy for better branding (`blog.hardikcodes.com`).

## Routing & Middleware

### Subdomain Redirection
The `middleware.ts` file handles incoming requests. If a request comes from `blog.hardikcodes.com`, it is transparently rewritten to the `/blog` path of the main application.

- **User visits**: `blog.hardikcodes.com/my-post`
- **Server handles**: `hardikcodes.com/blog/my-post`
- **Browser URL**: Remains `blog.hardikcodes.com/my-post` (or redirects depending on specific logic preferred). *Note: Current implementation performs a redirect to the main domain to consolidate SEO authority.*

### Route Structure
- `/blog`: Main blog listing page.
- `/blog/[slug]`: Individual blog post page.
- `/blog/admin`: Admin dashboard for managing posts.

## Content Management (Admin Panel)

The Admin Panel provides an interface to:
1. **Create Posts**: Rich text editing for new articles.
2. **Edit Posts**: Update existing content.
3. **Manage Status**: Publish or Draft posts.

### Access Control
The admin routes are protected by Supabase Auth. Only the owner (you) can access these routes. Ensure your user ID or email is restricted in the application logic or RLS policies.

## Database Schema (Supabase)

The blog relies on the `posts` table in Supabase.

Key Columns:
- `id`: UUID Primary Key
- `title`: String
- `slug`: String (Unique URL path)
- `content`: Text/HTML/Markdown
- `published`: Boolean
- `created_at`: Timestamp

## Features
- **Markdown Support**: Posts support Markdown formatting.
- **Code Highlighting**: tailored for technical code snippets (Java, Spring Boot).
- **SEO**: Dynamic metadata generation for each post title and description.
