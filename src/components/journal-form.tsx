import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { JournalDraft, JournalPrivacy, JournalType } from '@/types/journal';

const journalTypes: JournalType[] = ['child', 'spouse', 'parent', 'pet', 'family'];
const privacyLevels: JournalPrivacy[] = ['private', 'family-only', 'shared'];

export function JournalForm({
  draft,
  onChange,
  onSubmit,
  onCancel,
  isSubmitting,
}: {
  draft: JournalDraft;
  onChange: (next: JournalDraft) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  isSubmitting: boolean;
}) {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      {onCancel && (
        <Pressable onPress={onCancel} style={styles.backButton}>
          <ThemedText type="smallBold" style={styles.backText}>Back</ThemedText>
        </Pressable>
      )}

      <View style={styles.fieldGroup}>
        <ThemedText type="smallBold">Journal name</ThemedText>
        <TextInput
          value={draft.name}
          onChangeText={(value) => onChange({ ...draft, name: value })}
          placeholder="e.g. Emma, Dad, Family Stories"
          style={styles.input}
        />
      </View>

      <View style={styles.fieldGroup}>
        <ThemedText type="smallBold">Who is this for?</ThemedText>
        <View style={styles.chipGroup}>
          {journalTypes.map((type) => (
            <Pressable
              key={type}
              onPress={() => onChange({ ...draft, type })}
              style={[styles.chip, draft.type === type && styles.chipSelected]}>
              <ThemedText type="small" style={draft.type === type ? styles.chipTextSelected : undefined}>
                {type}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.fieldGroup}>
        <ThemedText type="smallBold">Privacy</ThemedText>
        <View style={styles.chipGroup}>
          {privacyLevels.map((level) => (
            <Pressable
              key={level}
              onPress={() => onChange({ ...draft, privacy: level })}
              style={[styles.chip, draft.privacy === level && styles.chipSelected]}>
              <ThemedText type="small" style={draft.privacy === level ? styles.chipTextSelected : undefined}>
                {level}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.fieldGroup}>
        <ThemedText type="smallBold">Short description</ThemedText>
        <TextInput
          value={draft.description}
          onChangeText={(value) => onChange({ ...draft, description: value })}
          placeholder="Family moments, milestones, and stories to remember."
          multiline
          numberOfLines={4}
          style={[styles.input, styles.textArea]}
        />
      </View>

      <Pressable onPress={onSubmit} disabled={isSubmitting || !draft.name.trim()} style={styles.submitButton}>
        <ThemedText type="smallBold" style={styles.submitText}>
          {isSubmitting ? 'Saving...' : 'Create journal'}
        </ThemedText>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: Spacing.four,
    padding: Spacing.four,
    paddingBottom: Spacing.six,
  },
  backButton: {
    alignSelf: 'flex-start',
    paddingVertical: Spacing.one,
  },
  backText: {
    color: '#3c87f7',
  },
  fieldGroup: {
    gap: Spacing.two,
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
  textArea: {
    minHeight: 110,
    textAlignVertical: 'top',
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
  submitButton: {
    marginTop: Spacing.two,
    backgroundColor: '#111827',
    borderRadius: 14,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  submitText: {
    color: '#fff',
  },
});
