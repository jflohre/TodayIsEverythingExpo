# Feature Docs

This folder contains implementation notes for the core product features in the Today Is Everything app.

## Current MVP Features

- [People & Memories](./journal-management.md)
- [Voice Recording](./voice-recording.md)
- [Video Recording](./video-recording.md)
- [Timeline](./timeline.md)
- [Entry Detail](./entry-detail.md)

## Purpose

Each document summarizes the user need, core flow, technical considerations, dependencies, and testing direction for a feature. These notes are designed to help implementation stay aligned with the product vision and architecture.

## Product Priority

The current roadmap prioritizes:

1. People and memory collection management
2. Voice recording
3. Video capture and playback
4. Timeline and entry detail
5. Search and family sharing

## Product Language

The app is organized around people first, then memories:

- People: the top-level view for family members or relationship groups
- Memories: the collection of moments for each person
- Memory Timeline: the detailed list of memories for a person or shared family event

A single memory can be tagged to multiple people so that shared experiences like a family holiday appear in each relevant timeline without being duplicated.

## Source of Truth

The live roadmap is maintained in [docs/PLANNED_FEATURES.md](../PLANNED_FEATURES.md).
