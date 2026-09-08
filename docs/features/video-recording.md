# Video Recording

## Overview

Video recording allows users to capture family moments in motion, supplementing voice memories with visual context. The MVP focuses on recording directly in app and selecting existing videos from the device library. Shared events like family trips should be taggable to multiple people and show up in each relevant memory timeline.

## User Flow

1. User opens the video memory flow.
2. User either records a new video or selects one from camera roll.
3. App requests camera and media permissions when needed.
4. User previews the clip and optional audio.
5. User trims or confirms the video before saving.
6. User selects which people are associated with the memory.
7. Video is attached to the relevant memory record and surfaced in each matching timeline.

## Code Location

- Recording screen: `src/screens/VideoRecordingScreen.js`
- Library selection: `src/screens/VideoSelectionScreen.js`
- Playback: `src/components/VideoPlayer.js`
- Media hooks: `src/hooks/useMediaLibrary.js`

## Key Implementation Notes

- Use `expo-camera` for new recordings.
- Use `expo-image-picker` to access the camera roll.
- Compress videos before storing them locally.
- Keep recording sessions under 2 minutes for MVP.
- Show a thumbnail preview before final save.
- Support playback controls and error states for missing files.
- Add a multi-select people tag flow before storing a video memory.

## Dependencies

- `expo-camera`
- `expo-image-picker`
- `expo-av`
- `expo-file-system`

## Testing

- Validate permission prompts for camera and media access.
- Record and preview a short clip.
- Select an existing video from the device library.
- Trim or confirm before saving.
- Verify playback on a real device.
- Create a shared video memory tagged to multiple people and confirm it appears in each relevant timeline.

## Known Issues

- Video compression and playback behavior can vary across device models.
- Large files may require careful local storage management.
- Shared-tag visibility should remain clear when one clip belongs to several people.

## Future Improvements

- Add advanced trimming and reordering.
- Support auto-transcription of video audio.
- Add video highlight reels.
