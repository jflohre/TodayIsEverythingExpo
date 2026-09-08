# Timeline

## Overview

The timeline is the main browsing surface for the app. It shows memories in reverse chronological order so users can scan recent moments quickly and reopen older entries by date. The timeline can be scoped to a single person, a relationship group, or the whole family, and a memory may appear in multiple timelines if it is tagged to multiple people.

## User Flow

1. User opens the timeline from the main app navigation.
2. App loads recent memories in date order, newest first.
3. User scrolls through cards and sees date-grouping information.
4. User taps a card to open the full memory detail.
5. User can pull to refresh or load more entries as needed.
6. If a memory includes multiple people, it appears in each relevant timeline.

## Code Location

- Main screen: `src/screens/TimelineScreen.js`
- Entry cards: `src/components/EntryCard.js`
- Data hooks: `src/hooks/useTimeline.js`
- Utility sorting: `src/utils/dateUtils.js`

## Key Implementation Notes

- Use `FlatList` rather than `ScrollView` for scalable performance.
- Render only a subset of entries at a time using pagination or lazy loading.
- Group entries by dates such as Today, Yesterday, This Week, or This Month.
- Show previews with the date, time, entry type, and a summary snippet.
- Use small, efficient thumbnails for the first photo or video in the entry.
- Support both person-specific and family-level timeline filters.
- Include people tags on each card so a shared memory is easy to understand at a glance.

## Dependencies

- `react-native`
- `@react-navigation/native`
- local data storage layer

## Testing

- Verify newest-first ordering.
- Test loading more entries as the user scrolls.
- Confirm empty-state behavior when there are no memories yet.
- Check that photos and transcript previews render correctly.
- Verify that a multi-person memory appears in each relevant timeline without being duplicated in storage.

## Known Issues

- Large entry lists may create re-render pressure without careful memoization.
- Date grouping logic needs consistency across devices and locales.
- Multi-person filtering needs a clear rule for shared entities that should appear in multiple timelines.

## Future Improvements

- Add filters by type, date range, and people.
- Support pull-to-refresh and infinite scrolling polish.
- Add search highlighting in preview cards.
