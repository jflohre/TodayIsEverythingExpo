import { Modal, Pressable, StyleSheet, View } from 'react-native';

import { ThemedText } from '@/components/themed-text';
import { Colors, Spacing } from '@/constants/theme';

export type ConfirmModalProps = {
  visible: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  destructive?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
};

export function ConfirmModal({
  visible,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  destructive = false,
  onCancel,
  onConfirm,
}: ConfirmModalProps) {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onCancel}>
      <Pressable style={styles.overlay} onPress={onCancel}>
        <Pressable style={styles.card} onPress={() => undefined}>
          <ThemedText type="subtitle" style={styles.title}>{title}</ThemedText>
          <ThemedText type="small" style={styles.message}>{message}</ThemedText>

          <View style={styles.actions}>
            <Pressable onPress={onCancel} style={[styles.button, styles.cancelButton]}>
              <ThemedText type="smallBold" style={styles.cancelText}>{cancelText}</ThemedText>
            </Pressable>

            <Pressable
              onPress={onConfirm}
              style={[styles.button, destructive ? styles.destructiveButton : styles.confirmButton]}>
              <ThemedText type="smallBold" style={destructive ? styles.destructiveText : styles.confirmText}>
                {confirmText}
              </ThemedText>
            </Pressable>
          </View>
        </Pressable>
      </Pressable>
    </Modal>
  );
}

const palette = Colors.light;

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(17, 24, 39, 0.55)',
    justifyContent: 'center',
    padding: Spacing.four,
  },
  card: {
    backgroundColor: '#2a3137',
    borderRadius: 18,
    padding: Spacing.four,
    gap: Spacing.three,
    borderWidth: 1,
    borderColor: '#404b52',
  },
  title: {
    color: '#edf2f5',
  },
  message: {
    color: '#dfe8ec',
    lineHeight: 20,
  },
  actions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  button: {
    borderRadius: 12,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    minWidth: 94,
    alignItems: 'center',
  },
  cancelButton: {
    backgroundColor: '#2d363d',
    borderWidth: 1,
    borderColor: '#46525b',
  },
  cancelText: {
    color: '#edf2f5',
  },
  confirmButton: {
    backgroundColor: palette.brand,
  },
  confirmText: {
    color: '#fff',
  },
  destructiveButton: {
    backgroundColor: '#d75b5b',
  },
  destructiveText: {
    color: '#fff5f5',
  },
});
