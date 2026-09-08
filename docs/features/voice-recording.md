# Voice Recording

## Overview

Voice recording is the hero feature of the app. It gives users a fast, natural way to capture memories by speaking instead of typing. The flow should feel simple, emotionally resonant, and reliable on a phone. Voice memories can be tagged to one or more people so a shared family moment appears in each relevant timeline.

## User Flow

1. User taps the large record button from the memory composer.
2. App requests microphone permission if needed.
3. Recording begins and a waveform animates in real time.
4. Timer updates while the user speaks.
5. User taps stop when complete.
6. Transcript appears and can be edited manually.
7. User selects which people are tagged to the memory.
8. User adds optional media or saves the memory.

## Code Location

- Main screen: `src/screens/VoiceRecordingScreen.js`
- Logic: `src/hooks/useVoiceRecording.js`
- Audio utils: `src/utils/audioUtils.js`
- Shared controls: `src/components/RecordButton.js`

## Key Implementation Notes

- Use `expo-av` for recording and playback.
- Record in compressed format such as `m4a` for space efficiency.
- Show a waveform or animated visualizer while recording.
- Display a timer in `MM:SS` format.
- Support permission checking and graceful errors for denied access.
- Store recordings in an app-specific local directory.
- Keep recording lengths between 30 seconds and 5 minutes in MVP.
- Add a multi-select people tag after recording so the memory can be associated with multiple people.

## Dependencies

- `expo-av`
- `expo-device`
- `expo-file-system`
- `react-native` animations or lightweight visualizer logic

## Testing

- Test permission flow on real device.
- Record a short clip and verify playback works.
- Check that waveform animation and timer update during recording.
- Confirm transcript appears and can be corrected.
- Validate saved audio file persistence after app restart.
- Create a voice memory tagged to multiple people and confirm it appears in each relevant timeline.

## Known Issues

- Real-time transcription and waveform polish may require extra tuning on lower-end devices.
- iOS recording timing can be sensitive and may need a short delay before stop logic.
- Multi-person tagging needs a clear UI that keeps record creation fast but understandable.

## Future Improvements

- Improve transcription accuracy.
- Add segment trimming and re-recording.
- Add automatic summary generation and key moment detection.
