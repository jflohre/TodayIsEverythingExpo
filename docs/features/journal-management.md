# Journal Management

## Overview

Journal management lets users create and organize memory journals for specific people or relationship groups such as a child, spouse, parent, pet, or family. Each journal acts as a container for entries, privacy settings, and metadata.

## User Flow

1. User opens the app and lands on the journal list.
2. User taps a button to create a new journal.
3. User fills in subject name, type, and privacy level.
4. User optionally adds a cover photo and unlock date.
5. User saves the journal and begins creating entries.
6. User can later edit or delete the journal from settings.

## Code Location

- Main screen: `src/screens/JournalListScreen.js`
- Create/edit screen: `src/screens/JournalFormScreen.js`
- Settings screen: `src/screens/JournalSettingsScreen.js`
- State/context: `src/context/JournalContext.js`
- Utilities: `src/utils/journalUtils.js`

## Key Implementation Notes

- Use a journal object with fields such as `id`, `name`, `type`, `privacy`, `coverPhotoUri`, `createdAt`, and `entryCount`.
- Keep the data local-first with async storage or a lightweight local data layer.
- Privacy should be represented as a small enum: `private`, `family-only`, `shared`.
- Journal creation should feel lightweight and low-friction for a parent capturing moments quickly.
- Deletions should include a confirmation step before removing content.

## Dependencies

- `@react-navigation/native`
- `expo-file-system` or local async storage wrapper
- `expo-image-picker` for optional cover photos

## Testing

- Create a journal with several types and confirm it appears in the list.
- Test privacy filtering and editing flows.
- Verify journal deletion prompts before removal.
- Validate data persistence after app restart.

## Known Issues

- None yet; this feature is planned and not implemented in the current codebase.

## Future Improvements

- Add journal sharing invitations.
- Allow custom cover layouts and category colors.
- Support time capsule unlock dates with reminders.
