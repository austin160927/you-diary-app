import AsyncStorage from '@react-native-async-storage/async-storage';
import { db, initAnonymousUser } from '../config/firebase';
import { collection, doc, setDoc, deleteDoc, getDocs } from 'firebase/firestore';
import { Entry } from '../constants/templates';

const ENTRIES_KEY = '@you_diary_entries_v1';
const USERNAME_KEY = '@you_user_display_name';

// Format Date YYYY-MM-DD
export const getTodayDateString = (): string => {
  const d = new Date();
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
};

// Format Date for UI (e.g. "Saturday, November 7, 2026")
export const formatPrettyDate = (dateStr: string): string => {
  try {
    const [y, m, d] = dateStr.split('-').map(Number);
    const date = new Date(y, m - 1, d);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      month: 'long',
      day: 'numeric',
      year: 'numeric',
    });
  } catch (e) {
    return dateStr;
  }
};

// Get User Display Name
export const getUserName = async (): Promise<string> => {
  try {
    const name = await AsyncStorage.getItem(USERNAME_KEY);
    return name || 'Me';
  } catch {
    return 'Me';
  }
};

export const setUserName = async (name: string): Promise<void> => {
  try {
    await AsyncStorage.setItem(USERNAME_KEY, name.trim());
  } catch (e) {
    console.error('Failed to save user name:', e);
  }
};

// Get all entries (Local + Cloud sync)
export const getAllEntries = async (): Promise<Entry[]> => {
  try {
    // 1. Fetch from Firestore collection 'entries'
    let cloudEntries: Entry[] = [];
    try {
      const snap = await getDocs(collection(db, 'entries'));
      snap.forEach(docSnap => {
        cloudEntries.push(docSnap.data() as Entry);
      });
    } catch (e) {
      // Offline fallback
    }

    // 2. Fetch local storage
    const localJson = await AsyncStorage.getItem(ENTRIES_KEY);
    const localEntries: Entry[] = localJson ? JSON.parse(localJson) : [];

    // 3. Merge seamlessly without duplicates
    const map = new Map<string, Entry>();
    [...localEntries, ...cloudEntries].forEach(item => {
      const existing = map.get(item.id);
      if (!existing || item.updatedAt > existing.updatedAt) {
        map.set(item.id, item);
      }
    });

    const merged = Array.from(map.values()).sort((a, b) => b.timestamp - a.timestamp);
    await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(merged));
    return merged;
  } catch (error) {
    console.error('Error fetching entries:', error);
    return [];
  }
};

// Save or Update Entry (Auto-save debounced target)
export const saveEntry = async (entry: Entry): Promise<void> => {
  try {
    // 1. Immediate local save for high speed
    const list = await getAllEntries();
    const updated = [entry, ...list.filter(e => e.id !== entry.id)];
    await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(updated));

    // 2. Direct Sync to Firestore collection 'entries'
    try {
      const docRef = doc(db, 'entries', entry.id);
      await setDoc(docRef, entry);
      console.log('Successfully saved to you-diary-app Firestore:', entry.id);
    } catch (cloudErr) {
      console.error('Firebase save error:', cloudErr);
    }
  } catch (err) {
    console.error('Error in saveEntry:', err);
    throw err;
  }
};

// Delete entry
export const deleteEntry = async (id: string): Promise<void> => {
  try {
    const list = await getAllEntries();
    const filtered = list.filter(e => e.id !== id);
    await AsyncStorage.setItem(ENTRIES_KEY, JSON.stringify(filtered));

    try {
      const docRef = doc(db, 'entries', id);
      await deleteDoc(docRef);
      console.log('Successfully deleted from you-diary-app Firestore:', id);
    } catch (e) {
      console.error('Firebase delete error:', e);
    }
  } catch (err) {
    console.error('Error deleting entry:', err);
    throw err;
  }
};
