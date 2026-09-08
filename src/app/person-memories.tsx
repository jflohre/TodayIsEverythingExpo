import { useLocalSearchParams, useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, FlatList, Modal, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EntryForm } from '@/components/entry-form';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useEntries } from '@/context/EntryContext';
import { usePerson } from '@/context/PersonContext';
import { EntryDraft } from '@/types/entries';

function formatDisplayDate(value: string) {
  if (!value) {
    return 'Date not set';
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

const emptyDraft: EntryDraft = {
  title: '',
  body: '',
  type: 'voice',
  date: new Date().toISOString().slice(0, 10),
  location: '',
  taggedPeople: [],
};

export default function PersonMemoriesScreen() {
  const router = useRouter();
  const params = useLocalSearchParams<{ personId?: string }>();
  const { people } = usePerson();
  const { addEntry, getEntriesForPerson, removeEntry } = useEntries();
  const person = useMemo(
    () => people.find((item) => item.id === params.personId),
    [people, params.personId],
  );
  const [isCreating, setIsCreating] = useState(false);
  const [showTypePicker, setShowTypePicker] = useState(false);
  const [draft, setDraft] = useState<EntryDraft>({
    ...emptyDraft,
    taggedPeople: person ? [person.id] : [],
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const entries = useMemo(
    () => (person ? getEntriesForPerson(person.id) : []),
    [getEntriesForPerson, person],
  );

  if (!person) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <ThemedText type="subtitle">Person not found</ThemedText>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ThemedText type="smallBold" style={styles.backText}>Back</ThemedText>
          </Pressable>
        </SafeAreaView>
      </ThemedView>
    );
  }

  const handleCancelCreateEntry = () => {
    const hasDraftContent = draft.title.trim() || draft.body.trim() || draft.type !== 'voice';

    if (!hasDraftContent) {
      setIsCreating(false);
      return;
    }

    Alert.alert('Discard draft?', 'Your memory draft will be lost.', [
      { text: 'Keep editing', style: 'cancel' },
      {
        text: 'Discard',
        style: 'destructive',
        onPress: () => {
          setDraft({ ...emptyDraft, taggedPeople: person ? [person.id] : [] });
          setIsCreating(false);
        },
      },
    ]);
  };

  const openEntryTypePicker = () => {
    setShowTypePicker(true);
  };

  const selectEntryType = (type: EntryDraft['type']) => {
    setDraft({ ...emptyDraft, type, taggedPeople: person ? [person.id] : [] });
    setShowTypePicker(false);
    setIsCreating(true);
  };

  const handleCreateEntry = () => {
    if (!draft.title.trim()) {
      Alert.alert('Missing title', 'Please add a title before saving your memory.');
      return;
    }

    setIsSubmitting(true);
    addEntry(draft.taggedPeople.length > 0 ? draft.taggedPeople : person.id, draft);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsCreating(false);
      setDraft({
        ...emptyDraft,
        date: new Date().toISOString().slice(0, 10),
        taggedPeople: [person.id],
      });
    }, 150);
  };

  const handleDeleteEntry = (entryId: string, title: string) => {
    Alert.alert('Delete memory', `Remove “${title}”?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => removeEntry(entryId),
      },
    ]);
  };

  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.header}>
          <Pressable onPress={() => router.back()} style={styles.backButton}>
            <ThemedText type="smallBold" style={styles.backText}>Back</ThemedText>
          </Pressable>
          <ThemedText type="title" style={styles.title}>{person.name}</ThemedText>
        </View>

        <View style={[styles.hero, { backgroundColor: person.coverColor }]}>
          <ThemedText type="subtitle" style={styles.heroText}>{person.type}</ThemedText>
          <ThemedText type="small" style={styles.heroText}>{person.privacy}</ThemedText>
        </View>

        <View style={styles.actionRow}>
          <ThemedText type="smallBold">Memories</ThemedText>
          <Pressable onPress={openEntryTypePicker} style={styles.addButton}>
            <ThemedText type="smallBold" style={styles.addText}>+ Add</ThemedText>
          </Pressable>
        </View>

        <Modal
          visible={showTypePicker}
          transparent
          animationType="fade"
          onRequestClose={() => setShowTypePicker(false)}>
          <Pressable style={styles.modalOverlay} onPress={() => setShowTypePicker(false)}>
            <Pressable style={styles.modalCard} onPress={() => undefined}>
              <ThemedText type="subtitle" style={styles.modalTitle}>Add a memory</ThemedText>

              {(['voice', 'text', 'video', 'photo'] as const).map((type) => (
                <Pressable key={type} onPress={() => selectEntryType(type)} style={styles.optionButton}>
                  <ThemedText type="smallBold" style={styles.optionText}>{type}</ThemedText>
                </Pressable>
              ))}

              <Pressable onPress={() => setShowTypePicker(false)} style={styles.modalCancelButton}>
                <ThemedText type="smallBold" style={styles.modalCancelText}>Cancel</ThemedText>
              </Pressable>
            </Pressable>
          </Pressable>
        </Modal>

        {isCreating ? (
          <EntryForm
            draft={draft}
            onChange={setDraft}
            onSubmit={handleCreateEntry}
            onCancel={handleCancelCreateEntry}
            isSubmitting={isSubmitting}
            availablePeople={people}
          />
        ) : (
          <FlatList
            data={entries}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <View style={styles.entryCard}>
                <View style={styles.entryTopRow}>
                  <ThemedText type="smallBold">{item.title}</ThemedText>
                  <Pressable onPress={() => handleDeleteEntry(item.id, item.title)}>
                    <ThemedText type="small" style={styles.deleteText}>Delete</ThemedText>
                  </Pressable>
                </View>

                <ThemedText type="small" style={styles.entryMeta}>
                  {item.type} • {item.date ? formatDisplayDate(item.date) : new Date(item.createdAt).toLocaleDateString()}
                </ThemedText>

                {item.location ? (
                  <ThemedText type="small" style={styles.entryLocation}>
                    {item.location}
                  </ThemedText>
                ) : null}

                <ThemedText type="small" style={styles.entryBody}>
                  {item.body || 'No story added yet.'}
                </ThemedText>
              </View>
            )}
            ListEmptyComponent={
              <ThemedText type="small" style={styles.emptyState}>
                No memories yet. Create your first one.
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
    gap: Spacing.two,
    marginBottom: Spacing.three,
  },
  title: {
    fontSize: 30,
    lineHeight: 34,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: Spacing.one,
  },
  backText: {
    color: '#3c87f7',
  },
  hero: {
    borderRadius: 16,
    padding: Spacing.three,
    marginBottom: Spacing.four,
  },
  heroText: {
    color: '#fff',
    textTransform: 'capitalize',
  },
  actionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.three,
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
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.45)',
    justifyContent: 'center',
    padding: Spacing.four,
  },
  modalCard: {
    backgroundColor: '#fff',
    borderRadius: 18,
    padding: Spacing.four,
    gap: Spacing.two,
  },
  modalTitle: {
    marginBottom: Spacing.one,
  },
  optionButton: {
    paddingVertical: Spacing.two,
    paddingHorizontal: Spacing.three,
    borderRadius: 12,
    backgroundColor: '#f3f4f6',
  },
  optionText: {
    textTransform: 'capitalize',
  },
  modalCancelButton: {
    alignItems: 'center',
    paddingTop: Spacing.two,
  },
  modalCancelText: {
    color: '#3c87f7',
  },
  list: {
    gap: Spacing.three,
    paddingBottom: Spacing.six,
  },
  entryCard: {
    backgroundColor: '#f5f5f5',
    borderRadius: 16,
    padding: Spacing.three,
    gap: Spacing.one,
  },
  entryTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
  },
  entryMeta: {
    opacity: 0.7,
    textTransform: 'capitalize',
  },
  entryLocation: {
    opacity: 0.7,
  },
  entryBody: {
    opacity: 0.8,
  },
  deleteText: {
    color: '#d93c43',
  },
  emptyState: {
    textAlign: 'center',
    marginTop: Spacing.five,
    opacity: 0.7,
  },
});
