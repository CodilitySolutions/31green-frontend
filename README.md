# Care Notes Application

A React.js application for managing care notes in a nursing home environment, built with TypeScript, Redux Toolkit, and offline-first architecture.

## 🏗️ Architecture Overview

This application follows a layered architecture pattern:

- **UI Layer**: React components for user interface
- **State Management Layer**: Redux Toolkit for predictable state management
- **Data Layer**: Local database for offline storage using localStorage
- **API Layer**: HTTP client for server communication

### Data Flow

The application implements an offline-first approach with the following data flow:

1. **Server → Local DB**: Fetch notes from server via API layer (polling every 60s)
2. **Local DB → Redux**: Update Redux store with 5 most recent notes from local database
3. **Redux → UI**: Display notes from Redux state in the user interface
4. **UI → Local DB → Server**: New notes saved locally first, then synced to server

## 🚀 Features

- **Offline-First Architecture**: Works seamlessly without internet connection
- **Real-time Sync**: Automatically syncs with server every 60 seconds
- **Redux State Management**: Predictable state management with Redux Toolkit
- **Form Validation**: Client-side validation with user-friendly error messages
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Error Handling**: Graceful error handling with fallback to local storage
- **TypeScript**: Full type safety throughout the application

## 📁 Project Structure

\`\`\`
src/
├── api/
│   └── careNotesApi.ts          # API client for server communication
├── app/
│   └── store.ts                 # Redux store configuration
├── features/
│   └── careNotes/
│       └── careNotesSlice.ts    # Redux slice for care notes
├── db/
│   └── localDb.ts               # Local database implementation
├── components/
│   ├── CareNoteList.tsx         # Care notes list view component
│   └── AddCareNoteForm.tsx      # Add care note form component
├── pages/
│   └── HomePage.tsx             # Main page component
├── App.tsx                      # Root application component
└── index.tsx                    # Application entry point
\`\`\`

## 🛠️ Technology Stack

- **Frontend Framework**: React 18 with TypeScript
- **State Management**: Redux Toolkit
- **Styling**: CSS3 with responsive design
- **Local Storage**: localStorage API for offline data persistence
- **Build Tool**: Create React App
- **Package Manager**: npm

## 📋 Prerequisites

- Node.js 16.0 or higher
- npm 7.0 or higher

## 🚀 Getting Started

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd care-notes-app
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Start the development server**
   \`\`\`bash
   npm start
   \`\`\`

4. **Open your browser**
   Navigate to [http://localhost:3000](http://localhost:3000)

### Available Scripts

- `npm start` - Runs the app in development mode
- `npm build` - Builds the app for production
- `npm test` - Launches the test runner
- `npm eject` - Ejects from Create React App (one-way operation)

## 🔧 Configuration

### Environment Variables

Create a `.env` file in the root directory:

\`\`\`env
REACT_APP_API_URL=http://localhost:3001/api
\`\`\`

### Mock Server Setup

For development, you'll need a mock server running on port 3001. The API expects these endpoints:

- `GET /api/care-notes` - Returns array of care notes
- `POST /api/care-notes` - Creates a new care note

## 📱 Usage

### Viewing Care Notes

1. The main page displays the 5 most recent care notes
2. Use the "Filter by Resident" dropdown to filter notes by specific residents
3. Notes automatically refresh every 60 seconds
4. Sync status is displayed at the top of the list

### Adding Care Notes

1. Click the "+ Add Note" button
2. Fill in the required fields:
   - **Resident Name**: Full name of the resident
   - **Author Name**: Name of the staff member creating the note
   - **Note Content**: Detailed care note (minimum 10 characters)
3. Click "Submit" to save the note
4. The note is saved locally first, then synced to the server

### Offline Functionality

- The app works offline by storing data in browser localStorage
- New notes created offline will be synced when connection is restored
- If the server is unavailable, the app falls back to local data
- Offline status is indicated in the sync status area

## 🏗️ Component Documentation

### CareNoteList Component

**Purpose**: Displays a list of care notes with filtering capabilities

**Props**:
- `onAddNote: () => void` - Callback function to show the add note form

**Features**:
- Displays 5 most recent care notes
- Filtering by resident name
- Loading and error states
- Sync status indicator
- Responsive design

### AddCareNoteForm Component

**Purpose**: Provides a form interface for adding new care notes

**Props**:
- `onClose: () => void` - Callback function to close the form

**Features**:
- Form validation with error messages
- Character count for note content
- Offline-first saving approach
- Loading states during submission
- Responsive design

### HomePage Component

**Purpose**: Main page component that manages application state and layout

**Features**:
- Manages view switching between list and form
- Handles data synchronization
- Sets up polling for server sync
- Provides Redux dispatch context

## 🔄 Data Synchronization

The application implements a sophisticated data synchronization strategy:

### Sync Process

1. **Initial Load**: Fetch data from server and store in local database
2. **Periodic Sync**: Poll server every 60 seconds for updates
3. **Offline Handling**: Fall back to local data when server is unavailable
4. **Conflict Resolution**: Server data takes precedence over local data

### Local Database

The local database (`localDb.ts`) provides:

- **Persistent Storage**: Uses localStorage for data persistence
- **CRUD Operations**: Create, read, update operations for care notes
- **Metadata Tracking**: Tracks sync times and database statistics
- **Error Handling**: Graceful error handling for storage operations

## 🎨 Styling and UI/UX

### Design Principles

- **Clean and Professional**: Healthcare-appropriate design
- **Accessibility**: Proper ARIA labels and keyboard navigation
- **Responsive**: Works on all device sizes
- **User Feedback**: Loading states, error messages, and success indicators

### CSS Architecture

- **Component-Scoped**: Each component has its own CSS file
- **BEM Methodology**: Block, Element, Modifier naming convention
- **Mobile-First**: Responsive design starting from mobile
- **CSS Variables**: Consistent color scheme and spacing

## 🧪 Testing Strategy

### Recommended Testing Approach

1. **Unit Tests**: Test individual components and functions
2. **Integration Tests**: Test component interactions
3. **E2E Tests**: Test complete user workflows
4. **Offline Tests**: Test offline functionality

### Testing Tools

- **Jest**: Unit testing framework
- **React Testing Library**: Component testing utilities
- **MSW**: Mock Service Worker for API mocking

## 🚀 Deployment

### Build for Production

\`\`\`bash
npm run build
\`\`\`

This creates a `build` folder with optimized production files.

### Deployment Options

- **Static Hosting**: Netlify, Vercel, GitHub Pages
- **CDN**: AWS CloudFront, Azure CDN
- **Traditional Hosting**: Apache, Nginx

## 🔮 Future Enhancements

### Immediate Improvements

1. **Real Database Integration**: Replace mock API with actual database
2. **User Authentication**: Secure login system for staff
3. **WebSocket Integration**: Real-time updates instead of polling
4. **Advanced Offline Storage**: IndexedDB for better offline capabilities

### Long-term Features

1. **Search Functionality**: Full-text search across care notes
2. **Data Export**: Export notes to PDF or CSV
3. **Audit Trail**: Track changes and maintain history
4. **Push Notifications**: Alert staff of important updates
5. **Mobile App**: React Native version for mobile devices
6. **Advanced Analytics**: Reporting and analytics dashboard

## 🐛 Troubleshooting

### Common Issues

1. **Local Storage Full**: Clear browser data or implement storage cleanup
2. **Sync Failures**: Check network connection and server status
3. **Performance Issues**: Implement pagination for large datasets
4. **Browser Compatibility**: Ensure localStorage support

### Debug Mode

Enable debug logging by setting:
\`\`\`javascript
localStorage.setItem('debug', 'true');
\`\`\`

## 📄 License

This project is for demonstration purposes as part of a coding exercise.



# Backend code Run
create the virtual enviorment

```bash
python3 -m venv venv
```

activate this enviorment

```bash
source venv/bin/activate
```

Install dependencies

```bash
pip install -r requirements.txt
```

Run FastAPI server

```bash
uvicorn care_notes_backend.main:app --host 0.0.0.0 --port 8000 --reload
```

