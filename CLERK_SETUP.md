# Clerk Authentication Setup Guide

This guide explains how to set up Clerk authentication for your Vite + React + Express application.

## Prerequisites

1. A Clerk account (sign up at https://clerk.com)
2. Your Clerk API keys from the [Clerk Dashboard](https://dashboard.clerk.com/last-active?path=api-keys)

## Setup Steps

### 1. Install Clerk Packages

The required packages have already been installed:
- `@clerk/clerk-react` - For React frontend components
- `@clerk/clerk-sdk-node` - For Express backend authentication

### 2. Configure Environment Variables

Create a `.env.local` file in the root of your project (copy from `.env.example`):

```bash
# Frontend - Use VITE_ prefix for Vite to expose to client
VITE_CLERK_PUBLISHABLE_KEY=YOUR_PUBLISHABLE_KEY

# Backend - Server-side only, never exposed to client
CLERK_SECRET_KEY=YOUR_SECRET_KEY
```

**Important:**
- Replace `YOUR_PUBLISHABLE_KEY` and `YOUR_SECRET_KEY` with your actual keys from the Clerk Dashboard
- The `.env.local` file should be in your `.gitignore` (already configured)
- Never commit real keys to version control

### 3. Frontend Integration

The frontend is already configured:

- **App.tsx**: Wrapped with `<ClerkProvider>` to provide authentication context
- **Sidebar**: Includes `<SignInButton>`, `<SignUpButton>`, and `<UserButton>` components
- **API Client**: Updated to include authentication tokens in requests

### 4. Backend Integration

The backend authentication is configured:

- **server/auth.ts**: Contains `requireAuth` and `optionalAuth` middleware
- **server/routes.ts**: Protected routes use `requireAuth` middleware
- **server/index.ts**: Clerk SDK initialized on server startup

### 5. Using Authentication in Components

To make authenticated API requests, use the `useApiClient` hook:

```typescript
import { useApiClient } from "@/hooks/use-api-client";

function MyComponent() {
  const { apiRequest } = useApiClient();
  
  const handleCreateLink = async () => {
    const response = await apiRequest("POST", "/api/links", {
      targetUrl: "https://example.com",
      title: "Example Link"
    });
    // Handle response...
  };
}
```

Or use Clerk hooks directly:

```typescript
import { useAuth } from "@clerk/clerk-react";

function MyComponent() {
  const { isSignedIn, userId, getToken } = useAuth();
  
  if (!isSignedIn) {
    return <div>Please sign in</div>;
  }
  
  // Use getToken() to get session token for API calls
}
```

### 6. Protected Routes

API routes are protected using the `requireAuth` middleware:

- `/api/links` - All CRUD operations require authentication
- `/api/analytics` - Analytics endpoints require authentication
- `/api/webhooks` - Webhook management requires authentication
- `/api/domains` - Domain management requires authentication
- `/api/tokens` - API token management requires authentication

Public routes (no authentication required):
- `/api/links/top` - Top links (uses `optionalAuth`)
- Short link redirects (e.g., `/:shortCode`)

## Testing the Integration

1. Start your development server:
   ```bash
   npm run dev
   ```

2. Navigate to your application
3. You should see Sign In and Sign Up buttons in the sidebar
4. Click Sign Up to create an account
5. After signing in, you should see the UserButton component
6. Try creating a link - it should work with authentication

## Troubleshooting

### TypeScript Errors

If you see TypeScript errors related to Clerk components, these are often false positives related to React type definitions. The code should work at runtime. You can:

1. Restart your TypeScript server
2. Clear `node_modules` and reinstall: `rm -rf node_modules && npm install`
3. Ensure React and React types are up to date

### Authentication Not Working

1. Verify your environment variables are set correctly
2. Check that `.env.local` exists and contains valid keys
3. Restart your development server after changing environment variables
4. Check browser console and server logs for error messages

### API Requests Failing with 401

1. Ensure you're using `useApiClient` hook or including the session token
2. Verify the user is signed in: `const { isSignedIn } = useAuth()`
3. Check that the Authorization header is being sent: `Authorization: Bearer <token>`

## Next Steps

1. **User Association**: Update your database schema to associate links, webhooks, etc. with `userId`
2. **User Filtering**: Filter data by `req.userId` in your routes to ensure users only see their own data
3. **Role-Based Access**: Use Clerk's organization features if you need team/role management

## Resources

- [Clerk React Documentation](https://clerk.com/docs/references/react/overview)
- [Clerk Node.js SDK Documentation](https://clerk.com/docs/references/node/overview)
- [Clerk Dashboard](https://dashboard.clerk.com)

