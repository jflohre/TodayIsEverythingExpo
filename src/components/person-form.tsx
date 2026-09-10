import { useState } from 'react';
import { Pressable, ScrollView, StyleSheet, TextInput, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import { Group } from '@/types/group';
import { PersonDraft, PersonPrivacy, PersonType } from '@/types/person';

const personTypes: PersonType[] = ['child', 'spouse', 'parent', 'pet', 'family'];
const privacyLevels: PersonPrivacy[] = ['private', 'family-only', 'shared'];
const personTypeLabels: Record<PersonType, string> = {
  child: 'Child',
  spouse: 'Spouse',
  parent: 'Parent',
  pet: 'Pet',
  family: 'Family',
};
const privacyLabels: Record<PersonPrivacy, string> = {
  private: 'Private',
  'family-only': 'Family Only',
  shared: 'Shared',
};

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
        <ThemedText type="smallBold" style={styles.sectionLabel}>Person name</ThemedText>
        <TextInput
          value={draft.name}
          onChangeText={(value) => onChange({ ...draft, name: value })}
          placeholder="e.g. Emma, Dad, Family Stories"
          placeholderTextColor="#a9b6bf"
          selectionColor="#7bd7e9"
          style={styles.input}
        />
      </View>

      <View style={styles.fieldGroup}>
        <ThemedText type="smallBold" style={styles.sectionLabel}>Who is this for?</ThemedText>
        <View style={styles.chipGroup}>
          {personTypes.map((type) => (
            <Pressable
              key={type}
              onPress={() => onChange({ ...draft, type })}
              style={[styles.chip, draft.type === type && styles.chipSelected]}>
              <ThemedText type="small" style={draft.type === type ? styles.chipTextSelected : styles.chipText}>
                {personTypeLabels[type]}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.fieldGroup}>
        <ThemedText type="smallBold" style={styles.sectionLabel}>Privacy</ThemedText>
        <View style={styles.chipGroup}>
          {privacyLevels.map((level) => (
            <Pressable
              key={level}
              onPress={() => onChange({ ...draft, privacy: level })}
              style={[styles.chip, draft.privacy === level && styles.chipSelected]}>
              <ThemedText type="small" style={draft.privacy === level ? styles.chipTextSelected : styles.chipText}>
                {privacyLabels[level]}
              </ThemedText>
            </Pressable>
          ))}
        </View>
      </View>

      <View style={styles.fieldGroup}>
        <ThemedText type="smallBold" style={styles.sectionLabel}>Groups</ThemedText>

        {onCreateGroup ? (
          <View style={styles.groupCreateRow}>
            <TextInput
              value={newGroupName}
              onChangeText={setNewGroupName}
              placeholder="Add new group"
              placeholderTextColor="#a9b6bf"
              selectionColor="#7bd7e9"
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
                  <ThemedText type="small" style={isSelected ? styles.chipTextSelected : styles.chipText}>
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
        <ThemedText type="smallBold" style={styles.sectionLabel}>Short description</ThemedText>
        <TextInput
          value={draft.description}
          onChangeText={(value) => onChange({ ...draft, description: value })}
          placeholder="Family moments, milestones, and stories to remember."
          placeholderTextColor="#a9b6bf"
          selectionColor="#7bd7e9"
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
    backgroundColor: palette.brand,
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
    opacity: 0.8,
    color: '#dfe8ec',
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
  submitText: {
    color: '#fff',
  },
});
