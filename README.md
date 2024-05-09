# Offline Form Handling with Service Workers and IndexedDB

Code Example for this article: [Offline Form Handling with Service Workers and IndexedDB](https://dennistowns.substack.com/p/offline-first-forms-with-react-service)

This project demonstrates how to use service workers alongside IndexedDB to create a robust offline experience for web form submissions. It enables storing form data locally when the client is offline and synchronizes it with the server once connectivity is restored.

## Key Features

- **Service Worker Registration**: Automatically registers a service worker to manage offline capabilities and background sync.
- **Offline Data Storage**: Uses IndexedDB to store form data locally when offline.
- **Background Sync**: Implements background synchronization using the Service Worker's SyncManager.
- **Dynamic UI Updates**: Updates the UI based on connectivity status and data synchronization.

## Prerequisites

Before you begin, ensure you have the following installed:
- Node.js (version 12.x or later)
- npm (usually comes with Node.js)

## Installation

Follow these steps to get your development environment set up:

1. Install Bun runtime https://bun.sh
2. Clone this repository.
3 run `cd offline-form-frontend && bun install && bun run dev` to install the project deps for the frontend
4. run `cd offline-form-backend && bun install && bun run dev` to install the project deps for the backend

## Usage
Fill out the form and submit it while offline. The form data will be stored locally and synchronized with the server once connectivity is restored.
