import { Journal } from '@/types/journal';

export type EntryKind = 'voice' | 'text' | 'video' | 'photo';

export type JournalEntry = {
  id: string;
  journalId: string;
  title: string;
  body: string;
  type: EntryKind;
  date?: string;
  location?: string;
  createdAt: string;
  media: string[];
};

export type EntryDraft = {
  title: string;
  body: string;
  type: EntryKind;
  date: string;
  location: string;
};

export type EntrySummary = {
  journal: Journal;
  entries: JournalEntry[];
};
