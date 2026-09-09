import { useRouter } from 'expo-router';
import { useEffect, useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, TextInput, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EntryForm } from '@/components/entry-form';
import { PersonCard } from '@/components/person-card';
import { PersonForm } from '@/components/person-form';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useEntries } from '@/context/EntryContext';
import { useGroups } from '@/context/GroupContext';
import { usePerson } from '@/context/PersonContext';
import { EntryDraft } from '@/types/entries';
import { PersonDraft } from '@/types/person';

const emptyDraft: PersonDraft = {
  name: '',
  type: 'family',
  privacy: 'private',
  description: '',
};

const PERSON_NOTE_LIMIT = 220;

export default function PeopleScreen() {
  const router = useRouter();
  const { people, addPerson, removePerson, updatePersonGroupIds, updatePersonDescription } = usePerson();
  const { groups, addGroup, renameGroup, updateGroupColor, removeGroup, updateGroupMembers } = useGroups();
  const { getEntriesForPerson, addEntry } = useEntries();
  const [isCreating, setIsCreating] = useState(false);
  const [isManagingGroups, setIsManagingGroups] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [personDescription, setPersonDescription] = useState('');
  const [draft, setDraft] = useState<PersonDraft>(emptyDraft);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingMemory, setIsCreatingMemory] = useState(false);
  const [memoryDraft, setMemoryDraft] = useState<EntryDraft>({
    title: '',
    body: '',
    type: 'voice',
    date: new Date().toISOString().slice(0, 10),
    location: '',
    taggedPeople: [],
  });
  const [isSubmittingMemory, setIsSubmittingMemory] = useState(false);

  const handleCreate = () => {
    setIsCreating(true);
    setDraft(emptyDraft);
  };

  const handleAddGroup = () => {
    const trimmedName = newGroupName.trim();
    if (!trimmedName) {
      return;
    }

    const duplicate = groups.some(
      (group) => group.name.trim().toLowerCase() === trimmedName.toLowerCase(),
    );

    if (duplicate) {
      setNewGroupName('');
      return;
    }

    addGroup({ name: trimmedName, color: '#7ab8ff' });
    setNewGroupName('');
  };

  const handleDeleteGroup = (groupId: string, groupName: string) => {
    Alert.alert('Delete group', `Remove ${groupName}? This will also remove it from any people assigned to it.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => {
          removeGroup(groupId);
          people.forEach((person) => {
            const nextGroupIds = (person.groupIds ?? []).filter((id) => id !== groupId);
            if (nextGroupIds.length !== (person.groupIds ?? []).length) {
              updatePersonGroupIds(person.id, nextGroupIds);
            }
          });
        },
      },
    ]);
  };

  const handleRenameGroup = (groupId: string, nextName: string) => {
    const trimmedName = nextName.trim();
    if (!trimmedName) {
      return;
    }

    renameGroup(groupId, trimmedName);
  };

  const handleUpdateGroupColor = (groupId: string, color: string) => {
    updateGroupColor(groupId, color);
  };

  const togglePersonInGroup = (personId: string, groupId: string) => {
    const person = people.find((item) => item.id === personId);
    const group = groups.find((item) => item.id === groupId);

    if (!person || !group) {
      return;
    }

    const nextPersonGroupIds = (person.groupIds ?? []).includes(groupId)
      ? (person.groupIds ?? []).filter((id) => id !== groupId)
      : [...(person.groupIds ?? []), groupId];

    const nextGroupPersonIds = (group.personIds ?? []).includes(personId)
      ? (group.personIds ?? []).filter((id) => id !== personId)
      : [...(group.personIds ?? []), personId];

    updatePersonGroupIds(personId, nextPersonGroupIds);
    updateGroupMembers(groupId, nextGroupPersonIds);
  };

  const handleCancelCreate = () => {
    const hasDraftContent =
      draft.name.trim() || draft.description.trim() || draft.type !== 'family' || draft.privacy !== 'private';

    if (!hasDraftContent) {
      setIsCreating(false);
      return;
    }

    Alert.alert('Discard draft?', 'Your person draft will be lost.', [
      { text: 'Keep editing', style: 'cancel' },
      {
        text: 'Discard',
        style: 'destructive',
        onPress: () => {
          setDraft(emptyDraft);
          setIsCreating(false);
        },
      },
    ]);
  };

  const handleSubmit = () => {
    if (!draft.name.trim()) {
      Alert.alert('Missing name', 'Please enter a person name before saving.');
      return;
    }

    setIsSubmitting(true);
    addPerson(draft);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsCreating(false);
      setDraft(emptyDraft);
    }, 150);
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert('Delete person', `Remove ${name}? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => removePerson(id),
      },
    ]);
  };

  const handleOpenPerson = (id: string) => {
    setSelectedPersonId(id);
    try {
      router.push({ pathname: '/person-memories', params: { personId: id } });
    } catch (error) {
      console.warn('Router push failed, using in-screen detail fallback', error);
    }
  };

  const selectedPerson = useMemo(
    () => people.find((person) => person.id === selectedPersonId) ?? null,
    [people, selectedPersonId],
  );

  const selectedEntries = useMemo(
    () => (selectedPerson ? getEntriesForPerson(selectedPerson.id) : []),
    [getEntriesForPerson, selectedPerson],
  );

  useEffect(() => {
    setPersonDescription(selectedPerson?.description ?? '');
  }, [selectedPerson?.id, selectedPerson?.description]);

  const handleCreateMemory = () => {
    setIsCreatingMemory(true);
    setMemoryDraft({
      title: '',
      body: '',
      type: 'voice',
      date: new Date().toISOString().slice(0, 10),
      location: '',
      taggedPeople: selectedPerson ? [selectedPerson.id] : [],
    });
  };

  const handleCancelMemory = () => {
    const hasDraftContent = memoryDraft.title.trim() || memoryDraft.body.trim() || memoryDraft.type !== 'voice';

    if (!hasDraftContent) {
      setIsCreatingMemory(false);
      return;
    }

    Alert.alert('Discard memory draft?', 'Your new memory will be lost.', [
      { text: 'Keep editing', style: 'cancel' },
      {
        text: 'Discard',
        style: 'destructive',
        onPress: () => {
          setMemoryDraft({
            title: '',
            body: '',
            type: 'voice',
            date: new Date().toISOString().slice(0, 10),
            location: '',
            taggedPeople: selectedPerson ? [selectedPerson.id] : [],
          });
          setIsCreatingMemory(false);
        },
      },
    ]);
  };

  const handleSaveMemory = () => {
    if (!selectedPerson) {
      return;
    }

    if (!memoryDraft.title.trim()) {
      Alert.alert('Missing title', 'Please add a title before saving your memory.');
      return;
    }

    setIsSubmittingMemory(true);
    addEntry(memoryDraft.taggedPeople.length > 0 ? memoryDraft.taggedPeople : selectedPerson.id, memoryDraft);

    setTimeout(() => {
      setIsSubmittingMemory(false);
      setIsCreatingMemory(false);
      setMemoryDraft({
        title: '',
        body: '',
        type: 'voice',
        date: new Date().toISOString().slice(0, 10),
        location: '',
        taggedPeople: [selectedPerson.id],
      });
    }, 150);
  };

  if (selectedPerson) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Pressable onPress={() => setSelectedPersonId(null)} style={styles.backButton}>
              <ThemedText type="smallBold" style={styles.backText}>Back</ThemedText>
            </Pressable>
            <ThemedText type="title" style={styles.title}>{selectedPerson.name}</ThemedText>
          </View>

          <View style={[styles.hero, { backgroundColor: selectedPerson.coverColor }]}>
            <ThemedText type="subtitle" style={styles.heroText}>{selectedPerson.type}</ThemedText>
            <ThemedText type="small" style={styles.heroText}>{selectedPerson.privacy}</ThemedText>
          </View>

          <View style={styles.detailSummary}>
            <TextInput
              value={personDescription}
              onChangeText={(text) => {
                const nextText = text.slice(0, PERSON_NOTE_LIMIT);
                setPersonDescription(nextText);
                updatePersonDescription(selectedPerson.id, nextText);
              }}
              placeholder="Add a note about this person"
              multiline
              maxLength={PERSON_NOTE_LIMIT}
              style={styles.descriptionInput}
              textAlignVertical="top"
            />
            <View style={styles.counterRow}>
              <ThemedText type="small" style={styles.counterText}>
                {personDescription.length}/{PERSON_NOTE_LIMIT}
              </ThemedText>
            </View>
          </View>

          <View style={styles.groupSection}>
            <ThemedText type="smallBold">Groups</ThemedText>
            <View style={styles.chipGroup}>
              {groups.map((group) => {
                const isSelected = (selectedPerson.groupIds ?? []).includes(group.id);

                return (
                  <Pressable
                    key={group.id}
                    onPress={() => togglePersonInGroup(selectedPerson.id, group.id)}
                    style={[styles.chip, isSelected && styles.chipSelected]}>
                    <ThemedText type="small" style={isSelected ? styles.chipTextSelected : undefined}>
                      {group.name}
                    </ThemedText>
                  </Pressable>
                );
              })}
            </View>
          </View>

          <View style={styles.actionRow}>
            <ThemedText type="smallBold">Memories</ThemedText>
            <Pressable onPress={handleCreateMemory} style={styles.addButton}>
              <ThemedText type="smallBold" style={styles.addText}>+ New memory</ThemedText>
            </Pressable>
          </View>

          {isCreatingMemory ? (
            <EntryForm
              draft={memoryDraft}
              onChange={setMemoryDraft}
              onSubmit={handleSaveMemory}
              onCancel={handleCancelMemory}
              isSubmitting={isSubmittingMemory}
              availablePeople={people}
              availableGroups={groups}
            />
          ) : (
            <FlatList
              data={selectedEntries}
              keyExtractor={(item) => item.id}
              contentContainerStyle={styles.list}
              renderItem={({ item }) => (
                <View style={styles.entryCard}>
                  <ThemedText type="smallBold">{item.title}</ThemedText>
                  <ThemedText type="small" style={styles.entryMeta}>
                    {item.type} • {new Date(item.createdAt).toLocaleDateString()}
                  </ThemedText>
                  <ThemedText type="small" style={styles.entryBody}>
                    {item.body || 'No story added yet.'}
                  </ThemedText>
                </View>
              )}
              ListEmptyComponent={
                <ThemedText type="small" style={styles.emptyState}>
                  No memories yet for this person.
                </ThemedText>
              }
            />
          )}
        </SafeAreaView>
      </ThemedView>
    );
  }

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <ThemedText type="title" style={styles.title}>People</ThemedText>
          <View style={styles.headerActions}>
            <Pressable onPress={() => setIsManagingGroups((current) => !current)} style={styles.secondaryButton}>
              <ThemedText type="smallBold" style={styles.secondaryButtonText}>Manage groups</ThemedText>
            </Pressable>
            <Pressable onPress={handleCreate} style={styles.createButton}>
              <ThemedText type="smallBold" style={styles.createButtonText}>+ New</ThemedText>
            </Pressable>
          </View>
        </View>

        {isManagingGroups ? (
          <View style={styles.groupManager}>
            <View style={styles.groupManagerHeader}>
              <ThemedText type="subtitle">Groups</ThemedText>
            </View>

            <View style={styles.groupCreateRow}>
              <TextInput
                value={newGroupName}
                onChangeText={setNewGroupName}
                placeholder="Add a new group"
                style={[styles.input, styles.groupInput]}
              />
              <Pressable onPress={handleAddGroup} disabled={!newGroupName.trim()} style={[styles.addGroupButton, !newGroupName.trim() && styles.addGroupButtonDisabled]}>
                <ThemedText type="smallBold" style={styles.addGroupText}>Add</ThemedText>
              </Pressable>
            </View>

            {groups.map((group) => (
              <View key={group.id} style={styles.groupBlock}>
                <View style={styles.groupRow}>
                  <View style={[styles.colorSwatch, { backgroundColor: group.color }]} />
                  <TextInput
                    value={group.name}
                    onChangeText={(value) => handleRenameGroup(group.id, value)}
                    style={styles.groupNameInput}
                  />
                  <Pressable onPress={() => handleDeleteGroup(group.id, group.name)} style={styles.deleteGroupButton}>
                    <ThemedText type="smallBold" style={styles.deleteGroupText}>Delete</ThemedText>
                  </Pressable>
                </View>

                <View style={styles.groupMetaRow}>
                  <ThemedText type="small" style={styles.metaText}>
                    {(group.personIds ?? []).length} member{(group.personIds ?? []).length === 1 ? '' : 's'}
                  </ThemedText>
                </View>

                <View style={styles.colorPickerRow}>
                  {['#7ab8ff', '#ff7a7a', '#7bdcb5', '#f7b267', '#8b7cf6', '#f472b6', '#facc15', '#34d399'].map((color) => (
                    <Pressable
                      key={color}
                      onPress={() => handleUpdateGroupColor(group.id, color)}
                      style={[
                        styles.colorOption,
                        { backgroundColor: color },
                        group.color === color && styles.colorOptionSelected,
                      ]}
                    />
                  ))}
                </View>

                <View style={styles.chipGroup}>
                  {people.map((person) => {
                    const isSelected = (group.personIds ?? []).includes(person.id);

                    return (
                      <Pressable
                        key={`${group.id}-${person.id}`}
                        onPress={() => togglePersonInGroup(person.id, group.id)}
                        style={[styles.chip, isSelected && styles.chipSelected]}>
                        <ThemedText type="small" style={isSelected ? styles.chipTextSelected : undefined}>
                          {person.name}
                        </ThemedText>
                      </Pressable>
                    );
                  })}
                </View>
              </View>
            ))}
          </View>
        ) : null}

        {isCreating ? (
          <View style={styles.createLayout}>
            <View style={styles.formHeader}>
              <Pressable onPress={() => setIsCreating(false)} style={styles.backButton}>
                <ThemedText type="smallBold" style={styles.backText}>Back</ThemedText>
              </Pressable>
              <ThemedText type="subtitle" style={styles.formTitle}>New person</ThemedText>
            </View>

            <PersonForm
              draft={draft}
              onChange={setDraft}
              onSubmit={handleSubmit}
              onCancel={handleCancelCreate}
              isSubmitting={isSubmitting}
              availableGroups={groups}
              onCreateGroup={(groupName) => {
                const trimmedName = groupName.trim();
                if (!trimmedName) {
                  return;
                }

                const duplicate = groups.some(
                  (group) => group.name.trim().toLowerCase() === trimmedName.toLowerCase(),
                );

                if (duplicate) {
                  return;
                }

                return addGroup({ name: trimmedName, color: '#7ab8ff' });
              }}
            />
          </View>
        ) : (
          <FlatList
            data={people}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <PersonCard
                person={item}
                groups={groups}
                onPress={() => handleOpenPerson(item.id)}
                onDelete={() => handleDelete(item.id, item.name)}
              />
            )}
            ListEmptyComponent={
              <ThemedText type="small" style={styles.emptyState}>
                No people yet. Create your first one.
              </ThemedText>
            }
          />
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
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  title: {
    fontSize: 38,
    lineHeight: 42,
  },
  createButton: {
    backgroundColor: '#111827',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 999,
  },
  secondaryButton: {
    backgroundColor: '#eef2ff',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 999,
  },
  secondaryButtonText: {
    color: '#1f2937',
  },
  createButtonText: {
    color: '#fff',
  },
  groupManager: {
    gap: Spacing.three,
    marginBottom: Spacing.three,
    padding: Spacing.three,
    borderRadius: 18,
    backgroundColor: '#f3f4f6',
  },
  groupManagerHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  groupCreateRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    alignItems: 'center',
  },
  groupInput: {
    flex: 1,
  },
  input: {
    borderWidth: 1,
    borderColor: '#dfe3ea',
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  addGroupButton: {
    backgroundColor: '#111827',
    borderRadius: 10,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  addGroupButtonDisabled: {
    opacity: 0.5,
  },
  addGroupText: {
    color: '#fff',
  },
  groupRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
  },
  groupBlock: {
    gap: Spacing.two,
  },
  groupNameInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#dfe3ea',
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    backgroundColor: '#fff',
    fontSize: 16,
  },
  colorSwatch: {
    width: 18,
    height: 18,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: '#fff',
  },
  groupMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaText: {
    opacity: 0.7,
  },
  colorPickerRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  colorOption: {
    width: 24,
    height: 24,
    borderRadius: 999,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  colorOptionSelected: {
    borderColor: '#111827',
  },
  deleteGroupButton: {
    backgroundColor: '#fee2e2',
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.two,
    borderRadius: 10,
  },
  deleteGroupText: {
    color: '#b91c1c',
  },
  groupSection: {
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  chip: {
    backgroundColor: '#f0f1f4',
    borderRadius: 999,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
  },
  chipSelected: {
    backgroundColor: '#111827',
  },
  chipTextSelected: {
    color: '#fff',
    textTransform: 'capitalize',
  },
  createLayout: {
    flex: 1,
  },
  formHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.two,
  },
  formTitle: {
    fontSize: 26,
    lineHeight: 30,
  },
  backButton: {
    paddingVertical: Spacing.one,
  },
  backText: {
    color: '#3c87f7',
  },
  hero: {
    borderRadius: 16,
    padding: Spacing.three,
    marginBottom: Spacing.three,
  },
  heroText: {
    color: '#fff',
    textTransform: 'capitalize',
  },
  detailSummary: {
    backgroundColor: '#f3f4f6',
    borderRadius: 14,
    padding: Spacing.three,
    marginBottom: Spacing.three,
  },
  descriptionInput: {
    minHeight: 86,
    fontSize: 15,
    color: '#111827',
    lineHeight: 22,
    padding: 0,
  },
  counterRow: {
    marginTop: Spacing.two,
    alignItems: 'flex-end',
  },
  counterText: {
    opacity: 0.7,
    fontSize: 12,
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.two,
  },
  addButton: {
    backgroundColor: '#111827',
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderRadius: 999,
  },
  addText: {
    color: '#fff',
  },
  entryCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    padding: Spacing.three,
    gap: Spacing.one,
    marginBottom: Spacing.three,
  },
  entryMeta: {
    opacity: 0.7,
    textTransform: 'capitalize',
  },
  entryBody: {
    opacity: 0.8,
  },
  list: {
    gap: Spacing.three,
    paddingBottom: Spacing.six,
  },
  emptyState: {
    textAlign: 'center',
    marginTop: Spacing.five,
    opacity: 0.7,
  },
});
