# Entry Detail

## Overview

The entry detail view shows the full memory for a selected item, including transcript, media, metadata, and actions such as playback, editing, or deletion.

## User Flow

1. User taps an item in the timeline or journal view.
2. App opens the full detail view.
3. User can play audio, view images, or watch video.
4. User reads the full transcript and metadata.
5. User can edit or delete the entry if allowed.

## Code Location

- Main screen: `src/screens/EntryDetailScreen.js`
- Audio player: `src/components/AudioPlayer.js`
- Gallery: `src/components/PhotoGrid.js`
- Detail logic: `src/hooks/useEntryDetail.js`

## Key Implementation Notes

- Display all associated media in a gallery or carousel layout.
- Support audio playback controls with current time and duration.
- Keep metadata visible: date, time, type, and journal origin.
- Keep transcript readable and easy to copy or edit.
- Provide clear delete actions with confirmation.

## Dependencies

- `expo-av`
- local file access
- optional gallery or image viewer components

## Testing

- Open an entry with audio and confirm playback controls work.
- Open a multi-photo entry and verify gallery navigation.
- Confirm transcript displays full content and handles large text blocks.
- Validate delete confirmation and edit flow.

## Known Issues

- Rendering large galleries can be resource intensive.
- Audio duration display may need consistent formatting across file types.

## Future Improvements

- Add full-screen gallery experience.
- Allow commenting or family responses.
- Add export/share actions.
