import { createContext, useContext, useState, useEffect, ReactNode, useCallback } from 'react';
import { AppSettings } from '../types';
import { useAuth } from './AuthContext';
import { db } from '../lib/firebase';
import { doc, getDoc, setDoc, onSnapshot } from 'firebase/firestore';

interface AppSettingsContextType {
  settings: AppSettings;
  updateSettings: (newSettings: Partial<AppSettings>) => void;
}

const defaultSettings: AppSettings = {
  accessibilityMode: false,
  neurodivergentMode: false,
  simplifiedMode: false,
};

export const AppSettingsContext = createContext<AppSettingsContextType | undefined>(undefined);

export function AppSettingsProvider({ children }: { children: ReactNode }) {
  const [settings, setSettings] = useState<AppSettings>(() => {
    try {
      const saved = localStorage.getItem('care_settings');
      return saved ? { ...defaultSettings, ...JSON.parse(saved) } : defaultSettings;
    } catch {
      return defaultSettings;
    }
  });
  const { user } = useAuth();

  useEffect(() => {
    if (!user) return;

    try {
      const docRef = doc(db, 'users', user.uid);
      const unsubscribe = onSnapshot(docRef, (docSnap) => {
        if (docSnap.exists() && docSnap.data().settings) {
          setSettings((prev) => ({ ...prev, ...docSnap.data().settings }));
          localStorage.setItem('care_settings', JSON.stringify(docSnap.data().settings));
        }
      }, (error) => {
        console.warn("Firestore error, falling back to local storage snapshot:", error.message);
      });

      return () => unsubscribe();
    } catch (e) {
      console.warn("Firestore skipped");
    }
  }, [user]);

  const updateSettings = useCallback(async (newSettings: Partial<AppSettings>) => {
    const updatedSettings = { ...settings, ...newSettings };
    setSettings(updatedSettings);
    localStorage.setItem('care_settings', JSON.stringify(updatedSettings));

    if (user) {
      try {
        const docRef = doc(db, 'users', user.uid);
        await setDoc(docRef, { settings: updatedSettings }, { merge: true });
      } catch (error) {
        console.warn('Error saving settings to firestore, saved locally:', error);
      }
    }
  }, [settings, user]);

  return (
    <AppSettingsContext.Provider value={{ settings, updateSettings }}>
      {children}
    </AppSettingsContext.Provider>
  );
}

export function useAppSettings() {
  const context = useContext(AppSettingsContext);
  if (context === undefined) {
    throw new Error('useAppSettings must be used within a AppSettingsProvider');
  }
  return context;
}

