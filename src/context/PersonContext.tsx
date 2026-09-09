import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { useEntries } from '@/context/EntryContext';
import { Person, PersonDraft } from '@/types/person';

const STORAGE_KEY = 'today-is-everything-people';

const DEFAULT_PEOPLE: Person[] = [
  {
    id: 'person-sample-1',
    name: 'Lena',
    type: 'child',
    privacy: 'family-only',
    description: 'Daily moments and little milestones from the last year.',
    createdAt: '2026-01-17T09:30:00.000Z',
    coverColor: '#ff7a7a',
    memoryCount: 12,
  },
  {
    id: 'person-sample-2',
    name: 'Our Story',
    type: 'family',
    privacy: 'shared',
    description: 'Shared memories, anniversaries, and favorite routines.',
    createdAt: '2026-02-09T16:45:00.000Z',
    coverColor: '#7ab8ff',
    memoryCount: 7,
  },
];

type PersonContextValue = {
  people: Person[];
  isReady: boolean;
  addPerson: (draft: PersonDraft) => Person;
  removePerson: (id: string) => void;
  updatePersonGroupIds: (personId: string, groupIds: string[]) => void;
  updatePersonDescription: (personId: string, description: string) => void;
};

const PersonContext = createContext<PersonContextValue | undefined>(undefined);

export function PersonProvider({ children }: { children: ReactNode }) {
  const [people, setPeople] = useState<Person[]>(DEFAULT_PEOPLE);
  const [isReady, setIsReady] = useState(false);
  const { entries } = useEntries();

  useEffect(() => {
    const loadPeople = async () => {
      try {
        const serialized = await AsyncStorage.getItem(STORAGE_KEY);

        if (!serialized) {
          setPeople(DEFAULT_PEOPLE);
          setIsReady(true);
          return;
        }

        const parsed = JSON.parse(serialized) as Person[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setPeople(parsed);
        }
      } catch (error) {
        console.warn('Failed to load people', error);
      } finally {
        setIsReady(true);
      }
    };

    void loadPeople();
  }, []);

  useEffect(() => {
    setPeople((current) =>
      current.map((person) => {
        const count = entries.filter((entry) => {
          const taggedPeople = Array.isArray(entry.taggedPeople) ? entry.taggedPeople : [];
          return entry.personId === person.id || taggedPeople.includes(person.id);
        }).length;

        return {
          ...person,
          memoryCount: count,
        };
      }),
    );
  }, [entries]);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const savePeople = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(people));
      } catch (error) {
        console.warn('Failed to save people', error);
      }
    };

    void savePeople();
  }, [isReady, people]);

  const addPerson = (draft: PersonDraft) => {
    const newPerson: Person = {
      id: `person-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name: draft.name.trim(),
      type: draft.type,
      privacy: draft.privacy,
      description: draft.description.trim(),
      groupIds: Array.isArray(draft.groupIds) ? draft.groupIds.filter(Boolean) : [],
      createdAt: new Date().toISOString(),
      coverColor: getCoverColor(draft.type),
      memoryCount: 0,
    };

    setPeople((current) => [newPerson, ...current]);
    return newPerson;
  };

  const removePerson = (id: string) => {
    setPeople((current) => current.filter((person) => person.id !== id));
  };

  const updatePersonGroupIds = (personId: string, groupIds: string[]) => {
    setPeople((current) =>
      current.map((person) =>
        person.id === personId
          ? { ...person, groupIds: groupIds.filter(Boolean) }
          : person,
      ),
    );
  };

  const updatePersonDescription = (personId: string, description: string) => {
    setPeople((current) =>
      current.map((person) =>
        person.id === personId
          ? { ...person, description: description.trim() }
          : person,
      ),
    );
  };

  const value = useMemo<PersonContextValue>(
    () => ({ people, isReady, addPerson, removePerson, updatePersonGroupIds, updatePersonDescription }),
    [people, isReady],
  );

  return <PersonContext.Provider value={value}>{children}</PersonContext.Provider>;
}

export function usePerson() {
  const context = useContext(PersonContext);

  if (!context) {
    throw new Error('usePerson must be used inside PersonProvider');
  }

  return context;
}

function getCoverColor(type: Person['type']) {
  const colors: Record<Person['type'], string> = {
    child: '#ff7a7a',
    spouse: '#8b7cf6',
    parent: '#64c7a5',
    pet: '#f7b267',
    family: '#7ab8ff',
  };

  return colors[type];
}
