import { initializeApp } from 'firebase/app';
import { getFirestore, collection, doc, setDoc, getDoc, Timestamp } from 'firebase/firestore';
import { beginnerQuests, Quest } from '../data/quests';

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCDlgOr9ktCLObXSOK1xl18VtzEP4l-z0g",
  authDomain: "blockchain-heroes.firebaseapp.com",
  projectId: "blockchain-heroes",
  storageBucket: "blockchain-heroes.firebasestorage.app",
  messagingSenderId: "794939647914",
  appId: "1:794939647914:web:b0f7b12787fa0e64ee2dd3",
  measurementId: "G-RR83CTYBJC"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const questsCollection = collection(db, 'quests');

/**
 * Seed beginner quests to Firestore
 */
async function seedQuests() {
  console.log('Starting quest seeding process...');
  
  let successCount = 0;
  let errorCount = 0;
  
  for (const quest of beginnerQuests) {
    try {
      // Check if quest already exists
      const docRef = doc(db, 'quests', quest.id);
      const docSnap = await getDoc(docRef);
      
      if (docSnap.exists()) {
        console.log(`Quest ${quest.id} already exists, skipping...`);
        continue;
      }
      
      // Format quest for Firebase
      const firestoreQuest = {
        ...quest,
        reward: {
          tokens: quest.rewards.tokens,
          xp: quest.rewards.xp
        },
        isActive: true,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      };
      
      // Add to Firestore
      await setDoc(doc(questsCollection, quest.id), firestoreQuest);
      
      console.log(`Added quest: ${quest.title}`);
      successCount++;
    } catch (error) {
      console.error(`Error adding quest ${quest.id}:`, error);
      errorCount++;
    }
  }
  
  console.log(`\nSeeding completed!`);
  console.log(`Successfully added ${successCount} quests`);
  
  if (errorCount > 0) {
    console.log(`Failed to add ${errorCount} quests`);
  }
}

// Run the seed function
seedQuests()
  .then(() => {
    console.log('Quest seeding script finished');
    process.exit(0);
  })
  .catch((error) => {
    console.error('Error running seed script:', error);
    process.exit(1);
  }); 