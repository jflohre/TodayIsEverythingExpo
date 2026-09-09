import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EntryForm } from '@/components/entry-form';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useEntries } from '@/context/EntryContext';
import { useGroups } from '@/context/GroupContext';
import { usePerson } from '@/context/PersonContext';
import { EntryDraft } from '@/types/entries';

const sortOptions = [
  { label: 'Tagged people', value: 'taggedPeople' },
  { label: 'Created', value: 'createdAt' },
  { label: 'Date', value: 'date' },
  { label: 'Type', value: 'type' },
] as const;

const typeFilterOptions = [
  { label: 'All', value: 'all' },
  { label: 'Voice', value: 'voice' },
  { label: 'Text', value: 'text' },
  { label: 'Photo', value: 'photo' },
  { label: 'Video', value: 'video' },
] as const;

type SortKey = (typeof sortOptions)[number]['value'];
type SortDirection = 'asc' | 'desc';
type TypeFilterValue = (typeof typeFilterOptions)[number]['value'];

function formatDisplayDate(value?: string) {
  if (!value) {
    return 'No date';
  }

  const parsed = new Date(`${value}T00:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

const emptyMemoryDraft: EntryDraft = {
  title: '',
  body: '',
  type: 'voice',
  date: new Date().toISOString().slice(0, 10),
  location: '',
  taggedPeople: [],
};

export default function MemoriesScreen() {
  const router = useRouter();
  const { entries, addEntry } = useEntries();
  const { people } = usePerson();
  const { groups } = useGroups();
  const [sortKey, setSortKey] = useState<SortKey>('date');
  const [sortDirection, setSortDirection] = useState<SortDirection>('desc');
  const [selectedType, setSelectedType] = useState<TypeFilterValue>('all');
  const [selectedPersonIds, setSelectedPersonIds] = useState<string[]>([]);
  const [selectedGroupIds, setSelectedGroupIds] = useState<string[]>([]);
  const [isTypeMenuOpen, setIsTypeMenuOpen] = useState(false);
  const [isPeopleMenuOpen, setIsPeopleMenuOpen] = useState(false);
  const [isGroupsMenuOpen, setIsGroupsMenuOpen] = useState(false);
  const [isCreating, setIsCreating] = useState(false);
  const [memoryDraft, setMemoryDraft] = useState<EntryDraft>(emptyMemoryDraft);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const peopleById = useMemo(
    () => Object.fromEntries(people.map((person) => [person.id, person])),
    [people],
  );

  const peopleFilterOptions = useMemo(
    () => [{ label: 'All', value: 'all' }, ...people.map((person) => ({ label: person.name, value: person.id }))],
    [people],
  );

  const groupFilterOptions = useMemo(
    () => [{ label: 'All', value: 'all' }, ...groups.map((group) => ({ label: group.name, value: group.id }))],
    [groups],
  );

  const sortedEntries = useMemo(() => {
    let baseEntries =
      selectedType === 'all' ? [...entries] : entries.filter((entry) => (entry.type || 'voice') === selectedType);

    if (selectedPersonIds.length > 0) {
      baseEntries = baseEntries.filter((entry) =>
        (entry.taggedPeople ?? []).some((personId) => selectedPersonIds.includes(personId)),
      );
    }

    if (selectedGroupIds.length > 0) {
      baseEntries = baseEntries.filter((entry) =>
        (entry.taggedGroups ?? []).some((groupId) => selectedGroupIds.includes(groupId)),
      );
    }

    const parseTime = (value?: string) => {
      if (!value) {
        return 0;
      }

      const time = new Date(value).getTime();
      return Number.isFinite(time) ? time : 0;
    };

    baseEntries.sort((left, right) => {
      const directionMultiplier = sortDirection === 'asc' ? 1 : -1;

      if (sortKey === 'taggedPeople') {
        const leftCount = left.taggedPeople?.length ?? 0;
        const rightCount = right.taggedPeople?.length ?? 0;

        if (leftCount !== rightCount) {
          return (rightCount - leftCount) * directionMultiplier;
        }
      }

      if (sortKey === 'createdAt') {
        const leftValue = parseTime(left.createdAt);
        const rightValue = parseTime(right.createdAt);

        if (leftValue !== rightValue) {
          return (rightValue - leftValue) * directionMultiplier;
        }

        return (parseTime(right.date) - parseTime(left.date)) * directionMultiplier;
      }

      if (sortKey === 'type') {
        const leftValue = (left.type || 'voice').toLowerCase();
        const rightValue = (right.type || 'voice').toLowerCase();

        if (leftValue !== rightValue) {
          return leftValue.localeCompare(rightValue) * directionMultiplier;
        }
      }

      const leftValue = parseTime(left.date ? `${left.date}T00:00:00` : undefined);
      const rightValue = parseTime(right.date ? `${right.date}T00:00:00` : undefined);

      if (leftValue !== rightValue) {
        return (rightValue - leftValue) * directionMultiplier;
      }

      return (parseTime(right.createdAt) - parseTime(left.createdAt)) * directionMultiplier;
    });

    return baseEntries;
  }, [entries, selectedGroupIds, selectedPersonIds, selectedType, sortDirection, sortKey]);

  const handleCreateMemory = () => {
    setIsCreating(true);
    setMemoryDraft({
      ...emptyMemoryDraft,
      taggedPeople: [],
      taggedGroups: [],
    });
  };

  const handleCancelMemory = () => {
    const hasDraftContent =
      memoryDraft.title.trim() || memoryDraft.body.trim() || memoryDraft.type !== 'voice' || memoryDraft.location.trim();

    if (!hasDraftContent) {
      setIsCreating(false);
      return;
    }

    Alert.alert('Discard draft?', 'Your new memory will be lost.', [
      { text: 'Keep editing', style: 'cancel' },
      {
        text: 'Discard',
        style: 'destructive',
        onPress: () => {
          setMemoryDraft(emptyMemoryDraft);
          setIsCreating(false);
        },
      },
    ]);
  };

  const handleSaveMemory = () => {
    if (!memoryDraft.title.trim()) {
      Alert.alert('Missing title', 'Please add a title before saving your memory.');
      return;
    }

    setIsSubmitting(true);
    addEntry(memoryDraft.taggedPeople.length > 0 ? memoryDraft.taggedPeople : [], memoryDraft);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsCreating(false);
      setMemoryDraft(emptyMemoryDraft);
    }, 150);
  };

  const handleSortOptionPress = (nextKey: SortKey) => {
    if (nextKey === 'type') {
      setSortKey('type');
      setIsTypeMenuOpen((current) => !current);
      setIsPeopleMenuOpen(false);
      setIsGroupsMenuOpen(false);
      return;
    }

    if (nextKey === 'taggedPeople') {
      setSortKey('taggedPeople');
      setIsPeopleMenuOpen((current) => !current);
      setIsTypeMenuOpen(false);
      setIsGroupsMenuOpen(false);
      return;
    }

    setIsTypeMenuOpen(false);
    setIsPeopleMenuOpen(false);
    setIsGroupsMenuOpen(false);

    if (sortKey === nextKey) {
      setSortDirection((current) => (current === 'desc' ? 'asc' : 'desc'));
      return;
    }

    setSortKey(nextKey);
    setSortDirection('desc');
  };

  const getDirectionArrow = (optionValue: SortKey) => {
    if (sortKey !== optionValue) {
      return '↕';
    }

    return sortDirection === 'desc' ? '↓' : '↑';
  };

  const getTypeLabel = () => {
    const selectedOption = typeFilterOptions.find((option) => option.value === selectedType);
    return `Type: ${selectedOption?.label ?? 'All'}`;
  };

  const getTaggedPeopleLabel = () => {
    if (selectedPersonIds.length === 0) {
      return 'Tagged people';
    }

    const names = selectedPersonIds
      .map((personId) => peopleById[personId]?.name)
      .filter(Boolean)
      .join(', ');

    return `Tagged people: ${names || 'Selected'}`;
  };

  const getGroupsLabel = () => {
    if (selectedGroupIds.length === 0) {
      return 'Groups';
    }

    const names = selectedGroupIds
      .map((groupId) => groups.find((group) => group.id === groupId)?.name)
      .filter(Boolean)
      .join(', ');

    return `Groups: ${names || 'Selected'}`;
  };

  const toggleSelectedPerson = (personId: string) => {
    setSelectedPersonIds((current) => {
      if (personId === 'all') {
        return [];
      }

      if (current.includes(personId)) {
        return current.filter((id) => id !== personId);
      }

      return [...current, personId];
    });
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>Memories</ThemedText>
          <Pressable onPress={handleCreateMemory} style={styles.createButton}>
            <ThemedText type="smallBold" style={styles.createButtonText}>+ Create new memory</ThemedText>
          </Pressable>
        </View>

        {isCreating ? (
          <EntryForm
            draft={memoryDraft}
            onChange={setMemoryDraft}
            onSubmit={handleSaveMemory}
            onCancel={handleCancelMemory}
            isSubmitting={isSubmitting}
            availablePeople={people}
            availableGroups={groups}
          />
        ) : (
          <>
            <View style={styles.filterRow}>
              <View style={styles.sortRow}>
                {sortOptions.map((option) => {
                  if (option.value === 'type') {
                    return (
                      <Pressable
                        key={option.value}
                        onPress={() => handleSortOptionPress(option.value)}
                        style={[styles.sortButton, sortKey === option.value && styles.sortButtonActive]}>
                        <ThemedText type="smallBold" style={sortKey === option.value ? styles.sortButtonTextActive : styles.sortButtonText}>
                          {getTypeLabel()}
                        </ThemedText>
                      </Pressable>
                    );
                  }

                  if (option.value === 'taggedPeople') {
                    return (
                      <Pressable
                        key={option.value}
                        onPress={() => handleSortOptionPress(option.value)}
                        style={[styles.sortButton, sortKey === option.value && styles.sortButtonActive]}>
                        <ThemedText type="smallBold" style={sortKey === option.value ? styles.sortButtonTextActive : styles.sortButtonText}>
                          {getTaggedPeopleLabel()}
                        </ThemedText>
                      </Pressable>
                    );
                  }

                  return (
                    <Pressable
                      key={option.value}
                      onPress={() => handleSortOptionPress(option.value)}
                      style={[styles.sortButton, sortKey === option.value && styles.sortButtonActive]}>
                      <ThemedText type="smallBold" style={sortKey === option.value ? styles.sortButtonTextActive : styles.sortButtonText}>
                        {option.label} {getDirectionArrow(option.value)}
                      </ThemedText>
                    </Pressable>
                  );
                })}
              </View>

              {isTypeMenuOpen && (
                <View style={styles.typeFilterRow}>
                  {typeFilterOptions.map((option) => (
                    <Pressable
                      key={option.value}
                      onPress={() => {
                        setSelectedType(option.value);
                        setIsTypeMenuOpen(false);
                      }}
                      style={[
                        styles.typeFilterButton,
                        selectedType === option.value && styles.typeFilterButtonActive,
                      ]}>
                      <ThemedText
                        type="smallBold"
                        style={selectedType === option.value ? styles.typeFilterTextActive : styles.typeFilterText}>
                        {option.label}
                      </ThemedText>
                    </Pressable>
                  ))}
                </View>
              )}

              {isPeopleMenuOpen && (
                <View style={styles.typeFilterRow}>
                  {peopleFilterOptions.map((option) => {
                    const isSelected = option.value === 'all' ? selectedPersonIds.length === 0 : selectedPersonIds.includes(option.value);

                    return (
                      <Pressable
                        key={option.value}
                        onPress={() => {
                          if (option.value === 'all') {
                            setSelectedPersonIds([]);
                            return;
                          }

                          toggleSelectedPerson(option.value);
                        }}
                        style={[
                          styles.typeFilterButton,
                          isSelected && styles.typeFilterButtonActive,
                        ]}>
                        <ThemedText
                          type="smallBold"
                          style={isSelected ? styles.typeFilterTextActive : styles.typeFilterText}>
                          {option.label}
                        </ThemedText>
                      </Pressable>
                    );
                  })}

                  <Pressable
                    onPress={() => setIsPeopleMenuOpen(false)}
                    style={[styles.typeFilterButton, styles.closeFilterButton]}>
                    <ThemedText type="smallBold" style={styles.typeFilterText}>Done</ThemedText>
                  </Pressable>
                </View>
              )}

              {isGroupsMenuOpen && (
                <View style={styles.typeFilterRow}>
                  {groupFilterOptions.map((option) => {
                    const isSelected = option.value === 'all' ? selectedGroupIds.length === 0 : selectedGroupIds.includes(option.value);
                    const group = groups.find((item) => item.id === option.value);

                    return (
                      <Pressable
                        key={option.value}
                        onPress={() => {
                          if (option.value === 'all') {
                            setSelectedGroupIds([]);
                            return;
                          }

                          setSelectedGroupIds((current) =>
                            current.includes(option.value)
                              ? current.filter((id) => id !== option.value)
                              : [...current, option.value],
                          );
                        }}
                        style={[
                          styles.typeFilterButton,
                          isSelected && styles.typeFilterButtonActive,
                          !isSelected && group ? { borderColor: group.color, borderWidth: 1 } : null,
                        ]}>
                        <ThemedText
                          type="smallBold"
                          style={isSelected ? styles.typeFilterTextActive : styles.typeFilterText}>
                          {option.label}
                        </ThemedText>
                      </Pressable>
                    );
                  })}

                  <Pressable
                    onPress={() => setIsGroupsMenuOpen(false)}
                    style={[styles.typeFilterButton, styles.closeFilterButton]}>
                    <ThemedText type="smallBold" style={styles.typeFilterText}>Done</ThemedText>
                  </Pressable>
                </View>
              )}
            </View>

            <FlatList
              data={sortedEntries}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.list}
              renderItem={({ item }) => {
            const taggedNames = (item.taggedPeople ?? [])
              .map((personId) => peopleById[personId]?.name)
              .filter(Boolean)
              .join(', ');
            const displayPeopleText = taggedNames || 'No people tagged';

            return (
              <View style={styles.card}>
                <View style={styles.cardHeader}>
                  <ThemedText type="smallBold">{item.title}</ThemedText>
                  <ThemedText type="small" style={styles.typeText}>{item.type}</ThemedText>
                </View>

                <ThemedText type="small" style={styles.metaText}>
                  Created: {new Date(item.createdAt).toLocaleDateString(undefined, {
                    month: 'short',
                    day: 'numeric',
                    year: 'numeric',
                  })}
                </ThemedText>

                <ThemedText type="small" style={styles.metaText}>
                  Date: {formatDisplayDate(item.date)}
                </ThemedText>

                <ThemedText type="small" style={styles.metaText}>People: {displayPeopleText}</ThemedText>

                <ThemedText type="small" style={styles.bodyText}>
                  {item.body || 'No details added yet.'}
                </ThemedText>
              </View>
            );
          }}
              ListEmptyComponent={
                <ThemedText type="small" style={styles.emptyState}>No memories yet. Create your first one.</ThemedText>
              }
            />
          </>
        )}
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  safeArea: {
    flex: 1,
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.three,
    gap: Spacing.two,
  },
  title: {
    fontSize: 38,
    lineHeight: 42,
    flexShrink: 1,
  },
  createButton: {
    backgroundColor: '#111827',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 999,
  },
  createButtonText: {
    color: '#fff',
  },
  filterRow: {
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  sortRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  sortButton: {
    backgroundColor: '#f3f4f6',
    borderRadius: 999,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  sortButtonActive: {
    backgroundColor: '#111827',
  },
  sortButtonText: {
    color: '#111827',
  },
  sortButtonTextActive: {
    color: '#fff',
  },
  typeFilterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  typeFilterButton: {
    backgroundColor: '#f3f4f6',
    borderRadius: 999,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
  },
  typeFilterButtonActive: {
    backgroundColor: '#111827',
  },
  closeFilterButton: {
    backgroundColor: '#e5e7eb',
  },
  typeFilterText: {
    color: '#111827',
  },
  typeFilterTextActive: {
    color: '#fff',
  },
  directionRow: {
    flexDirection: 'row',
    gap: Spacing.two,
  },
  directionButton: {
    backgroundColor: '#f3f4f6',
    borderRadius: 999,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  directionButtonActive: {
    backgroundColor: '#e5e7eb',
  },
  directionText: {
    color: '#111827',
  },
  directionTextActive: {
    color: '#111827',
  },
  list: {
    gap: Spacing.three,
    paddingBottom: Spacing.six,
  },
  card: {
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
  },
  typeText: {
    textTransform: 'capitalize',
    opacity: 0.7,
  },
  metaText: {
    opacity: 0.7,
    textTransform: 'capitalize',
  },
  bodyText: {
    opacity: 0.8,
  },
  emptyState: {
    textAlign: 'center',
    marginTop: Spacing.five,
    opacity: 0.7,
  },
});
