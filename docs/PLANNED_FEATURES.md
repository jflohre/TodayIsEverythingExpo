# Today Is Everything - Planned Features

Complete feature roadmap for the Expo app

---

## MVP Features (Weeks 1-12)

### Priority: Must Have for Launch

#### 1. Authentication & Onboarding
**Status:** Planned  
**Priority:** Critical  
**Description:**
- User signup with email/password
- Login screen
- Onboarding tutorial (3 screens)
- Profile setup (name, profile photo)
- Secure authentication with JWT tokens

**Screens:**
- Welcome screen
- Signup screen
- Login screen
- Onboarding screens (features overview)
- Profile setup screen

**Technical:**
- Use Expo built-in storage for tokens
- Secure password handling
- Onboarding completed flag

---

#### 2. People & Memory Collections
**Status:** Planned  
**Priority:** Critical  
**Description:**
- Create separate memory collections for different people (children, spouse, family members)
- Set subject name and type
- Choose privacy level (private, family-only, shared)
- Set optional unlock dates (for time capsules)
- Edit person settings
- Delete memory collections (with confirmation)
- Allow one memory to be tagged to multiple people for shared family experiences

**Screen:**
- People list screen (cards showing all people)
- Create person screen (form)
- Person settings screen
- Person memory timeline

**Features:**
- Subject type options: child, spouse, parent, pet, family
- Privacy levels: private, family-only, shared
- Cover photo selection
- Person metadata (created date, memory count)
- Multi-person tagging for shared memories like family trips and milestones

---

#### 3. Voice Recording (THE HERO FEATURE) ⭐
**Status:** Planned  
**Priority:** CRITICAL - This is our differentiator  
**Description:**
- Large, beautiful record button (primary action)
- Real-time audio waveform animation
- Duration timer (MM:SS)
- Automatic speech-to-text transcription (simultaneous)
- Manual transcript editing (fix misheard words)
- Recording quality: 30 seconds to 5 minutes (MVP)
- Audio compression for efficient storage
- Works offline (records without internet, syncs when connected)

**Screen:**
- Voice Recording screen (primary entry creation)

**Technical:**
- Use expo-av for audio recording
- Waveform animation with React Native Skia or SVG
- Haptic feedback on button press
- Error handling for microphone permissions
- Local file storage temporarily
- Compress audio before saving

**User Flow:**
1. Tap big red record button
2. Speak naturally (30 seconds to 2 minutes)
3. See waveform animate
4. See timer counting up
5. See transcript appearing in real-time
6. Tap stop
7. Add photos (optional)
8. Edit transcript if needed
9. Tap save
10. Entry synced and stored

---

#### 4. Video Recording & Playback
**Status:** Planned  
**Priority:** Critical - Part of core experience  
**Description:**
- Record new videos (30 seconds to 2 minutes)
- Access previously recorded videos from camera roll
- Video compression before saving
- Auto-transcription of video audio (speech-to-text)
- Beautiful video playback with controls
- Trim video before saving
- Video thumbnail previews
- Multiple videos per entry

**Screen:**
- Video Recording screen
- Video Selection screen (camera roll)
- Video Playback (in Entry Detail)

**Technical:**
- Use expo-camera for new recording
- Use expo-image-picker to access camera roll videos
- Video compression for efficient storage
- Auto-transcription of audio track
- Thumbnail generation

**Features:**
- Record directly from app
- Browse and select from camera roll
- Preview before adding
- Trim before saving
- Play with standard controls

---

#### 5. Entry Creation (Multiple Methods)
**Status:** Planned  
**Priority:** Critical  
**Description:**
- Voice entry (primary method, covered above)
- Video entry (secondary method, capture video with optional narration)
- Text entry (for backup/typing)
- Photo entry (lightweight, just photo + caption)
- Add photos to any entry type
- Add videos to any entry type
- Edit entry content before saving
- Auto-date stamping

**Screens:**
- Voice Recording screen
- Video Recording screen
- Text Entry screen
- Photo Entry screen

**Features:**
- Auto-save draft (optional)
- Character counter for text
- Photo/video preview before adding
- Multiple photos and videos per entry
- Reorder photos/videos before saving
- Mix photos and videos in same entry

---

#### 5. Timeline View
**Status:** Planned  
**Priority:** Critical  
**Description:**
- Chronological list of all entries (newest first)
- Visual date separators (Today, Yesterday, This Week, This Month)
- Entry preview cards showing:
  - Date and time
  - Thumbnail of first photo
  - Entry type icon (microphone for voice, camera for video, text for written)
  - First 100 characters of content/transcript
  - "Tap to expand" indicator
- Pull-to-refresh to load new entries
- Infinite scroll (load more as you scroll)
- Empty state if no entries

**Screen:**
- Timeline screen

**Technical:**
- Use FlatList for performance (not ScrollView)
- Memoize components to prevent re-renders
- Lazy load photos
- Pagination for efficiency

---

#### 6. Entry Detail View
**Status:** Planned  
**Priority:** Critical  
**Description:**
- Display full entry with all content
- Show all associated photos in gallery
- Play audio with beautiful player controls
- Display full transcript
- Show metadata (date, time, entry type)
- Edit entry option
- Delete entry option
- Share entry (copy link, email)

**Screen:**
- Entry Detail screen

**Features:**
- Audio player with:
  - Play/pause button
  - Duration and current position
  - Seek bar
  - Volume control (if possible in Expo)
- Photo gallery with swipe navigation
- Transcript with copy to clipboard
- Edit and delete buttons
- Beautiful typography and spacing

---

#### 7. Family Sharing (MVP Version)
**Status:** Planned  
**Priority:** High  
**Description:**
- Invite family members to journal via email
- Permission levels:
  - View Only (can read but not edit)
  - Contribute (can add their own entries)
  - Admin (can manage journal and invite others)
- Notifications when family adds entries
- Simple comment system (text replies to entries)
- List of collaborators with their permission level

**Screens:**
- Share settings screen
- Invite collaborator screen
- Collaborators list screen
- Comment thread screen

**Features:**
- Email invitation system
- Accept/decline invitations
- Permission level management
- Remove collaborators
- Basic notifications

---

#### 8. Basic Search
**Status:** Planned  
**Priority:** High  
**Description:**
- Full-text search across all entry content AND transcripts
- Search within single journal or all journals
- Filter by:
  - Date range
  - Entry type (voice, text, video, photo)
- Search results showing matching entries
- Highlighted search terms in results

**Screen:**
- Search screen

**Features:**
- Search bar with auto-focus
- Real-time search (as you type)
- Search history (recent searches)
- Clear search button
- Results sorted by relevance then date

---

## Phase 2 Features (Weeks 13-20)

### Priority: Nice to Have, Not Required for Launch

---

#### 2. Enhanced Search
**Status:** Planned  
**Priority:** Medium  
**Description:**
- Voice search ("Find entries where I mention 'birthday'")
- Tag system (tag people, places, milestones)
- Smart search across tags and content
- Saved searches for frequently used queries
- Search history with quick recall

**Features:**
- Tag entries during creation or editing
- Auto-suggest tags based on previous usage
- Filter by tags
- Combine multiple filters
- Save search queries

---

#### 3. Reminders & Prompts
**Status:** Planned  
**Priority:** Medium  
**Description:**
- Daily/weekly prompt notifications ("What made you smile today?")
- Milestone prompts based on child's age ("Today is Emma's 6 month birthday!")
- Family event reminders (anniversaries, holidays)
- Customizable prompt frequency
- Disable/enable notifications

**Features:**
- Prompt library (50+ prompts)
- Recurring prompts
- One-time prompts
- Smart timing (morning, afternoon, evening)
- Push notifications (with Expo Notifications)

---

#### 4. Voice Editing
**Status:** Planned  
**Priority:** Medium  
**Description:**
- Trim recording (remove starts/ends)
- Re-record sections (fix mistakes)
- Add multiple recordings to single entry
- Adjust volume levels

**Features:**
- Trim UI with timeline scrubber
- Re-record specific section
- Merge multiple recordings
- Preview before saving

---

## Phase 3 Features (Weeks 21-28)

### Priority: Revenue & Differentiation

#### 1. Print-on-Demand Books
**Status:** Planned  
**Priority:** Critical (this is our revenue stream)  
**Description:**
- Automatic layout of entries into book pages
- Multiple book templates:
  - Baby Book (milestones focused)
  - Love Story (relationship focused)
  - Family Book (multi-generational)
- Customization options:
  - Cover design with custom photo
  - Chapter organization by date or theme
  - Font and color choices
- QR codes linking to voice/video playback
- Professional printing with hardcover/softcover options

**Screens:**
- Print preview screen
- Book customization screen
- Order confirmation screen
- Order history screen

**Technical:**
- Layout engine (convert entries to PDF pages)
- QR code generation
- Integration with print API (Blurb or Printful)

---

#### 2. Order Management
**Status:** Planned  
**Priority:** Critical  
**Description:**
- Preview book before ordering (page-by-page)
- Stripe payment integration
- Shipping address collection
- Order confirmation with details
- Tracking information
- Order history with status
- Reorder previous books

**Features:**
- Multiple payment methods
- Address book for quick checkout
- Order tracking
- Refund/replacement policy
- Email confirmation

---

#### 3. Pricing for Print
**Status:** Planned  
**Priority:** Critical  
**Description:**

**Softcover Books:**
- 100 pages: $25
- 150 pages: $30
- Production cost: $15-20
- Platform margin: 35-40%

**Hardcover Books:**
- 100 pages: $35
- 150 pages: $45
- Production cost: $20-30
- Platform margin: 40-45%

**Premium Options:**
- Deluxe hardcover: $50-60
- Bulk discounts: 3+ books = 10% off
- Rush shipping: +$10

---

## Future Features (Post-MVP)

### Ideas for Future Development

#### 1. Backend Integration
- Cloud storage for audio/video
- Sync across devices
- Backup and restore
- Cloud backup of entries

#### 2. Advanced Transcription
- Multiple language support
- Speaker identification
- Highlight key phrases
- AI summary of entries

#### 3. AI Features
- Smart album creation (auto-organize by theme)
- Highlight reels (auto-create video compilations)
- Memory reminders ("Relive this moment from X years ago")
- Handwriting recognition (if photos contain handwritten text)

#### 4. Social Features
- Share entries with extended family (grandparents, aunts, uncles)
- Collaborative timelines (multiple journals merged)
- Family tree integration
- Private family network

#### 5. Web Companion
- Desktop app for browsing/organizing
- Bigger screen for managing photos
- Printing directly from web
- Family access via web

#### 6. Additional Print Products
- Photo books (photo-focused instead of text-focused)
- Custom covers with child's artwork
- Wall prints
- Canvas prints
- Mugs, shirts, other merchandise

#### 7. Accessibility
- Text-to-speech for journal entries
- Dark mode
- Larger text sizes
- High contrast mode

---

## Feature Status Legend

| Status | Meaning |
|--------|---------|
| **Planned** | In this release/phase |
| **In Progress** | Currently being built |
| **Done** | Completed and tested |
| **Backlog** | Good idea, for future |

---

## MVP Feature Checklist

### Must Have (Cannot Launch Without)
- [ ] Authentication & Onboarding
- [ ] Journal Management
- [ ] Voice Recording (with waveform) ⭐
- [ ] Video Recording (record new + select from camera roll) ⭐
- [ ] Entry Creation (voice & video as primary methods)
- [ ] Photo Support (camera + camera roll)
- [ ] Timeline View
- [ ] Entry Detail View
- [ ] Basic Search

### Should Have (Strongly Recommended)
- [ ] Family Sharing
- [ ] Audio Playback (voice entries)
- [ ] Video Playback (video entries)
- [ ] Settings screen

### Nice to Have (If Time)
- [ ] Prompts/Reminders
- [ ] Voice Editing
- [ ] Text & Photo entry types

### Should NOT Have in MVP
- ❌ Print integration (comes in Phase 3)
- ❌ Backend/cloud sync (store locally first)
- ❌ Advanced search (Phase 2)
- ❌ Web app (post-MVP)

---

## Development Priority Order

### Week 1-2: Foundation
1. Authentication screens
2. Navigation structure
3. Basic screens (Journal list, Timeline)

### Week 3-4: Voice Recording (Hero Feature #1)
1. Voice recording screen with waveform
2. Audio playback
3. Transcript display

### Week 5-6: Video Recording (Hero Feature #2)
1. Video recording screen
2. Camera roll video selection
3. Video playback
4. Video trimming

### Week 7-8: Photos & Integration
1. Photo capture (camera)
2. Photo library access
3. Photos + voice/video entries
4. Entry detail view with all media types
5. Timeline complete

### Week 9-10: Features
1. Family sharing
2. Search
3. Settings

### Week 11-12: Polish
1. Error handling
2. Animations
3. Performance optimization
4. Testing and bug fixes

---

## Estimated Effort By Feature

| Feature | Est. Time | Difficulty |
|---------|-----------|-----------|
| Authentication | 3 days | Medium |
| Journal Management | 2 days | Easy |
| Voice Recording | 5 days | Hard |
| Audio Playback | 2 days | Medium |
| Video Recording (new) | 4 days | Hard |
| Video from Camera Roll | 3 days | Medium |
| Video Playback | 2 days | Medium |
| Photo Capture & Library | 3 days | Medium |
| Entry Creation | 3 days | Medium |
| Timeline View | 2 days | Medium |
| Entry Detail | 2 days | Easy |
| Family Sharing | 4 days | Hard |
| Search | 3 days | Medium |
| Print Integration | 10 days | Very Hard |
| Reminders/Prompts | 2 days | Easy |
| Polish & Testing | 12 days | Medium |
| **Total MVP** | **~57 days** | - |

---

## Dependencies Between Features

```
Authentication
    ↓
Journal Management
    ↓
Voice Recording ⭐
    ├─→ Audio Playback
    │
Video Recording ⭐
    ├─→ Video Playback
    │
Photos
    ├─→ Entry Detail
    │   ├─→ Timeline
    │   └─→ Search
    │
All Media Types
    ↓
Family Sharing
    ↓
Notifications

Print Integration (Phase 3)
    ↑
Depends on all above
```

---

## Success Criteria By Phase

### MVP Success
- [ ] 100+ beta users
- [ ] 5+ entries per user per week
- [ ] Voice recording 85%+ accurate
- [ ] 30%+ Day 7 retention
- [ ] 0 crashes on basic flows

### Phase 2 Success
- [ ] 5K active users
- [ ] 50%+ monthly retention
- [ ] Video recording working smoothly
- [ ] Search working reliably

### Phase 3 Success
- [ ] 250+ print orders per month
- [ ] $10K+ MRR
- [ ] 40%+ monthly retention
- [ ] Print quality excellent

---

*Last Updated: Today*  
*All features subject to change based on user feedback*