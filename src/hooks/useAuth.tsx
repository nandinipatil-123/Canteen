import { useEffect, useState } from "react";
import { User, onAuthStateChanged, getRedirectResult, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../lib/firebase";
import { MockAuthService, MockUser } from "../lib/services/foodService";

// Extended user type that can handle both Firebase and mock users
type ExtendedUser = User | MockUser | null;

export const useAuth = () => {
  const [user, setUser] = useState<ExtendedUser>(null);
  const [loading, setLoading] = useState(true);
  const [useMockAuth, setUseMockAuth] = useState(false);

  useEffect(() => {
    let unsubscribe: (() => void) | null = null;

    // Try Firebase auth first
    try {
      unsubscribe = onAuthStateChanged(auth, (user) => {
        if (user) {
          setUser(user);
          setUseMockAuth(false);
        } else {
          // No Firebase user, check for mock auth
          checkMockAuth();
        }
        setLoading(false);
      });

      // Handle redirect result
      getRedirectResult(auth)
        .then((result) => {
          if (result) {
            const credential = GoogleAuthProvider.credentialFromResult(result);
            console.log("User signed in:", result.user);
            setUseMockAuth(false);
          }
        })
        .catch((error) => {
          console.error("Firebase auth error:", error);
          // Firebase failed, check mock auth
          checkMockAuth();
        });
    } catch (error) {
      console.error("Firebase initialization error:", error);
      // Firebase failed to initialize, use mock auth
      setUseMockAuth(true);
      checkMockAuth();
    }

    // Function to check mock authentication
    async function checkMockAuth() {
      try {
        const mockUser = await MockAuthService.checkAuth();
        if (mockUser) {
          setUser(mockUser);
          setUseMockAuth(true);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Mock auth check error:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    }

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, []);

  return { user, loading, useMockAuth };
};