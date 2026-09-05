import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { Journal, JournalDraft } from '@/types/journal';

const STORAGE_KEY = 'today-is-everything-journals';

const DEFAULT_JOURNALS: Journal[] = [
  {
    id: 'journal-sample-1',
    name: 'Lena',
    type: 'child',
    privacy: 'family-only',
    description: 'Daily moments and little milestones from the last year.',
    createdAt: '2026-01-17T09:30:00.000Z',
    coverColor: '#ff7a7a',
    entryCount: 12,
  },
  {
    id: 'journal-sample-2',
    name: 'Our Story',
    type: 'family',
    privacy: 'shared',
    description: 'Shared memories, anniversaries, and favorite routines.',
    createdAt: '2026-02-09T16:45:00.000Z',
    coverColor: '#7ab8ff',
    entryCount: 7,
  },
];

type JournalContextValue = {
  journals: Journal[];
  isReady: boolean;
  addJournal: (draft: JournalDraft) => Journal;
  removeJournal: (id: string) => void;
};

const JournalContext = createContext<JournalContextValue | undefined>(undefined);

export function JournalProvider({ children }: { children: ReactNode }) {
  const [journals, setJournals] = useState<Journal[]>(DEFAULT_JOURNALS);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadJournals = async () => {
      try {
        const serialized = await AsyncStorage.getItem(STORAGE_KEY);

        if (!serialized) {
          setJournals(DEFAULT_JOURNALS);
          setIsReady(true);
          return;
        }

        const parsed = JSON.parse(serialized) as Journal[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setJournals(parsed);
        }
      } catch (error) {
        console.warn('Failed to load journals', error);
      } finally {
        setIsReady(true);
      }
    };

    void loadJournals();
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const saveJournals = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(journals));
      } catch (error) {
        console.warn('Failed to save journals', error);
      }
    };

    void saveJournals();
  }, [isReady, journals]);

  const addJournal = (draft: JournalDraft) => {
    const newJournal: Journal = {
      id: `journal-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name: draft.name.trim(),
      type: draft.type,
      privacy: draft.privacy,
      description: draft.description.trim(),
      createdAt: new Date().toISOString(),
      coverColor: getCoverColor(draft.type),
      entryCount: 0,
    };

    setJournals((current) => [newJournal, ...current]);
    return newJournal;
  };

  const removeJournal = (id: string) => {
    setJournals((current) => current.filter((journal) => journal.id !== id));
  };

  const value = useMemo<JournalContextValue>(
    () => ({ journals, isReady, addJournal, removeJournal }),
    [journals, isReady],
  );

  return <JournalContext.Provider value={value}>{children}</JournalContext.Provider>;
}

export function useJournal() {
  const context = useContext(JournalContext);

  if (!context) {
    throw new Error('useJournal must be used inside JournalProvider');
  }

  return context;
}

function getCoverColor(type: Journal['type']) {
  const colors: Record<Journal['type'], string> = {
    child: '#ff7a7a',
    spouse: '#8b7cf6',
    parent: '#64c7a5',
    pet: '#f7b267',
    family: '#7ab8ff',
  };

  return colors[type];
}
