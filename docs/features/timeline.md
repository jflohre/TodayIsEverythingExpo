# Timeline

## Overview

The timeline is the main browsing surface for the app. It shows memory entries in reverse chronological order so users can scan recent moments quickly and reopen older entries by date.

## User Flow

1. User opens the timeline from the main app navigation.
2. App loads recent entries in date order, newest first.
3. User scrolls through cards and sees date-grouping information.
4. User taps a card to open the full entry detail.
5. User can pull to refresh or load more entries as needed.

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

## Dependencies

- `react-native`
- `@react-navigation/native`
- local data storage layer

## Testing

- Verify newest-first ordering.
- Test loading more entries as the user scrolls.
- Confirm empty-state behavior when there are no memories yet.
- Check that photos and transcript previews render correctly.

## Known Issues

- Large entry lists may create re-render pressure without careful memoization.
- Date grouping logic needs consistency across devices and locales.

## Future Improvements

- Add filters by type, date range, and people.
- Support pull-to-refresh and infinite scrolling polish.
- Add search highlighting in preview cards.
