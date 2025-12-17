import express, { Request, Response } from 'express';
import * as db from '../db.ts';
import type { DbQuestion, CreateQuestionRequest, DbDiaryEntry, DiaryEntry, DiaryByDate, CreateDiaryEntryRequest, UpdateDiaryEntryRequest } from '../types.ts';
import { formatDate } from '../types.ts';

const router = express.Router();

// Get all active questions
router.get('/questions', async (_req: Request, res: Response) => {
  try {
    const result = await db.query<DbQuestion>(`
      SELECT * FROM questions 
      WHERE active = true 
      ORDER BY "order" ASC
    `);
    res.json(result.rows);
  } catch (e) {
    const error = e as Error;
    res.status(500).json({ error: error.message });
  }
});

// Add a new question
router.post('/questions', async (req: Request<object, object, CreateQuestionRequest>, res: Response) => {
  const { id, text, order, active, date } = req.body;
  if (!id || !text) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    await db.query(`
      INSERT INTO questions (id, text, "order", active, date)
      VALUES ($1, $2, $3, $4, $5)
    `, [id, text, order || 999, active !== undefined ? active : true, date || '']);
    res.json({ ok: true });
  } catch (e) {
    const error = e as Error;
    res.status(500).json({ error: error.message });
  }
});

// Get all diary entries (bulk fetch for initial load)
router.get('/diary', async (_req: Request, res: Response) => {
  try {
    const result = await db.query<DbDiaryEntry>('SELECT * FROM diary_entries');
    
    const diaryByDate: DiaryByDate = {};
    result.rows.forEach(e => {
      const dateStr = formatDate(e.date);
      
      if (!diaryByDate[dateStr]) diaryByDate[dateStr] = [];
      
      diaryByDate[dateStr].push({
        id: e.id,
        date: dateStr,
        questionId: e.question_id,
        answer: e.answer,
        createdAt: e.created_at?.toISOString() || null
      });
    });
    res.json(diaryByDate);
  } catch (e) {
    const error = e as Error;
    res.status(500).json({ error: error.message });
  }
});

// Create a single diary entry
router.post('/diary-entries', async (req: Request<object, object, CreateDiaryEntryRequest>, res: Response) => {
  const { id, date, questionId, answer, createdAt } = req.body;
  if (!id || !date || !questionId) {
    return res.status(400).json({ error: 'Missing required fields: id, date, questionId' });
  }
  
  try {
    await db.query(`
      INSERT INTO diary_entries (id, date, question_id, answer, created_at)
      VALUES ($1, $2, $3, $4, $5)
      ON CONFLICT (id)
      DO UPDATE SET 
        answer = EXCLUDED.answer,
        date = EXCLUDED.date,
        question_id = EXCLUDED.question_id
    `, [id, date, questionId, answer || '', createdAt || new Date().toISOString()]);
    
    res.json({ ok: true });
  } catch (e) {
    const error = e as Error;
    res.status(500).json({ error: error.message });
  }
});

// Update a single diary entry
router.patch('/diary-entries/:id', async (req: Request<{ id: string }, object, UpdateDiaryEntryRequest>, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  
  // Build dynamic update query
  const fields: string[] = [];
  const values: unknown[] = [id];
  let idx = 2;
  
  if (updates.answer !== undefined) {
    fields.push(`answer = $${idx++}`);
    values.push(updates.answer);
  }
  if (updates.date !== undefined) {
    fields.push(`date = $${idx++}`);
    values.push(updates.date);
  }
  if (updates.questionId !== undefined) {
    fields.push(`question_id = $${idx++}`);
    values.push(updates.questionId);
  }
  
  if (fields.length === 0) {
    return res.json({ ok: true }); // Nothing to update
  }
  
  try {
    const result = await db.query<DbDiaryEntry>(`
      UPDATE diary_entries 
      SET ${fields.join(', ')}
      WHERE id = $1
      RETURNING *
    `, values);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Diary entry not found' });
    }
    
    const e = result.rows[0];
    const dateStr = formatDate(e.date);
    
    const entry: DiaryEntry = {
      id: e.id,
      date: dateStr,
      questionId: e.question_id,
      answer: e.answer,
      createdAt: e.created_at?.toISOString() || null
    };
    res.json(entry);
  } catch (e) {
    const error = e as Error;
    res.status(500).json({ error: error.message });
  }
});

// Delete a single diary entry
router.delete('/diary-entries/:id', async (req: Request<{ id: string }>, res: Response) => {
  const { id } = req.params;
  
  try {
    const result = await db.query<{ id: string }>('DELETE FROM diary_entries WHERE id = $1 RETURNING id', [id]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Diary entry not found' });
    }
    
    res.json({ ok: true });
  } catch (e) {
    const error = e as Error;
    res.status(500).json({ error: error.message });
  }
});

export default router;
