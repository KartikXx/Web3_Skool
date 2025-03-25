# Blockchain Heroes

A gamified blockchain learning platform that helps users explore the world of Web3 through interactive quests, achievements, and a competitive leaderboard.


## Features

- 🎮 **Interactive Quests**: Learn blockchain concepts through practical, engaging quests
- 🏆 **Achievement System**: Earn tokens and unlock achievements as you progress
- 📊 **Real-time Leaderboard**: Compete with others and track your progress
- 👛 **Wallet Integration**: Connect your crypto wallet for a seamless experience
- 🔥 **Firebase Integration**: Real-time data synchronization and user authentication
- 🎨 **Modern UI/UX**: Clean, responsive design with dark mode support

## Tech Stack

- **Frontend**: React, TypeScript, Tailwind CSS, shadcn/ui
- **State Management**: React Context, TanStack Query
- **Authentication**: Firebase Authentication
- **Database**: Firebase Firestore
- **Animation**: Framer Motion
- **Routing**: React Router v6
- **Blockchain**: Ethers.js for wallet connection

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/blockchain-questers.git
   cd blockchain-questers
   ```

2. Install dependencies:
   ```bash
   npm install --legacy--peers-deps
   ```

3. Create a Firebase project:
   - Go to the [Firebase Console](https://console.firebase.google.com/)
   - Create a new project
   - Enable Authentication (Email/Password)
   - Create Firestore database
   - Get your Firebase config

4. Create a `.env.local` file in the root directory:
   ```
   VITE_FIREBASE_API_KEY=your-api-key
   VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

5. (Optional) Seed your database:
   - Create a service account key in Firebase Project Settings > Service Accounts
   - Save as `firebase/serviceAccountKey.json` (this file is gitignored)
   - Run `node firebase/seed.js`

6. Start the development server:
   ```bash
   npm run dev
   ```

7. Open [http://localhost:5173](http://localhost:5173) in your browser.

## Firebase Structure

### Collections
- `users`: User profiles with tokens, quests completed, etc.
- `quests`: Learning modules with difficulty levels and rewards
- `userQuests`: User-quest relationship data (started, completed)
- `achievements`: Unlockable achievements and rewards
- `userAchievements`: User-achievement relationship data

## Deployment

### Deploying to Firebase Hosting

1. Install Firebase CLI:
   ```bash
   npm install -g firebase-tools
   ```

2. Login to Firebase:
   ```bash
   firebase login
   ```

3. Initialize Firebase:
   ```bash
   firebase init
   ```
   Select Hosting and your Firebase project.

4. Build the project:
   ```bash
   npm run build
   ```

5. Deploy to Firebase:
   ```bash
   firebase deploy
   ```

# This site is now deployed on VERCEL with basic CI/CD
