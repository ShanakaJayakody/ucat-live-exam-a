// File: src/services/examService.ts (Corrected Version)

import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Question } from '../store/examStore'; // Correct the import path if needed

// Function to fetch the entire exam document from Firestore
export const fetchExamQuestions = async (): Promise<Question[]> => {
  const docRef = doc(db, 'exams', 'ucat-live-exam-a'); // Using your document ID
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    // Assuming your document has a top-level array field named 'questions'
    // If you used the `sections` map, this would be docSnap.data().sections
    return docSnap.data().questions as Question[]; // Or adjust based on your final JSON structure
  } else {
    throw new Error("Could not find the exam document in Firestore!");
  }
};

// Function to create a new exam session when a student starts
export const createExamSession = async (userId: string) => {
  const sessionId = `${userId}_${Date.now()}`;
  const sessionRef = doc(db, 'examSessions', sessionId);
  await setDoc(sessionRef, {
    userId: userId,
    startTime: serverTimestamp(),
    isActive: true,
    answers: {}
  });
  return sessionId;
};

// Function to update the session with answers periodically
export const updateExamSession = async (sessionId: string, answers: any) => {
  const sessionRef = doc(db, 'examSessions', sessionId);
  await updateDoc(sessionRef, {
    answers: answers,
    lastUpdated: serverTimestamp()
  });
};