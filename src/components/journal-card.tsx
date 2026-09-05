import { Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Spacing } from '@/constants/theme';
import { Journal } from '@/types/journal';

export function JournalCard({
  journal,
  onPress,
  onDelete,
}: {
  journal: Journal;
  onPress?: () => void;
  onDelete?: () => void;
}) {
  return (
    <View style={styles.card}>
      <Pressable onPress={onPress} style={styles.mainContent}>
        <View style={[styles.iconWrap, { backgroundColor: journal.coverColor }]}>
          <ThemedText type="smallBold" style={styles.iconText}>
            {journal.name.charAt(0).toUpperCase()}
          </ThemedText>
        </View>

        <View style={styles.content}>
          <View style={styles.row}>
            <ThemedText type="subtitle" style={styles.name}>{journal.name}</ThemedText>
          </View>

          <ThemedText type="small" style={styles.meta}>
            {journal.type} • {journal.privacy}
          </ThemedText>
          <ThemedText type="small" style={styles.description}>
            {journal.description || 'No description yet.'}
          </ThemedText>
          <ThemedText type="small" style={styles.footer}>
            {journal.entryCount} entries
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

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    gap: Spacing.three,
    padding: Spacing.three,
    borderRadius: 18,
    backgroundColor: '#f5f5f5',
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
  },
  meta: {
    opacity: 0.7,
    textTransform: 'capitalize',
  },
  description: {
    opacity: 0.8,
  },
  footer: {
    opacity: 0.7,
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.one,
  },
  primaryButton: {
    backgroundColor: '#111827',
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
  },
  deleteText: {
    color: '#d93c43',
  },
});
