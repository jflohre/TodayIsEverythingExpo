# AI Agent Rules File - Today Is Everything Expo App

**Use this file when asking Cursor/Claude for code generation**

Copy relevant sections into your prompts to get better, more consistent code.

---

## PROJECT CONTEXT

### What We're Building
- **Today Is Everything** - A mobile-first voice journaling app
- **Platform:** Expo/React Native
- **Target Users:** Parents capturing family memories
- **Hero Features:** Voice recording, video capture, beautiful photo galleries
- **Differentiator:** QR codes in printed books linking to voice/video memories
- **Timeline:** MVP in 12 weeks

### Core Vision
Every feature should answer: "Does this help families preserve and share their most important moments?"

---

## TECHNICAL STACK (NON-NEGOTIABLE)

### Frontend
```
✅ Expo (managed React Native)
✅ React Hooks (useState, useEffect, useContext)
✅ React Navigation (bottom tabs + stack)
✅ expo-av (audio recording & playback)
✅ expo-camera (video recording)
✅ expo-image-picker (photo/video library)
✅ Flexbox (layout, not absolute positioning)
✅ Local async storage (Expo FileSystem)
```

### What NOT to Use
```
❌ Redux (use Context instead for MVP)
❌ Bare React Native (must use Expo)
❌ Backend/server calls (local only for MVP)
❌ Firebase (local storage only)
❌ TypeScript (stick with JavaScript for speed)
❌ Complex state management (keep it simple)
❌ Web libraries (only React Native packages)
```

### Package Versions
```
expo: ^51.0.0
react: ^18.2.0
react-native: 0.74.0
@react-navigation: ^6.0.0
```

---

## CODE STYLE RULES

### Naming Conventions
```javascript
// Components: PascalCase
function VoiceRecordingScreen() {}

// Functions: camelCase
function startRecording() {}

// Constants: UPPER_SNAKE_CASE
const MAX_RECORDING_DURATION = 300000;

// Variables: camelCase
const [isRecording, setIsRecording] = useState(false);

// Files: match component names or descriptive names
VoiceRecordingScreen.js
useVoiceRecording.js
audioUtils.js
```

### Component Structure
```javascript
// 1. Imports at top
import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity } from 'react-native';

// 2. Component definition
export default function ComponentName() {
  // 3. State
  const [state, setState] = useState(null);

  // 4. Effects
  useEffect(() => {
    // initialization
    return () => {
      // cleanup
    };
  }, []);

  // 5. Handlers
  const handlePress = () => {
    setState(newValue);
  };

  // 6. Render
  return (
    <View>
      {/* JSX */}
    </View>
  );
}
```

### Spacing & Formatting
```
✅ 2-space indentation
✅ Max line length: 80-100 characters
✅ Blank line between sections
✅ Comments for complex logic only
✅ No trailing commas in objects (except multiline)
```

### Comments
```javascript
// ✅ Good: Explains WHY
// We use setTimeout here because expo-av needs
// a brief delay before stopping recording on iOS
setTimeout(() => { ... }, 100);

// ❌ Bad: Explains WHAT (obvious from code)
// Set state to true
setState(true);

// ✅ Use /** */ for functions that need explanation
/**
 * Starts audio recording and initializes state
 * @returns Promise that resolves when recording starts
 */
async function startRecording() { ... }
```

---

## ARCHITECTURE RULES

### Folder Structure (Strict)
```
src/
├── screens/           # Full-screen components
│   ├── WelcomeScreen.js
│   ├── JournalListScreen.js
│   ├── VoiceRecordingScreen.js
│   └── EntryDetailScreen.js
│
├── components/        # Reusable components
│   ├── RecordButton.js
│   ├── AudioPlayer.js
│   ├── PhotoGrid.js
│   └── JournalCard.js
│
├── hooks/            # Custom React hooks
│   ├── useVoiceRecording.js
│   ├── usePhotoLibrary.js
│   └── useAuth.js
│
├── utils/            # Helper functions
│   ├── audioUtils.js
│   ├── storageUtils.js
│   └── dateUtils.js
│
├── styles/           # Style constants
│   ├── colors.js
│   ├── typography.js
│   └── spacing.js
│
├── context/          # React Context (state management)
│   ├── AuthContext.js
│   └── JournalContext.js
│
└── App.js            # Root component
```

### Where Code Goes
```
⚠️  Screen (full-screen UI) → src/screens/
⚠️  Reusable component → src/components/
⚠️  Complex logic (audio, storage) → src/hooks/
⚠️  Pure functions (formatting, calculations) → src/utils/
⚠️  Colors, fonts, spacing → src/styles/
⚠️  State management → src/context/
```

### Never Mix Concerns
```javascript
// ❌ BAD: Logic mixed with UI
function VoiceRecordingScreen() {
  const [isRecording, setIsRecording] = useState(false);
  
  const handleRecord = async () => {
    // Audio logic mixed with component
    const { sound } = await Audio.Sound.createAsync(
      require('./audio.mp3')
    );
    await sound.playAsync();
    setIsRecording(true);
  };
}

// ✅ GOOD: Separated concerns
// Custom hook handles all audio logic
function useVoiceRecording() {
  const [isRecording, setIsRecording] = useState(false);
  const startRecording = async () => { /* logic */ };
  return { isRecording, startRecording };
}

// Component just uses the hook
function VoiceRecordingScreen() {
  const { isRecording, startRecording } = useVoiceRecording();
  return <TouchableOpacity onPress={startRecording} />;
}
```

---

## REACT HOOKS RULES

### State Management
```javascript
// ✅ Use useState for local component state
const [isRecording, setIsRecording] = useState(false);

// ✅ Use useEffect for side effects
useEffect(() => {
  // Fetch data, set up listeners, etc
}, [dependencies]);

// ✅ Cleanup in useEffect return
useEffect(() => {
  const subscription = listener.subscribe(() => {});
  return () => subscription.unsubscribe();
}, []);

// ❌ Never call hooks conditionally
// if (condition) { const [x, setX] = useState(); } // WRONG

// ❌ Don't use React.memo unless measurable performance issue
// export default React.memo(MyComponent); // Usually unnecessary
```

### Custom Hooks (for complex logic)
```javascript
// ✅ Put complex logic in custom hooks
export function useVoiceRecording() {
  const [isRecording, setIsRecording] = useState(false);
  const [duration, setDuration] = useState(0);

  const startRecording = async () => {
    // Complex audio setup
    setIsRecording(true);
  };

  const stopRecording = async () => {
    // Complex cleanup
    setIsRecording(false);
  };

  return { isRecording, startRecording, stopRecording, duration };
}

// Then use in component
function VoiceRecordingScreen() {
  const { isRecording, startRecording } = useVoiceRecording();
  return <TouchableOpacity onPress={startRecording} />;
}
```

---

## PERFORMANCE RULES

### Lists (FlatList Only)
```javascript
// ✅ GOOD: Use FlatList for lists
<FlatList
  data={entries}
  renderItem={({ item }) => <EntryCard entry={item} />}
  keyExtractor={item => item.id}
  removeClippedSubviews={true}
  maxToRenderPerBatch={10}
/>

// ❌ BAD: Don't use ScrollView with many items
// <ScrollView>
//   {entries.map(entry => <EntryCard key={entry.id} />)}
// </ScrollView>
```

### Image Handling
```javascript
// ✅ GOOD: Specify width & height
<Image
  source={{ uri: photoUri }}
  style={{ width: 200, height: 200 }}
/>

// ❌ BAD: Missing dimensions
// <Image source={{ uri: photoUri }} />
```

### Avoid Re-renders
```javascript
// ✅ GOOD: Memoize expensive components
export const EntryCard = React.memo(({ entry, onPress }) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <Text>{entry.title}</Text>
    </TouchableOpacity>
  );
});

// ✅ GOOD: Use useCallback for handler functions
const handlePress = useCallback(() => {
  // handler logic
}, [dependencies]);
```

---

## ERROR HANDLING RULES

### Always Handle Errors
```javascript
// ✅ GOOD: Try-catch with user feedback
async function startRecording() {
  try {
    const { status } = await Audio.requestPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission denied', 'Microphone access required');
      return;
    }
    await recordingRef.current.startAsync();
  } catch (error) {
    console.error('Recording error:', error);
    Alert.alert('Error', 'Failed to start recording');
  }
}

// ❌ BAD: Silently failing
// const recording = await Audio.startRecording(); // No error handling
```

### Loading States
```javascript
// ✅ Always show loading for async operations
const [isLoading, setIsLoading] = useState(false);

const handleSave = async () => {
  setIsLoading(true);
  try {
    await saveEntry(data);
    Alert.alert('Success', 'Entry saved');
  } catch (error) {
    Alert.alert('Error', error.message);
  } finally {
    setIsLoading(false);
  }
};

return (
  <TouchableOpacity disabled={isLoading} onPress={handleSave}>
    <Text>{isLoading ? 'Saving...' : 'Save'}</Text>
  </TouchableOpacity>
);
```

---

## TESTING RULES

### What Requires Testing
```
✅ Custom hooks (especially audio/storage logic)
✅ Utility functions (date formatting, validation)
✅ Critical user flows (record → save → play)
✅ Error scenarios (permissions, file not found)
```

### What Doesn't Require Testing
```
❌ Navigation (tested by manual use)
❌ UI styling (visual inspection)
❌ Third-party library integrations (they're tested)
```

### Testing Command
```bash
npm test
# But for MVP, focus on manual testing in Expo Go
```

---

## SECURITY RULES

### Permissions
```javascript
// ✅ GOOD: Request permissions explicitly
const { status } = await Audio.requestPermissionsAsync();
if (status !== 'granted') {
  Alert.alert('Permission Required', 'Please enable microphone access');
  return;
}

// ✅ GOOD: Check permissions before using
const { granted } = await ImagePicker.requestMediaLibraryPermissionsAsync();
if (!granted) {
  Alert.alert('Permission Required', 'Please enable photo access');
  return;
}
```

### Data Storage
```javascript
// ✅ GOOD: Store files in app-specific directory
const filePath = `${FileSystem.documentDirectory}/entries/${entryId}.m4a`;

// ❌ BAD: Store in random locations
// const filePath = `/storage/emulated/0/DCIM/${entryId}.m4a`;
```

### User Privacy
```
✅ All data stored locally on device
✅ No third-party tracking
✅ No data sent to servers (MVP)
✅ Users can delete their data
```

---

## FEATURE-SPECIFIC RULES

### Voice Recording
```javascript
// Must include:
✅ Microphone permission check
✅ Waveform animation during recording
✅ Duration timer (MM:SS format)
✅ Stop button visible during recording
✅ Audio compression before saving
✅ Transcript display (placeholder for now)
✅ Error handling (permissions, mic not available)

// Audio format:
✅ m4a (good quality, good compression)
❌ No wav (too large)
```

### Video Recording
```javascript
// Must include:
✅ Camera permission check
✅ Video compression before saving
✅ Trim option before saving
✅ Beautiful thumbnail preview
✅ Video playback with controls
✅ Support for camera roll videos
✅ Max 2-minute recording length

// Video format:
✅ mp4 (H.264 codec)
✅ Compressed to <50MB per video
```

### Timeline
```javascript
// Must include:
✅ Use FlatList (not ScrollView)
✅ Lazy load photos (not all at once)
✅ Date separators (Today, Yesterday, etc)
✅ Pull-to-refresh
✅ Entry preview cards
✅ Pagination (load more)

// Performance:
✅ Render 20 items at a time max
✅ Load more as user scrolls
❌ Don't render all entries at once
```

### Playback (Audio/Video)
```javascript
// Must include:
✅ Play/pause button
✅ Progress bar with seek capability
✅ Duration display
✅ Current time display
✅ Error handling for missing files
✅ Stop button

// Features:
✅ Multiple playback controls
✅ Beautiful player UI
❌ No complex editing in MVP
```

---

## WHEN TO ASK THE AI (CURSOR)

### ✅ Ask Claude For:
- Generating new screens/components
- Complex audio/video logic
- Layout designs
- Navigation structure
- State management setup
- Utility functions
- Bug fixes
- Performance optimization

### ❌ Don't Ask Claude For:
- Strategic decisions (you decide)
- Architecture choices (follow rules file)
- Project pivot decisions
- When to add features

---

## PROMPT TEMPLATE FOR CURSOR

Copy this template and fill in the blanks:

```
Follow the rules in the AI Agent Rules File for Today Is Everything.

Tech Stack: Expo/React Native only (no backends)
Project: Voice-first family journaling app

I need you to create a [SCREEN/COMPONENT/UTILITY]:

Description:
[What it should do]

Location: src/[screens|components|hooks|utils]/[FileName].js

Features:
- [Feature 1]
- [Feature 2]
- [Feature 3]

Includes:
✅ Proper error handling
✅ Loading states
✅ Permission checks (if applicable)
✅ Accessibility (large text, good contrast)
✅ Comments for complex logic

Return: Complete, working code ready to copy-paste
```

---

## PROJECT WORKFLOW

### When Starting a New Feature

**Step 1: Describe what you want**
```
"I need a voice recording screen with:
- Large red record button
- Waveform animation
- Duration timer
- Stop button visible during recording
- Use expo-av for audio"
```

**Step 2: Claude generates code**
```
*Generates 200+ lines of complete component*
```

**Step 3: Copy and paste into your project**
```bash
# In src/screens/VoiceRecordingScreen.js
*Paste the generated code*
```

**Step 4: Test on Expo Go**
```bash
# In terminal: npm start
# On phone: Scan QR code with Expo Go
# See changes instantly!
```

**Step 5: Iterate**
```
If something needs tweaking:
"Change the button color to blue"
"Make the text bigger"
"Add haptic feedback"

Each change: Save → Expo reloads → Test (1-2 seconds)
```

---

## SUCCESS CRITERIA FOR GENERATED CODE

All code from Claude should:
- [ ] Be immediately usable (copy-paste ready)
- [ ] Have all necessary imports
- [ ] Include error handling (try-catch, permission checks)
- [ ] Show loading states for async operations
- [ ] Be properly formatted (spacing, naming)
- [ ] Have comments for complex logic
- [ ] Follow folder structure rules
- [ ] Work on Expo Go on real phone
- [ ] Match component structure (imports → state → effects → handlers → render)

If code doesn't meet these criteria, ask Claude to fix it.

---

## REMINDER PHRASES

Use these when prompting Claude:

```
"Follow the AI Agent Rules File"
"Use Expo, not bare React Native"
"Store data locally, no backend"
"Include error handling and permissions"
"This goes in src/[folder]/"
"Make it work on Expo Go"
"Add comments for complex logic"
"Include loading states"
"Test on a real phone, not simulator"
```

---

## DO NOT VIOLATE THESE RULES

```
❌ Using Redux (use Context)
❌ Using Firebase (use local storage)
❌ Calling backend APIs (MVP is local only)
❌ Using non-Expo packages
❌ Complex TypeScript (keep it simple)
❌ Absolute positioning (use Flexbox)
❌ ScrollView for long lists (use FlatList)
❌ Missing error handling
❌ Components without clean-up
❌ State mutation (always use setState)
```

---

## FINAL REMINDER

**This app preserves family memories. Every feature should:**

✅ Make recording easier (voice, photos, video)
✅ Make playback beautiful (hear their voice, see their face)
✅ Make sharing natural (invite family to contribute)
✅ Enable printing (turn memories into books)

If a feature doesn't serve these goals, reconsider.

---

*Use this file in every prompt to Claude. Keep it updated as you learn.*  
*Save as: AI_AGENT_RULES.md in your project root*