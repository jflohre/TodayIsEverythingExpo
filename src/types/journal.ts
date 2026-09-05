export type JournalType = 'child' | 'spouse' | 'parent' | 'pet' | 'family';
export type JournalPrivacy = 'private' | 'family-only' | 'shared';

export type Journal = {
  id: string;
  name: string;
  type: JournalType;
  privacy: JournalPrivacy;
  description: string;
  createdAt: string;
  coverColor: string;
  entryCount: number;
};

export type JournalDraft = {
  name: string;
  type: JournalType;
  privacy: JournalPrivacy;
  description: string;
};
