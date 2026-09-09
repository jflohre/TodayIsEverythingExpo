import AsyncStorage from '@react-native-async-storage/async-storage';
import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react';

import { Group, GroupDraft } from '@/types/group';

const STORAGE_KEY = 'today-is-everything-groups';

const DEFAULT_GROUPS: Group[] = [
  {
    id: 'group-family',
    name: 'Family',
    color: '#7ab8ff',
    personIds: [],
    createdAt: '2026-01-01T00:00:00.000Z',
  },
  {
    id: 'group-kids',
    name: 'Kids',
    color: '#ff7a7a',
    personIds: [],
    createdAt: '2026-01-01T00:00:00.000Z',
  },
];

type GroupContextValue = {
  groups: Group[];
  isReady: boolean;
  addGroup: (draft: GroupDraft) => Group;
  renameGroup: (groupId: string, name: string) => void;
  updateGroupColor: (groupId: string, color: string) => void;
  updateGroupMembers: (groupId: string, personIds: string[]) => void;
  removeGroup: (id: string) => void;
};

const GroupContext = createContext<GroupContextValue | undefined>(undefined);

export function GroupProvider({ children }: { children: ReactNode }) {
  const [groups, setGroups] = useState<Group[]>(DEFAULT_GROUPS);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const loadGroups = async () => {
      try {
        const serialized = await AsyncStorage.getItem(STORAGE_KEY);
        if (!serialized) {
          setGroups(DEFAULT_GROUPS);
          setIsReady(true);
          return;
        }

        const parsed = JSON.parse(serialized) as Group[];
        if (Array.isArray(parsed) && parsed.length > 0) {
          setGroups(parsed);
        }
      } catch (error) {
        console.warn('Failed to load groups', error);
      } finally {
        setIsReady(true);
      }
    };

    void loadGroups();
  }, []);

  useEffect(() => {
    if (!isReady) {
      return;
    }

    const saveGroups = async () => {
      try {
        await AsyncStorage.setItem(STORAGE_KEY, JSON.stringify(groups));
      } catch (error) {
        console.warn('Failed to save groups', error);
      }
    };

    void saveGroups();
  }, [groups, isReady]);

  const addGroup = (draft: GroupDraft) => {
    const newGroup: Group = {
      id: `group-${Date.now()}-${Math.random().toString(16).slice(2)}`,
      name: draft.name.trim(),
      color: draft.color ?? '#7ab8ff',
      personIds: Array.isArray(draft.personIds) ? draft.personIds.filter(Boolean) : [],
      createdAt: new Date().toISOString(),
    };

    setGroups((current) => [newGroup, ...current]);
    return newGroup;
  };

  const renameGroup = (groupId: string, name: string) => {
    const trimmedName = name.trim();
    if (!trimmedName) {
      return;
    }

    setGroups((current) =>
      current.map((group) =>
        group.id === groupId ? { ...group, name: trimmedName } : group,
      ),
    );
  };

  const updateGroupColor = (groupId: string, color: string) => {
    const nextColor = color || '#7ab8ff';

    setGroups((current) =>
      current.map((group) =>
        group.id === groupId ? { ...group, color: nextColor } : group,
      ),
    );
  };

  const updateGroupMembers = (groupId: string, personIds: string[]) => {
    setGroups((current) =>
      current.map((group) =>
        group.id === groupId
          ? { ...group, personIds: personIds.filter(Boolean) }
          : group,
      ),
    );
  };

  const removeGroup = (id: string) => {
    setGroups((current) => current.filter((group) => group.id !== id));
  };

  const value = useMemo<GroupContextValue>(
    () => ({ groups, isReady, addGroup, renameGroup, updateGroupColor, updateGroupMembers, removeGroup }),
    [groups, isReady],
  );

  return <GroupContext.Provider value={value}>{children}</GroupContext.Provider>;
}

export function useGroups() {
  const context = useContext(GroupContext);

  if (!context) {
    throw new Error('useGroups must be used inside GroupProvider');
  }

  return context;
}
