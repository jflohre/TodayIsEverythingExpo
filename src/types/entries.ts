import { Person } from '@/types/person';

export type EntryKind = 'voice' | 'text' | 'video' | 'photo';

export type JournalEntry = {
  id: string;
  personId: string;
  taggedPeople: string[];
  taggedGroups?: string[];
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
  taggedPeople: string[];
  taggedGroups?: string[];
};

export type EntrySummary = {
  person: Person;
  entries: JournalEntry[];
};
