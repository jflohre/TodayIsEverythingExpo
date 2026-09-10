import { Pressable, StyleSheet, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { BottomTabInset, Colors, MaxContentWidth, Spacing } from '@/constants/theme';

const palette = Colors.light;
const goalColors = ['#2ec4d6', '#8ecf76', '#f0c95a', '#b1b7bb'];

export default function HomeScreen() {
  return (
    <ThemedView style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <View style={styles.topBar}>
          <ThemedText type="smallBold" style={styles.brand}>LifeMap</ThemedText>

          <View style={styles.navRow}>
            {['Motivation', 'About us', 'Contact'].map((label) => (
              <ThemedText key={label} type="small" style={styles.navItem}>
                {label}
              </ThemedText>
            ))}

            <Pressable style={styles.ghostButton}>
              <ThemedText type="smallBold" style={styles.ghostButtonText}>Your Goals</ThemedText>
            </Pressable>

            <ThemedText type="small" style={styles.metaText}>Logged in as jfohre</ThemedText>
          </View>
        </View>

        <View style={styles.heroWrap}>
          <ThemedText type="title" style={styles.heroTitle}>LifeMap</ThemedText>

          <ThemedText type="subtitle" style={styles.heroSubtitle}>
            Welcome to LifeMap, an easy way to set and track goals big and small.
          </ThemedText>

          <Pressable style={styles.primaryButton}>
            <ThemedText type="smallBold" style={styles.primaryButtonText}>Get Started!</ThemedText>
          </Pressable>

          <ThemedText type="small" style={styles.loginPrompt}>
            Already a member? <ThemedText type="smallBold" style={styles.inlineLink}>Log in.</ThemedText>
          </ThemedText>

          <View style={styles.dotRow}>
            {goalColors.map((color, index) => (
              <View key={color + index} style={[styles.dot, { backgroundColor: color }]} />
            ))}
          </View>
        </View>

        <View style={styles.loginSection}>
          <ThemedText type="smallBold" style={styles.loginTitle}>
            These Are Field Styles
          </ThemedText>

          <View style={styles.formCard}>
            <View style={styles.inputWrap}>
              <ThemedText type="small" style={styles.inputLabel}>Username</ThemedText>
            </View>
            <View style={styles.inputWrap}>
              <ThemedText type="small" style={styles.inputLabel}>Password</ThemedText>
            </View>
            <Pressable style={styles.submitButton}>
              <ThemedText type="smallBold" style={styles.submitText}>Login</ThemedText>
            </Pressable>
          </View>
        </View>

        <View style={styles.goalPanel}>
          <View style={styles.goalHeaderRow}>
            <ThemedText type="subtitle" style={styles.goalTitle}>jflohre&apos;s Current Goals</ThemedText>
            <Pressable style={styles.goalAddButton}>
              <ThemedText type="smallBold" style={styles.goalAddText}>+ Add a Goal</ThemedText>
            </Pressable>
          </View>

          <View style={styles.goalCard}>
            <View style={styles.goalCardHeader}>
              <ThemedText type="smallBold" style={styles.goalName}>Climb Mount Everest</ThemedText>
              <View style={styles.goalMeta}>
                <ThemedText type="small" style={styles.metaMuted}>Step 2 of 5</ThemedText>
                <View style={styles.iconCluster}>
                  <View style={styles.clusterIcon} />
                  <View style={styles.clusterIcon} />
                  <View style={styles.clusterIcon} />
                </View>
              </View>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: '40%', backgroundColor: palette.gold }]} />
            </View>
          </View>

          <View style={styles.goalCard}>
            <View style={styles.goalCardHeader}>
              <ThemedText type="smallBold" style={styles.goalName}>Visit every Major League Baseball Park in the US</ThemedText>
              <View style={styles.goalMeta}>
                <ThemedText type="small" style={styles.metaMuted}>Step 25 of 30</ThemedText>
                <View style={styles.iconCluster}>
                  <View style={styles.clusterIcon} />
                  <View style={styles.clusterIcon} />
                  <View style={styles.clusterIcon} />
                </View>
              </View>
            </View>
            <View style={styles.progressTrack}>
              <View style={[styles.progressFill, { width: '80%', backgroundColor: palette.mint }]} />
            </View>
          </View>
        </View>
      </SafeAreaView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: palette.background,
  },
  safeArea: {
    flex: 1,
    paddingBottom: BottomTabInset + Spacing.three,
    maxWidth: MaxContentWidth,
    width: '100%',
    alignSelf: 'center',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: Spacing.four,
    paddingTop: Spacing.three,
    paddingBottom: Spacing.two,
    backgroundColor: palette.background,
    borderBottomWidth: 1,
    borderBottomColor: palette.border,
  },
  brand: {
    fontSize: 38,
    lineHeight: 40,
    color: palette.brand,
    fontFamily: 'Georgia',
    letterSpacing: -1,
  },
  navRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: Spacing.two,
    flexWrap: 'wrap',
  },
  navItem: {
    color: palette.ink,
    textTransform: 'uppercase',
    letterSpacing: 0.6,
  },
  ghostButton: {
    borderWidth: 1,
    borderColor: palette.border,
    borderRadius: 999,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
    backgroundColor: palette.card,
  },
  ghostButtonText: {
    color: palette.text,
  },
  metaText: {
    color: palette.textSecondary,
  },
  heroWrap: {
    alignItems: 'center',
    paddingTop: Spacing.five,
    paddingBottom: Spacing.four,
    gap: Spacing.two,
  },
  heroTitle: {
    fontSize: 70,
    lineHeight: 78,
    color: palette.brand,
    textAlign: 'center',
    fontStyle: 'italic',
  },
  heroSubtitle: {
    fontSize: 28,
    lineHeight: 38,
    fontWeight: '400',
    textAlign: 'center',
    color: palette.textSecondary,
    maxWidth: 560,
  },
  primaryButton: {
    backgroundColor: palette.brand,
    borderRadius: 999,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    minWidth: 180,
    alignItems: 'center',
    marginTop: Spacing.one,
  },
  primaryButtonText: {
    color: '#ffffff',
  },
  loginPrompt: {
    marginTop: Spacing.one,
    color: palette.textSecondary,
  },
  inlineLink: {
    color: palette.brandDark,
  },
  dotRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: Spacing.two,
    marginTop: Spacing.one,
  },
  dot: {
    width: 72,
    height: 72,
    borderRadius: 36,
  },
  loginSection: {
    alignItems: 'center',
    backgroundColor: palette.brand,
    paddingVertical: Spacing.four,
    gap: Spacing.three,
  },
  loginTitle: {
    color: '#ffffff',
    fontSize: 20,
    textAlign: 'center',
  },
  formCard: {
    width: '100%',
    maxWidth: 420,
    gap: Spacing.two,
  },
  inputWrap: {
    backgroundColor: '#ffffff',
    borderRadius: 999,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    borderWidth: 1,
    borderColor: '#d9e9ea',
  },
  inputLabel: {
    color: '#5d6a75',
  },
  submitButton: {
    backgroundColor: '#3b4c56',
    borderRadius: 999,
    paddingVertical: Spacing.two,
    alignItems: 'center',
    marginTop: Spacing.one,
  },
  submitText: {
    color: '#ffffff',
  },
  goalPanel: {
    paddingHorizontal: Spacing.three,
    paddingTop: Spacing.four,
    paddingBottom: Spacing.five,
    backgroundColor: palette.background,
  },
  goalHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: Spacing.three,
  },
  goalTitle: {
    fontSize: 22,
    lineHeight: 28,
    color: palette.text,
  },
  goalAddButton: {
    backgroundColor: palette.brand,
    borderRadius: 999,
    paddingHorizontal: Spacing.two,
    paddingVertical: Spacing.one,
  },
  goalAddText: {
    color: '#ffffff',
  },
  goalCard: {
    backgroundColor: palette.card,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: palette.border,
    paddingHorizontal: Spacing.three,
    paddingVertical: Spacing.two,
    marginBottom: Spacing.two,
  },
  goalCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: Spacing.two,
    marginBottom: Spacing.one,
  },
  goalName: {
    fontSize: 18,
    flexShrink: 1,
    color: palette.text,
  },
  goalMeta: {
    alignItems: 'flex-end',
    gap: Spacing.one,
  },
  metaMuted: {
    color: '#697986',
  },
  iconCluster: {
    flexDirection: 'row',
    gap: 4,
  },
  clusterIcon: {
    width: 14,
    height: 14,
    borderRadius: 7,
    backgroundColor: '#c5d4d9',
  },
  progressTrack: {
    height: 12,
    borderRadius: 999,
    backgroundColor: palette.softGray,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: 999,
  },
});
