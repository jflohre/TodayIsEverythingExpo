export type PersonType = 'child' | 'spouse' | 'parent' | 'pet' | 'family';
export type PersonPrivacy = 'private' | 'family-only' | 'shared';

export type Person = {
  id: string;
  name: string;
  type: PersonType;
  privacy: PersonPrivacy;
  description: string;
  createdAt: string;
  coverColor: string;
  memoryCount: number;
  groupIds?: string[];
};

export type PersonDraft = {
  name: string;
  type: PersonType;
  privacy: PersonPrivacy;
  description: string;
  groupIds?: string[];
};
