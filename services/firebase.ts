// NOTE: This is a MOCK implementation to allow the app to run without a real Firebase project.
// To use real Firebase:
// 1. Create a project at console.firebase.google.com
// 2. Enable Authentication (Email/Password)
// 3. Copy your config keys into a real firebaseConfig object
// 4. Uncomment the real Firebase imports and logic at the bottom (and remove this mock)

export interface User {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
}

// Mock state to persist login across reloads
const STORAGE_KEY = 'finease_mock_user';
let currentUser: User | null = null;

try {
  const stored = localStorage.getItem(STORAGE_KEY);
  if (stored) currentUser = JSON.parse(stored);
} catch (e) {
  console.error('Failed to parse mock user', e);
}

const listeners: Set<(user: User | null) => void> = new Set();

const notifyListeners = () => {
  listeners.forEach(listener => listener(currentUser));
};

// --- MOCK API FUNCTIONS MATCHING FIREBASE SIGNATURES ---

export const auth = { currentUser }; // Mock auth object

export const onAuthStateChanged = (
  _auth: any, 
  nextOrObserver: (user: User | null) => void
) => {
  listeners.add(nextOrObserver);
  // Trigger initial state
  setTimeout(() => nextOrObserver(currentUser), 100); 
  return () => {
    listeners.delete(nextOrObserver);
  };
};

export const signInWithEmailAndPassword = async (_auth: any, email: string, password: string) => {
  await new Promise(resolve => setTimeout(resolve, 800)); // Simulate network delay
  
  if (!email.includes('@')) throw new Error('Invalid email address');
  if (password.length < 6) throw new Error('Password must be at least 6 characters');

  // Create a mock user
  currentUser = {
    uid: 'mock-uid-' + Date.now(),
    email,
    displayName: email.split('@')[0], // Default name from email
    photoURL: null
  };
  
  localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
  notifyListeners();
  
  return { user: currentUser };
};

export const createUserWithEmailAndPassword = async (_auth: any, email: string, password: string) => {
  // In this mock, sign up is the same as sign in (creates the session)
  return signInWithEmailAndPassword(_auth, email, password);
};

export const signOut = async (_auth: any) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  currentUser = null;
  localStorage.removeItem(STORAGE_KEY);
  notifyListeners();
};

export const updateProfile = async (user: User, { displayName }: { displayName: string }) => {
  await new Promise(resolve => setTimeout(resolve, 400));
  if (currentUser) {
    currentUser = { ...currentUser, displayName };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
    notifyListeners();
  }
};
