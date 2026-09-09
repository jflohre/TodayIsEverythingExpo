import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { EntryDraft, JournalEntry } from '@/types/entries';

const STORAGE_KEY = 'today-is-everything-entries';

type EntryContextValue = {
  entries: JournalEntry[];
  addEntry: (personIds: string[] | string, draft: EntryDraft) => JournalEntry;
  removeEntry: (id: string) => void;
  getEntriesForPerson: (personId: string) => JournalEntry[];
};

const EntryContext = createContext<EntryContextValue | undefined>(undefined);

const normalizeEntry = (entry: Partial<JournalEntry> & { taggedPeople?: string[] | undefined }): JournalEntry => {
  const fallbackTag = entry.personId && entry.personId !== 'shared' ? [entry.personId] : [];
  const taggedPeople = Array.isArray(entry.taggedPeople)
    ? entry.taggedPeople.filter(Boolean)
    : fallbackTag;
  const taggedGroups = Array.isArray(entry.taggedGroups)
    ? entry.taggedGroups.filter(Boolean)
    : [];

  return {
    id: entry.id ?? `entry-${Date.now()}-${Math.random().toString(16).slice(2)}`,
    personId: entry.personId ?? taggedPeople[0] ?? 'shared',
    taggedPeople,
    taggedGroups,
    title: entry.title ?? '',
    body: entry.body ?? '',
    type: entry.type ?? 'text',
    date: entry.date,
    location: entry.location,
    createdAt: entry.createdAt ?? new Date().toISOString(),
    media: Array.isArray(entry.media) ? entry.media : [],
  };
};

const SAMPLE_ENTRIES: JournalEntry[] = [
  {
    id: 'entry-sample-1',
    personId: 'person-sample-1',
    taggedPeople: ['person-sample-1'],
    title: 'Morning giggles',
    body: 'Lena laughed so hard this morning when she chased the dog around the sofa.',
    type: 'voice',
    date: '2026-02-03',
    createdAt: '2026-02-14T08:15:00.000Z',
    media: [],
  },
  {
    id: 'entry-sample-2',
    personId: 'person-sample-2',
    taggedPeople: ['person-sample-2'],
    title: 'Dinner table story',
    body: 'We talked about our first trip together and laughed remembering the rainstorm.',
    type: 'text',
    date: '2026-02-18',
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

        const parsed = JSON.parse(serialized) as Partial<JournalEntry>[];
        if (Array.isArray(parsed)) {
          setEntries(parsed.map((entry) => normalizeEntry(entry)));
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

  const addEntry = (personIds: string[] | string, draft: EntryDraft) => {
    const normalizedIds = Array.isArray(personIds) ? personIds : [personIds];
    const selectedPeople = (draft.taggedPeople?.length ? draft.taggedPeople : normalizedIds)
      .filter(Boolean)
      .filter((value, index, array) => array.indexOf(value) === index);
    const taggedPeople = selectedPeople.length > 0 ? selectedPeople : [];
    const primaryPersonId = taggedPeople[0] ?? 'shared';

    const newEntry: JournalEntry = {
      id: `entry-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      personId: primaryPersonId,
      taggedPeople,
      taggedGroups: Array.isArray(draft.taggedGroups) ? draft.taggedGroups.filter(Boolean) : [],
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

  const getEntriesForPerson = (personId: string) =>
    entries.filter((entry) => {
      const taggedPeople = Array.isArray(entry.taggedPeople) ? entry.taggedPeople : [];
      return entry.personId === personId || taggedPeople.includes(personId);
    });

  const value = useMemo<EntryContextValue>(
    () => ({ entries, addEntry, removeEntry, getEntriesForPerson }),
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
