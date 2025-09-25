import { useEffect, useState } from "react";
import { User, onAuthStateChanged, getRedirectResult, GoogleAuthProvider } from "firebase/auth";
import { auth } from "../lib/firebase";

export const useAuth = () => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });

    // Handle redirect result
    getRedirectResult(auth)
      .then((result) => {
        if (result) {
          const credential = GoogleAuthProvider.credentialFromResult(result);
          // Handle successful sign-in
          console.log("User signed in:", result.user);
        }
      })
      .catch((error) => {
        console.error("Auth error:", error);
      });

    return () => unsubscribe();
  }, []);

  return { user, loading };
};