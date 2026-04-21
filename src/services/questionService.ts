import { 
  collection, 
  doc, 
  getDocs, 
  getDoc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where,
  serverTimestamp,
  Timestamp
} from 'firebase/firestore';
import { db } from '../lib/firebase';
import { AIQuestion, AIAnswer, Citation } from '../types';

const BRANDS_COLLECTION = 'brands';

export const questionService = {
  async getQuestions(brandId: string): Promise<AIQuestion[]> {
    const questionsCol = collection(db, BRANDS_COLLECTION, brandId, 'questions');
    const snapshot = await getDocs(questionsCol);
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      question_id: doc.id,
      created_at: (doc.data().created_at as Timestamp)?.toDate().toISOString(),
      last_collected_at: (doc.data().last_collected_at as Timestamp)?.toDate().toISOString() || null
    } as AIQuestion));
  },

  async getLatestAnswer(brandId: string, questionId: string): Promise<AIAnswer | null> {
    const answersCol = collection(db, BRANDS_COLLECTION, brandId, 'questions', questionId, 'answers');
    // For now just get the latest one by collected_at
    const snapshot = await getDocs(answersCol);
    if (snapshot.empty) return null;
    const items = snapshot.docs.map(doc => ({
      ...doc.data(),
      answer_id: doc.id,
      collected_at: (doc.data().collected_at as Timestamp)?.toDate().toISOString(),
      created_at: (doc.data().created_at as Timestamp)?.toDate().toISOString()
    } as AIAnswer));
    return items.sort((a,b) => b.collected_at.localeCompare(a.collected_at))[0];
  },

  async getAnswerHistory(brandId: string, questionId: string): Promise<AIAnswer[]> {
    const answersCol = collection(db, BRANDS_COLLECTION, brandId, 'questions', questionId, 'answers');
    const snapshot = await getDocs(answersCol);
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      answer_id: doc.id,
      collected_at: (doc.data().collected_at as Timestamp)?.toDate().toISOString(),
      created_at: (doc.data().created_at as Timestamp)?.toDate().toISOString()
    } as AIAnswer)).sort((a,b) => b.collected_at.localeCompare(a.collected_at));
  },

  async getCitations(brandId: string, questionId: string, answerId: string): Promise<Citation[]> {
    const citationsCol = collection(db, BRANDS_COLLECTION, brandId, 'questions', questionId, 'answers', answerId, 'citations');
    const snapshot = await getDocs(citationsCol);
    return snapshot.docs.map(doc => ({
      ...doc.data(),
      citation_id: doc.id,
      created_at: (doc.data().created_at as Timestamp)?.toDate().toISOString()
    } as Citation));
  },

  async addQuestion(brandId: string, question: Omit<AIQuestion, 'question_id' | 'created_at' | 'last_collected_at'>): Promise<string> {
    const questionsCol = collection(db, BRANDS_COLLECTION, brandId, 'questions');
    const docRef = await addDoc(questionsCol, {
      ...question,
      brand_id: brandId,
      created_at: serverTimestamp(),
      last_collected_at: null,
      status: 'ACTIVE'
    });
    return docRef.id;
  },

  async updateQuestion(brandId: string, questionId: string, updates: Partial<AIQuestion>): Promise<void> {
    const questionRef = doc(db, BRANDS_COLLECTION, brandId, 'questions', questionId);
    // Remove immutable or calculated fields from updates
    const { question_id, brand_id, created_at, ...validUpdates } = updates as any;
    await updateDoc(questionRef, {
      ...validUpdates,
      updated_at: serverTimestamp() // If we tracked this separately
    });
  },

  async deleteQuestion(brandId: string, questionId: string): Promise<void> {
    const questionRef = doc(db, BRANDS_COLLECTION, brandId, 'questions', questionId);
    await deleteDoc(questionRef);
  }
};
