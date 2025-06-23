Care Notes Application

A React.js application for managing care notes in a nursing home environment, built with TypeScript, Redux Toolkit, and offline-first architecture using PouchDB.

🏗️ Architecture Overview

This application follows a layered architecture pattern:

UI Layer: React components for user interface

State Management Layer: Redux Toolkit for predictable state management

Data Layer: Offline database using PouchDB

API Layer: HTTP client for server communication

Data Flow

The application implements an offline-first approach with the following data flow:

Server → Local DB: Fetch notes from the server via the API layer (polling every 60s).

Local DB → Redux: Update the Redux store with the 5 most recent notes from the PouchDB database.

Redux → UI: Display notes from the Redux state in the user interface.

UI → Local DB → Server: New notes are saved in PouchDB first, then synced to the server.

🚀 Features

Offline-First Architecture: Works seamlessly without internet connections.

Real-time Sync: Automatic synchronization with the server every 60 seconds.

Redux State Management: Predictable state with Redux Toolkit.

Form Validation: Client-side validation with user-friendly error messages.

Responsive Design: Works on desktop, tablet, and mobile devices.

Error Handling: Graceful error handling with fallback to local database.

TypeScript: End-to-end type safety across the application.

📁 Project Structure

src/
├── api/
│   └── careNotesApi.ts          # API client for server communication
├── app/
│   └── store.ts                 # Redux store configuration
├── features/
│   └── careNotes/
│       └── careNotesSlice.ts    # Redux slice for care notes
├── db/
│   └── localDb.ts               # PouchDB implementation for offline storage
├── components/
│   ├── CareNoteList.tsx         # Care notes list view component
│   └── AddCareNoteForm.tsx      # Add care note form component
├── pages/
│   └── HomePage.tsx             # Main page component
├── App.tsx                      # Root application component
└── index.tsx                    # Application entry point

🛠️ Technology Stack

Frontend Framework: React 18 + TypeScript

State Management: Redux Toolkit

Styling: CSS3 with responsive design

Local Storage: PouchDB for offline data persistence

Build Tool: Create React App

Package Manager: Yarn

📋 Prerequisites

Node.js 16.0 or higher

Yarn 1.22 or higher

🚀 Getting Started

Installation

Clone the repository

git clone <repository-url>
cd care-notes-app

Install dependencies

yarn install

Start the development server

yarn start

Open your browser
Navigate to http://localhost:3000

Available Scripts

yarn start - Runs the app in development mode

yarn build - Builds the app for production

yarn test - Launches the test runner

yarn eject - Ejects from Create React App (one-way operation)

🔧 Configuration

Environment Variables

Create a .env file in the root directory:

REACT_APP_API_URL=http://localhost:3001/api

Mock Server Setup

For development, you’ll need a mock server running on port 3001. The API expects these endpoints:

GET /api/care-notes - Returns an array of care notes

POST /api/care-notes - Creates a new care note

📱 Usage

Viewing Care Notes

The main page displays the 5 most recent care notes.

Use the "Filter by Resident" dropdown to filter notes.

Notes automatically refresh every 60 seconds.

Sync status is shown at the top of the list.

Adding Care Notes

Click the "+ Add Note" button.

Fill in the required fields:

Resident Name: Full name of the resident

Author Name: Name of the staff member creating the note

Note Content: Detailed care note (minimum 10 characters)

Click "Submit" to save the note.

The note is saved in PouchDB first, then synced to the server.

Offline Functionality

The app works offline by storing data in PouchDB.

New notes created offline will be synced when the connection is restored.

If the server is unavailable, the app operates with offline data.

Offline status is indicated in the sync status area.

🔄 Data Synchronization

The application implements a sophisticated data synchronization strategy:

Sync Process

Initial Load: Fetch data from the server and store it in PouchDB.

Periodic Sync: Poll the server every 60 seconds for updates.

Offline Handling: Operate using PouchDB when the server is unavailable.

Conflict Resolution: The server data takes precedence over the local data.

🧪 Testing Strategy

Recommended Testing Approach

Unit Tests: Test individual components and functions.

Integration Tests: Test component interactions.

E2E Tests: Simulate complete user workflows.

Offline Tests: Validate offline-first behavior.

Testing Tools

Jest: Unit testing framework.

React Testing Library: Utilities for component testing.

MSW: Mock Service Worker for API mocking.



Note: This application is designed as a coding exercise and demonstrates best practices for React, TypeScript, Redux Toolkit, and offline-first architecture using PouchDB. In a production environment, additional considerations for security, scalability, and compliance would be necessary.

