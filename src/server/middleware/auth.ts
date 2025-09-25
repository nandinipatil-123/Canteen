import express from "express";
import admin from "firebase-admin";

// Initialize Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  });
}

export interface AuthenticatedRequest extends express.Request {
  user?: {
    uid: string;
    email: string;
    name?: string;
  };
}

// Middleware to verify Firebase ID token
export const verifyFirebaseToken = async (
  req: AuthenticatedRequest,
  res: express.Response,
  next: express.NextFunction
) => {
  try {
    const authHeader = req.headers.authorization;
    
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      return res.status(401).json({ error: 'Authorization header with Bearer token required' });
    }
    
    const idToken = authHeader.split('Bearer ')[1];
    
    if (!idToken) {
      return res.status(401).json({ error: 'ID token required' });
    }
    
    // Verify the ID token with Firebase Admin
    const decodedToken = await admin.auth().verifyIdToken(idToken);
    
    // Add user info to request
    req.user = {
      uid: decodedToken.uid,
      email: decodedToken.email || '',
      name: decodedToken.name,
    };
    
    next();
  } catch (error) {
    console.error('Firebase token verification error:', error);
    return res.status(401).json({ error: 'Invalid or expired token' });
  }
};