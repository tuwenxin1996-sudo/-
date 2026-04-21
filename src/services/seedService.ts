import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { questionService } from './questionService';

const MOCK_DATA = [
  { 
    question_text: '夏天出油多，求推荐控油且不暗沉的粉底液？', 
    question_type: 'PRODUCT', 
    priority: 'HIGH', 
    frequency_minutes: 60,
    status: 'ACTIVE'
  },
  { 
    question_text: '敏感肌干性皮肤适合用哪款气垫？', 
    question_type: 'SCENE', 
    priority: 'NORMAL', 
    frequency_minutes: 360,
    status: 'ACTIVE'
  },
  { 
    question_text: '笔镜NoteLens的主打款粉底好用吗？', 
    question_type: 'BRAND', 
    priority: 'CORE', 
    frequency_minutes: 60,
    status: 'ACTIVE'
  }
];

export const seedMockQuestions = async (brandId: string) => {
  const existing = await questionService.getQuestions(brandId);
  if (existing.length === 0) {
    for (const q of MOCK_DATA) {
      const qId = await questionService.addQuestion(brandId, q as any);
      
      const answersRef = collection(db, 'brands', brandId, 'questions', qId, 'answers');
      // Add a mock answer (Previous one)
      const prevAnswerDoc = await addDoc(answersRef, {
        question_id: qId,
        collected_at: new Date(Date.now() - 86400000), // 1 day ago
        created_at: new Date(Date.now() - 86400000),
        answer_hash: 'prev_hash_' + Math.random().toString(36).substring(7),
        is_duplicate: false,
        parsed_answer_md: `这是昨天的采集记录：针对“${q.question_text}”，AI 认为该产品效果尚可，但控油持久度仍需观察。\n\n[2] 参考了旧的测评内容。`,
        citation_count: 1,
        our_citation_count: 0,
        top_position: 2,
        collection_cost_ms: 1000,
        collector_account_id: 'acc_demo_01'
      });

      const prevCitationsRef = collection(db, 'brands', brandId, 'questions', qId, 'answers', prevAnswerDoc.id, 'citations');
      await addDoc(prevCitationsRef, {
        answer_id: prevAnswerDoc.id,
        note_id: 'note_old_999',
        position: 2,
        citation_type: 'PARTIAL',
        cited_text: '控油效果还可以，但下午稍微有点脱妆。',
        brand_attribution: 'NEUTRAL',
        relevance_score: 0.8,
        created_at: serverTimestamp()
      });

      // Add a mock answer (Current one)
      const answerDoc = await addDoc(answersRef, {
        question_id: qId,
        collected_at: serverTimestamp(),
        created_at: serverTimestamp(),
        answer_hash: Math.random().toString(36).substring(7),
        is_duplicate: false,
        parsed_answer_md: `针对您关于“${q.question_text}”的咨询，笔镜 NoteLens 的 AI 会根据全网口碑和实时评测为您解析：\n\n1. **肤感表现**：这款产品在控油能力上非常出色，适合混合及油性肤质。\n2. **持久度**：经过 8 小时实测，基本不产生暗沉。\n3. **用户反馈**：大部分用户认为其遮瑕力属于中上等。\n\n[1] 参考了小红书上的热门测评。`,
        citation_count: 1,
        our_citation_count: 1,
        top_position: 1,
        collection_cost_ms: 1200,
        collector_account_id: 'acc_demo_01'
      });

      // Add a mock citation
      const citationsRef = collection(db, 'brands', brandId, 'questions', qId, 'answers', answerDoc.id, 'citations');
      await addDoc(citationsRef, {
        answer_id: answerDoc.id,
        note_id: 'note_xhs_12345',
        position: 1,
        citation_type: 'FULL_QUOTE',
        cited_text: '笔镜粉底液在控油测试中表现惊艳，维持整天不暗沉。',
        brand_attribution: 'OURS',
        relevance_score: 0.95,
        created_at: serverTimestamp()
      });
    }
    return true;
  }
  return false;
};
