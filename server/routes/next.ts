import express, { Request, Response } from 'express';
import * as db from '../db.ts';
import type { DbNextItem, NextItem, CreateNextItemRequest, UpdateNextItemRequest } from '../types.ts';

const router = express.Router();

// Get all active next items
router.get('/next', async (_req: Request, res: Response) => {
  try {
    const result = await db.query<DbNextItem>(`
      SELECT * FROM next_items 
      WHERE deleted_at IS NULL AND started_at IS NULL
    `);
    
    const items: NextItem[] = result.rows.map(item => ({
      id: item.id,
      title: item.title,
      content: item.content,
      color: item.color,
      size: item.size,
      createdAt: item.created_at?.toISOString() || null,
      deletedAt: item.deleted_at?.toISOString() || null,
      startedAt: item.started_at?.toISOString() || null
    }));
    
    res.json(items);
  } catch (e) {
    const error = e as Error;
    res.status(500).json({ error: error.message });
  }
});

// Add a new next item
router.post('/next', async (req: Request<object, object, CreateNextItemRequest>, res: Response) => {
  const { id, title, content, color, size } = req.body;
  if (!id || !title) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  try {
    const createdAt = new Date().toISOString();
    await db.query(`
      INSERT INTO next_items (id, title, content, color, size, created_at)
      VALUES ($1, $2, $3, $4, $5, $6)
    `, [id, title, content || '', color || '#2D2D2D', size || 'medium', createdAt]);
    
    const item: NextItem = {
      id, 
      title, 
      content: content || '', 
      color: color || '#2D2D2D', 
      size: size || 'medium', 
      createdAt, 
      deletedAt: null, 
      startedAt: null
    };
    res.json(item);
  } catch (e) {
    const error = e as Error;
    res.status(500).json({ error: error.message });
  }
});

// Update a next item
router.patch('/next/:id', async (req: Request<{ id: string }, object, UpdateNextItemRequest>, res: Response) => {
  const { id } = req.params;
  const updates = req.body;
  
  // Map camelCase to snake_case for DB
  const dbUpdates: Record<string, unknown> = {};
  if (updates.title) dbUpdates.title = updates.title;
  if (updates.content) dbUpdates.content = updates.content;
  if (updates.color) dbUpdates.color = updates.color;
  if (updates.size) dbUpdates.size = updates.size;
  if (updates.deletedAt) dbUpdates.deleted_at = updates.deletedAt;
  if (updates.startedAt) dbUpdates.started_at = updates.startedAt;
  
  if (Object.keys(dbUpdates).length === 0) return res.json({ ok: true }); // Nothing to update

  try {
    const setClause = Object.keys(dbUpdates).map((key, i) => `${key} = $${i + 2}`).join(', ');
    const values = Object.values(dbUpdates);
    
    const result = await db.query<DbNextItem>(`
      UPDATE next_items 
      SET ${setClause}
      WHERE id = $1
      RETURNING *
    `, [id, ...values]);
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    const item = result.rows[0];
    const response: NextItem = {
      id: item.id,
      title: item.title,
      content: item.content,
      color: item.color,
      size: item.size,
      createdAt: item.created_at?.toISOString() || null,
      deletedAt: item.deleted_at?.toISOString() || null,
      startedAt: item.started_at?.toISOString() || null
    };
    res.json(response);
  } catch (e) {
    const error = e as Error;
    res.status(500).json({ error: error.message });
  }
});

export default router;
