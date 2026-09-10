import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';
import { Group } from '@/types/group';
import { Person } from '@/types/person';

export function PersonCard({
  person,
  groups = [],
  onPress,
  onDelete,
}: {
  person: Person;
  groups?: Group[];
  onPress?: () => void;
  onDelete?: () => void;
}) {
  const groupedMemberships = (person.groupIds ?? [])
    .map((groupId) => groups.find((group) => group.id === groupId))
    .filter(Boolean) as Group[];
  const groupNames = groupedMemberships.map((group) => group.name).join(', ');

  return (
    <View style={styles.card}>
      <Pressable onPress={onPress} style={styles.mainContent}>
        <View style={[styles.iconWrap, { backgroundColor: person.coverColor }]}>
          <ThemedText type="smallBold" style={styles.iconText}>
            {person.name.charAt(0).toUpperCase()}
          </ThemedText>
        </View>

        <View style={styles.content}>
          <View style={styles.row}>
            <ThemedText type="subtitle" style={styles.name}>{person.name}</ThemedText>
          </View>

          <ThemedText type="small" style={styles.meta}>
            {person.type} • {person.privacy}
          </ThemedText>
          {person.description ? (
            <ThemedText type="small" style={styles.description}>
              {person.description}
            </ThemedText>
          ) : null}
          <View style={styles.groupRow}>
            {groupedMemberships.length > 0 ? (
              groupedMemberships.map((group) => (
                <View key={group.id} style={[styles.groupPill, { backgroundColor: group.color }]}>
                  <ThemedText type="smallBold" style={styles.groupPillText}>{group.name}</ThemedText>
                </View>
              ))
            ) : (
              <ThemedText type="small" style={styles.footer}>No groups</ThemedText>
            )}
          </View>
          <ThemedText type="small" style={styles.footer}>
            {person.memoryCount} memories
          </ThemedText>
        </View>
      </Pressable>

      <View style={styles.actions}>
        <Pressable onPress={onPress} style={styles.primaryButton}>
          <ThemedText type="smallBold" style={styles.primaryText}>Open</ThemedText>
        </Pressable>
        <Pressable onPress={onDelete} style={styles.deleteButton}>
          <ThemedText type="small" style={styles.deleteText}>Delete</ThemedText>
        </Pressable>
      </View>
    </View>
  );
}

const palette = Colors.light;

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: 18,
    backgroundColor: '#2a3137',
    borderWidth: 1,
    borderColor: '#404b52',
    alignItems: 'center',
  },
  mainContent: {
    flexDirection: 'row',
    flex: 1,
    gap: Spacing.three,
    alignItems: 'center',
  },
  iconWrap: {
    width: 52,
    height: 52,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    color: '#fff',
    fontSize: 20,
  },
  content: {
    flex: 1,
    gap: 6,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: Spacing.one,
  },
  name: {
    fontSize: 20,
    lineHeight: 24,
    flexShrink: 1,
    color: '#edf2f5',
  },
  meta: {
    opacity: 0.8,
    textTransform: 'capitalize',
    color: '#dfe8ec',
  },
  description: {
    opacity: 0.9,
    color: '#edf2f5',
  },
  footer: {
    opacity: 0.8,
    color: '#dfe8ec',
  },
  groupRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 6,
  },
  groupPill: {
    borderRadius: 999,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  groupPillText: {
    color: '#fff',
    fontSize: 11,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  primaryButton: {
    backgroundColor: palette.brand,
    borderRadius: 999,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  primaryText: {
    color: '#fff',
    fontSize: 12,
  },
  deleteButton: {
    paddingVertical: 4,
    paddingHorizontal: 8,
    backgroundColor: '#d75b5b',
    borderRadius: 999,
  },
  deleteText: {
    color: '#fff5f5',
  },
});
