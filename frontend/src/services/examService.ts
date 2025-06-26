// File: src/services/examService.ts (Corrected Version)

import { db } from '../firebase';
import { doc, getDoc, setDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Question } from '../store/examStore'; // Make sure this path is correct

// FIX: The function now accepts an examId as an argument
export const fetchExamQuestions = async (examId: string): Promise<Question[]> => {
  // FIX: The hardcoded ID is replaced with the examId parameter
  const docRef = doc(db, 'exams', examId); 
  const docSnap = await getDoc(docRef);

  if (docSnap.exists()) {
    // This assumes your Firestore document contains a single top-level array field named 'questions'.
    // Based on your JSON file, this should be correct.
    return docSnap.data().questions as Question[];
  } else {
    throw new Error(`Could not find the exam document with ID: ${examId}`);
  }
};

// --- The other functions below remain the same ---

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