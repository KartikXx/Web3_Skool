# Authentication Flow in Blockchain Heroes

## Overview

Blockchain Heroes implements a dual-authentication approach where users must first authenticate with email/password credentials before connecting their Web3 wallet. This design provides several benefits:

1. Enhanced security by requiring multiple authentication factors
2. Better user identification through email accounts
3. Ability to associate on-chain activities with user accounts
4. Protection against wallet spoofing or unauthorized wallet connections

## Authentication States

The application manages authentication through the following states:

| State | Email Auth | Wallet Connection | Access Level |
|-------|-----------|-------------------|--------------|
| Unauthenticated | No | No | Public pages only |
| Email Authenticated | Yes | No | Basic account pages |
| Fully Authenticated | Yes | Yes | All features including wallet transactions |

## Authentication Flow Diagram

```
┌─────────────────┐     ┌─────────────────┐     ┌─────────────────┐
│                 │     │                 │     │                 │
│   Public Pages  │────▶│  Authentication │────▶│ Protected Pages │
│                 │     │   (Sign In)     │     │                 │
└─────────────────┘     └─────────────────┘     └─────────────────┘
                                │                        │
                                │                        │
                                ▼                        ▼
                        ┌─────────────────┐     ┌─────────────────┐
                        │                 │     │                 │
                        │ Wallet Connect  │◀───▶│  User Actions   │
                        │                 │     │                 │
                        └─────────────────┘     └─────────────────┘
                                │
                                │
                                ▼
                        ┌─────────────────┐
                        │                 │
                        │    Logout       │
                        │                 │
                        └─────────────────┘
```

## Implementation Details

### Components Involved

1. **AuthContext** - Manages user authentication state
2. **FirebaseContext** - Handles Firebase authentication operations
3. **Web3Context** - Manages web3 wallet connections
4. **useAuthentication Hook** - Combines auth contexts for simplified access
5. **ProtectedRoute** - Route-level protection for authenticated pages

### Authentication Process

1. **Sign Up / Sign In**
   - User enters email and password
   - Firebase authentication verifies credentials
   - If successful, user profile is created/loaded
   - Auth state is updated with user information
   - User is redirected to the requested protected page

2. **Wallet Connection**
   - Only available after email authentication
   - User clicks "Connect Wallet" button
   - Web3Context initiates wallet connection request
   - User approves connection in wallet extension
   - Wallet address is associated with user profile
   - Wallet state is stored for future connections

3. **Logout Process**
   - User clicks "Sign Out" button
   - Active wallet connection is disconnected first
   - User is signed out from Firebase
   - All authentication state is cleared
   - Local storage entries are removed
   - Page is reloaded to reset application state
   - User is redirected to home page

## Security Considerations

1. **Authentication State Storage**
   - User tokens are stored securely in localStorage
   - Firebase handles token rotation and expiration
   - Wallet connection state is tracked separately

2. **Route Protection**
   - Protected routes verify authentication status
   - Redirects to sign-in when authentication is missing
   - Passes location state to return after authentication

3. **Wallet Session**
   - Wallet connection requires prior email authentication
   - Disconnecting the wallet doesn't log out the user
   - Logging out properly disconnects wallet first

## Error Handling

- Authentication attempts show loading states during processing
- Failed login/signup shows contextual error messages
- Authentication state changes trigger UI updates
- Invalid authentication states redirect to the login page
- Network errors during wallet connection are gracefully handled 