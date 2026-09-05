import { useRouter } from 'expo-router';
import { useMemo, useState } from 'react';
import { Alert, FlatList, Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { EntryDraft, EntryForm } from '@/components/entry-form';
import { JournalCard } from '@/components/journal-card';
import { JournalForm } from '@/components/journal-form';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Spacing } from '@/constants/theme';
import { useEntries } from '@/context/EntryContext';
import { useJournal } from '@/context/JournalContext';
import { JournalDraft } from '@/types/journal';

const emptyDraft: JournalDraft = {
  name: '',
  type: 'family',
  privacy: 'private',
  description: '',
};

export default function JournalsScreen() {
  const router = useRouter();
  const { journals, addJournal, removeJournal } = useJournal();
  const { getEntriesForJournal, addEntry } = useEntries();
  const [isCreating, setIsCreating] = useState(false);
  const [selectedJournalId, setSelectedJournalId] = useState<string | null>(null);
  const [draft, setDraft] = useState<JournalDraft>(emptyDraft);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isCreatingMemory, setIsCreatingMemory] = useState(false);
  const [memoryDraft, setMemoryDraft] = useState<EntryDraft>({
    title: '',
    body: '',
    type: 'voice',
    date: new Date().toISOString().slice(0, 10),
    location: '',
  });
  const [isSubmittingMemory, setIsSubmittingMemory] = useState(false);

  const handleCreate = () => {
    setIsCreating(true);
    setDraft(emptyDraft);
  };

  const handleCancelCreate = () => {
    const hasDraftContent =
      draft.name.trim() || draft.description.trim() || draft.type !== 'family' || draft.privacy !== 'private';

    if (!hasDraftContent) {
      setIsCreating(false);
      return;
    }

    Alert.alert('Discard draft?', 'Your journal draft will be lost.', [
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
      Alert.alert('Missing name', 'Please enter a journal name before saving.');
      return;
    }

    setIsSubmitting(true);
    addJournal(draft);

    setTimeout(() => {
      setIsSubmitting(false);
      setIsCreating(false);
      setDraft(emptyDraft);
    }, 150);
  };

  const handleDelete = (id: string, name: string) => {
    Alert.alert('Delete journal', `Remove ${name}? This cannot be undone.`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: () => removeJournal(id),
      },
    ]);
  };

  const handleOpenJournal = (id: string) => {
    console.log('Opening journal', id);
    setSelectedJournalId(id);
    try {
      router.push({ pathname: '/journal-detail', params: { journalId: id } });
    } catch (error) {
      console.warn('Router push failed, using in-screen detail fallback', error);
    }
  };

  const selectedJournal = useMemo(
    () => journals.find((journal) => journal.id === selectedJournalId) ?? null,
    [journals, selectedJournalId],
  );

  const selectedEntries = useMemo(
    () => (selectedJournal ? getEntriesForJournal(selectedJournal.id) : []),
    [getEntriesForJournal, selectedJournal],
  );

  const handleCreateMemory = () => {
    setIsCreatingMemory(true);
    setMemoryDraft({
      title: '',
      body: '',
      type: 'voice',
      date: new Date().toISOString().slice(0, 10),
      location: '',
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
          });
          setIsCreatingMemory(false);
        },
      },
    ]);
  };

  const handleSaveMemory = () => {
    if (!selectedJournal) {
      return;
    }

    if (!memoryDraft.title.trim()) {
      Alert.alert('Missing title', 'Please add a title before saving your memory.');
      return;
    }

    setIsSubmittingMemory(true);
    addEntry(selectedJournal.id, memoryDraft);

    setTimeout(() => {
      setIsSubmittingMemory(false);
      setIsCreatingMemory(false);
      setMemoryDraft({
        title: '',
        body: '',
        type: 'voice',
        date: new Date().toISOString().slice(0, 10),
        location: '',
      });
    }, 150);
  };

  if (selectedJournal) {
    return (
      <ThemedView style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
          <View style={styles.header}>
            <Pressable onPress={() => setSelectedJournalId(null)} style={styles.backButton}>
              <ThemedText type="smallBold" style={styles.backText}>Back</ThemedText>
            </Pressable>
            <ThemedText type="title" style={styles.title}>{selectedJournal.name}</ThemedText>
          </View>

          <View style={[styles.hero, { backgroundColor: selectedJournal.coverColor }]}>
            <ThemedText type="subtitle" style={styles.heroText}>{selectedJournal.type}</ThemedText>
            <ThemedText type="small" style={styles.heroText}>{selectedJournal.privacy}</ThemedText>
          </View>

          <View style={styles.detailSummary}>
            <ThemedText type="small">{selectedJournal.description || 'No description yet.'}</ThemedText>
          </View>

          <View style={styles.actionRow}>
            <ThemedText type="smallBold">Entries</ThemedText>
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
                  No memories yet for this journal.
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
          <ThemedText type="title" style={styles.title}>Journals</ThemedText>
          <Pressable onPress={handleCreate} style={styles.createButton}>
            <ThemedText type="smallBold" style={styles.createButtonText}>+ New</ThemedText>
          </Pressable>
        </View>

        {isCreating ? (
          <View style={styles.createLayout}>
            <View style={styles.formHeader}>
              <Pressable onPress={() => setIsCreating(false)} style={styles.backButton}>
                <ThemedText type="smallBold" style={styles.backText}>Back</ThemedText>
              </Pressable>
              <ThemedText type="subtitle" style={styles.formTitle}>New journal</ThemedText>
            </View>

            <JournalForm
              draft={draft}
              onChange={setDraft}
              onSubmit={handleSubmit}
              onCancel={handleCancelCreate}
              isSubmitting={isSubmitting}
            />
          </View>
        ) : (
          <FlatList
            data={journals}
            keyExtractor={(item) => item.id}
            contentContainerStyle={styles.list}
            renderItem={({ item }) => (
              <JournalCard
                journal={item}
                onPress={() => handleOpenJournal(item.id)}
                onDelete={() => handleDelete(item.id, item.name)}
              />
            )}
            ListEmptyComponent={
              <ThemedText type="small" style={styles.emptyState}>
                No journals yet. Create your first one.
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
  createButtonText: {
    color: '#fff',
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
