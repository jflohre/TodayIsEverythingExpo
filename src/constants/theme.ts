/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import '@/global.css';

import { Platform } from 'react-native';

export const Colors = {
  light: {
    text: '#2e3b42',
    background: '#f3f2f1',
    backgroundElement: '#ebe6e1',
    backgroundSelected: '#dfe3e8',
    textSecondary: '#5f6972',
    brand: '#2ec4d6',
    brandDark: '#1d8ea6',
    brandSoft: '#7bd7e9',
    mint: '#88c89d',
    gold: '#f0c85d',
    sage: '#c7d46e',
    slate: '#b8b8b8',
    card: '#f7f5f3',
    border: '#d9d2cc',
    success: '#69b873',
    shadow: 'rgba(18, 24, 33, 0.08)',
    panel: '#2ec4d6',
    surface: '#ffffff',
    ink: '#3f4b52',
    softGray: '#e6e3e0',
  },
  dark: {
    text: '#f5f7f8',
    background: '#121a1f',
    backgroundElement: '#1f2b33',
    backgroundSelected: '#2b3942',
    textSecondary: '#b2bdc5',
    brand: '#2ec4d6',
    brandDark: '#1d8ea6',
    brandSoft: '#7bd7e9',
    mint: '#88c89d',
    gold: '#f0c85d',
    sage: '#c7d46e',
    slate: '#b8b8b8',
    card: '#1b252c',
    border: '#35444d',
    success: '#69b873',
    shadow: 'rgba(0, 0, 0, 0.22)',
    panel: '#2ec4d6',
    surface: '#1f2b33',
    ink: '#eaeef2',
    softGray: '#26353d',
  },
} as const;

export type ThemeColor = keyof typeof Colors.light & keyof typeof Colors.dark;

export const Fonts = Platform.select({
  ios: {
    /** iOS `UIFontDescriptorSystemDesignDefault` */
    sans: 'system-ui',
    /** iOS `UIFontDescriptorSystemDesignSerif` */
    serif: 'ui-serif',
    /** iOS `UIFontDescriptorSystemDesignRounded` */
    rounded: 'ui-rounded',
    /** iOS `UIFontDescriptorSystemDesignMonospaced` */
    mono: 'ui-monospace',
  },
  default: {
    sans: 'normal',
    serif: 'serif',
    rounded: 'normal',
    mono: 'monospace',
  },
  web: {
    sans: 'var(--font-display)',
    serif: 'var(--font-serif)',
    rounded: 'var(--font-rounded)',
    mono: 'var(--font-mono)',
  },
});

export const Spacing = {
  half: 2,
  one: 4,
  two: 8,
  three: 16,
  four: 24,
  five: 32,
  six: 64,
} as const;

export const BottomTabInset = Platform.select({ ios: 50, android: 80 }) ?? 0;
export const MaxContentWidth = 800;
