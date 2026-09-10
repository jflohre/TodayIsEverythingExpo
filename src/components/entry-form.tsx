import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import { EntryDraft, EntryKind } from '@/types/entries';
import { Group } from '@/types/group';
import { Person } from '@/types/person';

let DateTimePicker: any = null;

try {
  DateTimePicker = require('@react-native-community/datetimepicker').default;
} catch {
  DateTimePicker = null;
}

const entryTypes: EntryKind[] = ['voice', 'text', 'video', 'photo'];
const entryTypeLabels: Record<EntryKind, string> = {
  voice: 'Voice',
  text: 'Text',
  video: 'Video',
  photo: 'Photo',
};

function formatDisplayDate(value: string) {
  if (!value) {
    return 'Select a date';
  }

  const parsed = new Date(`${value}T12:00:00`);
  if (Number.isNaN(parsed.getTime())) {
    return value;
  }

  return parsed.toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  });
}

function getTodayDateString() {
  const now = new Date();
  const local = new Date(now.getTime() - now.getTimezoneOffset() * 60000);
  return local.toISOString().slice(0, 10);
}

export function EntryForm({
  draft,
  onChange,
  onSubmit,
  onCancel,
  isSubmitting,
  availablePeople = [],
  availableGroups = [],
}: {
  draft: EntryDraft;
  onChange: (next: EntryDraft) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  isSubmitting: boolean;
  availablePeople?: Person[];
  availableGroups?: Group[];
}) {
  const [showDatePicker, setShowDatePicker] = useState(false);
  const dateValue = draft.date ? new Date(`${draft.date}T12:00:00`) : new Date();

  const toggleTaggedPerson = (personId: string) => {
    const taggedPeople = draft.taggedPeople.includes(personId)
      ? draft.taggedPeople.filter((id) => id !== personId)
      : [...draft.taggedPeople, personId];

    onChange({
      ...draft,
      taggedPeople,
    });
  };

  const toggleTaggedGroup = (groupId: string) => {
    const taggedGroups = draft.taggedGroups ?? [];
    const nextGroups = taggedGroups.includes(groupId)
      ? taggedGroups.filter((id) => id !== groupId)
      : [...taggedGroups, groupId];

    onChange({
      ...draft,
      taggedGroups: nextGroups,
    });
  };

  const handleDateChange = (_event: unknown, selectedDate?: Date) => {
    if (!selectedDate) {
      setShowDatePicker(false);
      return;
    }

    const nextDate = new Date(selectedDate.getTime() - selectedDate.getTimezoneOffset() * 60000)
      .toISOString()
      .slice(0, 10);

    onChange({
      ...draft,
      date: nextDate,
    });
    setShowDatePicker(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {onCancel && (
        <Pressable onPress={onCancel} style={styles.backButton}>
          <ThemedText type="smallBold" style={styles.backText}>Back</ThemedText>
        </Pressable>
      )}

      <View style={styles.fieldGroup}>
        <ThemedText type="smallBold" style={styles.sectionLabel}>Memory title</ThemedText>
        <TextInput
          value={draft.title}
          onChangeText={(value) => onChange({ ...draft, title: value })}
          placeholder="Playground laugh, first steps, family dinner"
          placeholderTextColor="#a9b6bf"
          style={styles.input}
        />
      </View>

      <View style={styles.fieldGroup}>
        <ThemedText type="smallBold" style={styles.sectionLabel}>Entry type</ThemedText>
        <View style={styles.chipGroup}>
          {entryTypes.map((type) => (
            <Pressable
              key={type}
              onPress={() => onChange({ ...draft, type })}
              style={[styles.chip, draft.type === type && styles.chipSelected]}>
              <ThemedText type="small" style={draft.type === type ? styles.chipTextSelected : styles.chipText}>
                {entryTypeLabels[type]}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </View>

      {availableGroups.length > 0 ? (
        <View style={styles.fieldGroup}>
          <ThemedText type="smallBold" style={styles.sectionLabel}>Tagged groups</ThemedText>
          <View style={styles.chipGroup}>
            {availableGroups.map((group) => {
              const isSelected = (draft.taggedGroups ?? []).includes(group.id);

              return (
                <Pressable
                  key={group.id}
                  onPress={() => toggleTaggedGroup(group.id)}
                  style={[styles.chip, isSelected && styles.chipSelected]}>
                  <ThemedText type="small" style={isSelected ? styles.chipTextSelected : styles.chipText}>
                    {group.name}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        </View>
      ) : null}

      {availablePeople.length > 0 ? (
        <View style={styles.fieldGroup}>
          <ThemedText type="smallBold" style={styles.sectionLabel}>Tagged people</ThemedText>
          <View style={styles.chipGroup}>
            {availablePeople.map((person) => {
              const isSelected = draft.taggedPeople.includes(person.id);

              return (
                <Pressable
                  key={person.id}
                  onPress={() => toggleTaggedPerson(person.id)}
                  style={[styles.chip, isSelected && styles.chipSelected]}>
                  <ThemedText type="small" style={isSelected ? styles.chipTextSelected : styles.chipText}>
                    {person.name}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        </View>
      ) : null}

      <View style={styles.fieldGroup}>
        <ThemedText type="smallBold" style={styles.sectionLabel}>Date</ThemedText>

        {DateTimePicker ? (
          <>
            <Pressable onPress={() => setShowDatePicker(true)} style={styles.dateContainer}>
              <ThemedText type="small" style={styles.dateText}>
                {formatDisplayDate(draft.date || getTodayDateString())}
              </ThemedText>
            </Pressable>

            {showDatePicker ? (
              <DateTimePicker
                value={dateValue}
                mode="date"
                display="default"
                onChange={handleDateChange}
              />
            ) : null}
          </>
        ) : (
          <TextInput
            value={draft.date || getTodayDateString()}
            onChangeText={(value) => onChange({ ...draft, date: value })}
            placeholder="YYYY-MM-DD"
            placeholderTextColor="#a9b6bf"
            style={styles.input}
            autoCapitalize="none"
          />
        )}
      </View>

      <View style={styles.fieldGroup}>
        <ThemedText type="smallBold" style={styles.sectionLabel}>Location</ThemedText>
        <TextInput
          value={draft.location}
          onChangeText={(value) => onChange({ ...draft, location: value })}
          placeholder="Where did this memory occur?"
          placeholderTextColor="#a9b6bf"
          style={[styles.input, styles.locationInput]}
        />
      </View>

      <View style={styles.fieldGroup}>
        <ThemedText type="smallBold" style={styles.sectionLabel}>Story</ThemedText>
        <TextInput
          value={draft.body}
          onChangeText={(value) => onChange({ ...draft, body: value })}
          placeholder="What made this moment special?"
          placeholderTextColor="#a9b6bf"
          multiline
          numberOfLines={6}
          style={[styles.input, styles.textArea]}
        />
      </View>

      <Pressable
        onPress={onSubmit}
        disabled={isSubmitting || !draft.title.trim()}
        style={[styles.submitButton, (!draft.title.trim() || isSubmitting) && styles.submitButtonDisabled]}>
        <ThemedText type="smallBold" style={styles.submitText}>
          {isSubmitting ? 'Saving...' : 'Save memory'}
        </ThemedText>
      </Pressable>
    </ScrollView>
  );
}

const palette = Colors.light;

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
    color: palette.brandSoft,
  },
  fieldGroup: {
    gap: Spacing.two,
  },
  sectionLabel: {
    color: '#edf2f5',
  },
  input: {
    borderWidth: 1,
    borderColor: '#46525b',
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    backgroundColor: '#1f272d',
    fontSize: 16,
    color: '#edf2f5',
  },
  locationInput: {
    color: '#edf2f5',
  },
  dateContainer: {
    borderWidth: 1,
    borderColor: '#46525b',
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    backgroundColor: '#1f272d',
  },
  dateText: {
    color: '#edf2f5',
  },
  textArea: {
    minHeight: 130,
    textAlignVertical: 'top',
  },
  chipGroup: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: Spacing.two,
  },
  chip: {
    backgroundColor: '#2d363d',
    borderRadius: 999,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderWidth: 1,
    borderColor: '#46525b',
    minWidth: 104,
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  },
  chipSelected: {
    backgroundColor: palette.brand,
    borderColor: palette.brand,
  },
  chipText: {
    color: '#dfe8ec',
    textTransform: 'capitalize',
  },
  chipTextSelected: {
    color: '#fff',
    textTransform: 'capitalize',
  },
  submitButton: {
    marginTop: Spacing.two,
    backgroundColor: palette.brand,
    borderRadius: 14,
    paddingVertical: Spacing.three,
    alignItems: 'center',
  },
  submitButtonDisabled: {
    opacity: 0.5,
  },
  submitText: {
    color: '#fff',
  },
});
