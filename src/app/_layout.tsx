import { DarkTheme, DefaultTheme, ThemeProvider } from 'expo-router';
import * as SplashScreen from 'expo-splash-screen';
import { useColorScheme } from 'react-native';

import { AnimatedSplashOverlay } from '@/components/animated-icon';
import AppTabs from '@/components/app-tabs';
import { EntryProvider } from '@/context/EntryContext';
import { GroupProvider } from '@/context/GroupContext';
import { PersonProvider } from '@/context/PersonContext';

SplashScreen.preventAutoHideAsync();

export default function TabLayout() {
  const colorScheme = useColorScheme();
  return (
    <ThemeProvider value={colorScheme === 'dark' ? DarkTheme : DefaultTheme}>
      <GroupProvider>
        <EntryProvider>
          <PersonProvider>
            <AnimatedSplashOverlay />
            <AppTabs />
          </PersonProvider>
        </EntryProvider>
      </GroupProvider>
    </ThemeProvider>
  );
}
