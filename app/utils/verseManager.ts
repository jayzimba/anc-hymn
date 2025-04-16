import AsyncStorage from '@react-native-async-storage/async-storage';
import NetInfo from '@react-native-community/netinfo';

const VERSE_STORAGE_KEY = '@anc_hymn:verse';
const VERSE_TIMESTAMP_KEY = '@anc_hymn:verse_timestamp';

interface Verse {
  text: string;
  reference: string;
  version: string;
  verseurl: string;
}

interface VerseResponse {
  verse: {
    details: Verse;
    notice: string;
  };
}

export const getVerse = async (): Promise<Verse | null> => {
  try {
    // Check internet connectivity first
    const netInfo = await NetInfo.fetch();
    
    if (netInfo.isConnected) {
      // If we have internet, always try to fetch a new verse
      const options = {
        method: 'GET',
        headers: { accept: 'application/json' }
      };

      const response = await fetch(
        'https://beta.ourmanna.com/api/v1/get?format=json&order=random',
        options
      );
      
      const data: VerseResponse = await response.json();
      const verse = data.verse.details;

      // Store the new verse and timestamp
      await AsyncStorage.setItem(VERSE_STORAGE_KEY, JSON.stringify(verse));
      await AsyncStorage.setItem(VERSE_TIMESTAMP_KEY, Date.now().toString());

      return verse;
    } else {
      // If no internet, try to get the stored verse
      const storedVerse = await AsyncStorage.getItem(VERSE_STORAGE_KEY);
      if (storedVerse) {
        return JSON.parse(storedVerse);
      }
      return null;
    }
  } catch (error) {
    console.error('Error fetching verse:', error);
    // If there's an error, try to get the stored verse
    const storedVerse = await AsyncStorage.getItem(VERSE_STORAGE_KEY);
    if (storedVerse) {
      return JSON.parse(storedVerse);
    }
    return null;
  }
};

const verseManager = {
  getVerse,
};

export default verseManager; 