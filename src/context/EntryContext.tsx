import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { EntryDraft, JournalEntry } from '@/types/entries';

const STORAGE_KEY = 'today-is-everything-entries';

type EntryContextValue = {
  entries: JournalEntry[];
  addEntry: (journalId: string, draft: EntryDraft) => JournalEntry;
  removeEntry: (id: string) => void;
  getEntriesForJournal: (journalId: string) => JournalEntry[];
};

const EntryContext = createContext<EntryContextValue | undefined>(undefined);

const SAMPLE_ENTRIES: JournalEntry[] = [
  {
    id: 'entry-sample-1',
    journalId: 'journal-sample-1',
    title: 'Morning giggles',
    body: 'Lena laughed so hard this morning when she chased the dog around the sofa.',
    type: 'voice',
    createdAt: '2026-02-14T08:15:00.000Z',
    media: [],
  },
  {
    id: 'entry-sample-2',
    journalId: 'journal-sample-2',
    title: 'Dinner table story',
    body: 'We talked about our first trip together and laughed remembering the rainstorm.',
    type: 'text',
    createdAt: '2026-02-13T19:00:00.000Z',
    media: [],
  },
];

export function EntryProvider({ children }: { children: ReactNode }) {
  const [entries, setEntries] = useState<JournalEntry[]>(SAMPLE_ENTRIES);

  useEffect(() => {
    const loadEntries = async () => {
      try {
        const serialized = await AsyncStorage.getItem(STORAGE_KEY);
        if (!serialized) {
          return;
        }

        const parsed = JSON.parse(serialized) as JournalEntry[];
        if (Array.isArray(parsed)) {
          setEntries(parsed);
        }
      } catch (error) {
        console.warn('Failed to load entries', error);
      }
    };

    void loadEntries();
  }, []);

  useEffect(() => {
    const saveEntries = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(entries));
      } catch (error) {
        console.warn('Failed to save entries', error);
      }
    };

    void saveEntries();
  }, [entries]);

  const addEntry = (journalId: string, draft: EntryDraft) => {
    const newEntry: JournalEntry = {
      id: `entry-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      journalId,
      title: draft.title.trim(),
      body: draft.body.trim(),
      type: draft.type,
      date: draft.date.trim() || undefined,
      location: draft.location.trim() || undefined,
      createdAt: new Date().toISOString(),
      media: [],
    };

    setEntries((current) => [newEntry, ...current]);
    return newEntry;
  };

  const removeEntry = (id: string) => {
    setEntries((current) => current.filter((entry) => entry.id !== id));
  };

  const getEntriesForJournal = (journalId: string) =>
    entries.filter((entry) => entry.journalId === journalId);

  const value = useMemo<EntryContextValue>(
    () => ({ entries, addEntry, removeEntry, getEntriesForJournal }),
    [entries],
  );

  return <EntryContext.Provider value={value}>{children}</EntryContext.Provider>;
}

export function useEntries() {
  const context = useContext(EntryContext);

  if (!context) {
    throw new Error('useEntries must be used inside EntryProvider');
  }

  return context;
}
