export type Group = {
  id: string;
  name: string;
  color: string;
  personIds: string[];
  createdAt: string;
};

export type GroupDraft = {
  name: string;
  color?: string;
  personIds?: string[];
};
