import { clerkClient } from "@clerk/clerk-sdk-node";
import type { Request, Response, NextFunction } from "express";

// Extend Express Request type to include userId
declare global {
  namespace Express {
    interface Request {
      userId?: string;
      auth?: {
        userId: string;
        sessionId?: string;
      };
    }
  }
}

/**
 * Middleware to authenticate requests using Clerk
 * Verifies the session token from the Authorization header
 */
export async function requireAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    // Get the session token from the Authorization header
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      res.status(401).json({ message: "Unauthorized: Missing or invalid authorization header" });
      return;
    }

    const sessionToken = authHeader.replace("Bearer ", "");

    // Verify the session token with Clerk
    // For Express/Node.js, we use verifyToken from clerkClient
    const payload = await clerkClient.verifyToken(sessionToken);
    
    if (!payload || !payload.sub) {
      res.status(401).json({ message: "Unauthorized: Invalid session token" });
      return;
    }

    // Attach user information to the request
    // payload.sub contains the user ID
    req.userId = payload.sub;
    req.auth = {
      userId: payload.sub,
      sessionId: payload.sid,
    };

    next();
  } catch (error) {
    console.error("Authentication error:", error);
    res.status(401).json({ message: "Unauthorized: Authentication failed" });
  }
}

/**
 * Optional authentication middleware
 * Attaches user info if token is present, but doesn't require it
 */
export async function optionalAuth(
  req: Request,
  res: Response,
  next: NextFunction
): Promise<void> {
  try {
    const authHeader = req.headers.authorization;
    
    if (authHeader && authHeader.startsWith("Bearer ")) {
      const sessionToken = authHeader.replace("Bearer ", "");
      const payload = await clerkClient.verifyToken(sessionToken);
      
      if (payload && payload.sub) {
        req.userId = payload.sub;
        req.auth = {
          userId: payload.sub,
          sessionId: payload.sid,
        };
      }
    }
    
    next();
  } catch (error) {
    // Silently fail for optional auth
    next();
  }
}

