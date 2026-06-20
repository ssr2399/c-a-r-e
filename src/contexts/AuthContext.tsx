import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { User, signInAnonymously, onAuthStateChanged } from 'firebase/auth';
import { auth } from '../lib/firebase';

interface AuthContextType {
  user: User | { uid: string } | null;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType>({ user: null, loading: true });

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | { uid: string } | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    try {
      const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
          setUser(currentUser);
          setLoading(false);
        } else {
          signInAnonymously(auth).catch((error) => {
            console.warn("Firebase Auth Error, using mock user:", error.message);
            setUser({ uid: 'mock-user-123' }); // Fallback
            setLoading(false);
          });
        }
      });
      return () => unsubscribe();
    } catch (e) {
      console.warn("Firebase not configured properly, using mock user");
      setUser({ uid: 'mock-user-123' });
      setLoading(false);
    }
  }, []);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
