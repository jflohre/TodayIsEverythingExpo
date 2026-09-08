# People & Memories

## Overview

People and memory collections let users create separate memory spaces for specific people or relationship groups such as a child, spouse, parent, pet, or family. Each person has a memory collection, but memories are flexible: a single memory can be tagged to multiple people when it belongs to a shared experience.

## User Flow

1. User opens the app and lands on the People screen.
2. User taps a button to create a new person profile or memory collection.
3. User fills in the name, type, and privacy level.
4. User optionally adds a cover photo and unlock date.
5. User saves the person profile and begins creating memories.
6. User can later edit or delete the person profile from settings.
7. When creating a memory, the user selects one or more people to tag.

## Code Location

- Main screen: `src/screens/PeopleListScreen.js`
- People detail screen: `src/screens/PersonMemoryTimelineScreen.js`
- Create/edit screen: `src/screens/PersonFormScreen.js`
- Settings screen: `src/screens/PersonSettingsScreen.js`
- State/context: `src/context/PersonContext.js`
- Utilities: `src/utils/personUtils.js`

## Key Implementation Notes

- Use a person object with fields such as `id`, `name`, `type`, `privacy`, `coverPhotoUri`, `createdAt`, and `memoryCount`.
- Keep the data local-first with async storage or a lightweight local data layer.
- Privacy should be represented as a small enum: `private`, `family-only`, `shared`.
- Person creation should feel lightweight and low-friction for a parent capturing moments quickly.
- Deletions should include a confirmation step before removing content.
- Each memory should support `taggedPeople` so a shared family holiday can appear in multiple people's timelines without being duplicated.
- The app should support both person-specific and family-wide memory views.

## Dependencies

- `@react-navigation/native`
- `expo-file-system` or local async storage wrapper
- `expo-image-picker` for optional cover photos

## Testing

- Create a person profile with several types and confirm it appears in the People list.
- Test privacy filtering and editing flows.
- Verify person deletion prompts before removal.
- Validate data persistence after app restart.
- Create a shared memory tagged to multiple people and confirm it appears in each relevant timeline.

## Known Issues

- None yet; this feature is planned and not implemented in the current codebase.

## Future Improvements

- Add person sharing invitations.
- Allow custom cover layouts and category colors.
- Support time capsule unlock dates with reminders.
- Add smart grouping for family memories that include multiple people.
