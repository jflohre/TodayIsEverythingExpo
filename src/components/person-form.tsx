import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { Group } from '@/types/group';
import { PersonDraft, PersonPrivacy, PersonType } from '@/types/person';

const personTypes: PersonType[] = ['child', 'spouse', 'parent', 'pet', 'family'];
const privacyLevels: PersonPrivacy[] = ['private', 'family-only', 'shared'];

export function PersonForm({
  draft,
  onChange,
  onSubmit,
  onCancel,
  isSubmitting,
  availableGroups = [],
  onCreateGroup,
}: {
  draft: PersonDraft;
  onChange: (next: PersonDraft) => void;
  onSubmit: () => void;
  onCancel?: () => void;
  isSubmitting: boolean;
  availableGroups?: Group[];
  onCreateGroup?: (groupName: string) => Group | void;
}) {
  const [newGroupName, setNewGroupName] = useState('');

  const handleCreateGroup = () => {
    const trimmedName = newGroupName.trim();
    if (!trimmedName || !onCreateGroup) {
      return;
    }

    const createdGroup = onCreateGroup(trimmedName);
    const createdGroupId = createdGroup?.id ?? availableGroups.find((group) => group.name.toLowerCase() === trimmedName.toLowerCase())?.id;

    if (createdGroupId) {
      const nextGroupIds = (draft.groupIds ?? []).includes(createdGroupId)
        ? draft.groupIds ?? []
        : [...(draft.groupIds ?? []), createdGroupId];

      onChange({ ...draft, groupIds: nextGroupIds });
    }

    setNewGroupName('');
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {onCancel && (
        <Pressable onPress={onCancel} style={styles.backButton}>
          <ThemedText type="smallBold" style={styles.backText}>Back</ThemedText>
        </Pressable>
      )}

      <View style={styles.fieldGroup}>
        <ThemedText type="smallBold">Person name</ThemedText>
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
          {personTypes.map((type) => (
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
        <ThemedText type="smallBold">Groups</ThemedText>

        {onCreateGroup ? (
          <View style={styles.groupCreateRow}>
            <TextInput
              value={newGroupName}
              onChangeText={setNewGroupName}
              placeholder="Add new group"
              style={[styles.input, styles.groupInput]}
            />
            <Pressable onPress={handleCreateGroup} disabled={!newGroupName.trim()} style={[styles.addGroupButton, !newGroupName.trim() && styles.addGroupButtonDisabled]}>
              <ThemedText type="smallBold" style={styles.addGroupText}>Add</ThemedText>
            </Pressable>
          </View>
        ) : null}

        {availableGroups.length > 0 ? (
          <View style={styles.chipGroup}>
            {availableGroups.map((group) => {
              const isSelected = (draft.groupIds ?? []).includes(group.id);

              return (
                <Pressable
                  key={group.id}
                  onPress={() => {
                    const nextGroupIds = (draft.groupIds ?? []).includes(group.id)
                      ? (draft.groupIds ?? []).filter((id) => id !== group.id)
                      : [...(draft.groupIds ?? []), group.id];

                    onChange({ ...draft, groupIds: nextGroupIds });
                  }}
                  style={[styles.chip, isSelected && styles.chipSelected]}>
                  <ThemedText type="small" style={isSelected ? styles.chipTextSelected : undefined}>
                    {group.name}
                  </ThemedText>
                </Pressable>
              );
            })}
          </View>
        ) : (
          <ThemedText type="small" style={styles.helperText}>No groups yet. Add one above.</ThemedText>
        )}
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
          {isSubmitting ? 'Saving...' : 'Create person'}
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
  groupCreateRow: {
    flexDirection: 'row',
    gap: Spacing.two,
    alignItems: 'center',
  },
  groupInput: {
    flex: 1,
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
  helperText: {
    opacity: 0.7,
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
