import express, { Request, Response } from 'express';
import * as db from '../db.ts';
import type { DbVlog, Vlog, CreateVlogRequest } from '../types.ts';

const router = express.Router();

// Get vlog for a specific week
router.get('/vlogs/:weekStartDate', async (req: Request<{ weekStartDate: string }>, res: Response) => {
  const { weekStartDate } = req.params;
  try {
    const result = await db.query<DbVlog>(`
      SELECT * FROM vlogs WHERE week_start_date = $1
    `, [weekStartDate]);
    
    if (result.rows.length === 0) return res.json(null);
    
    const v = result.rows[0];
    const vlog: Vlog = {
      weekStartDate: v.week_start_date,
      videoUrl: v.video_url,
      embedHtml: v.embed_html
    };
    res.json(vlog);
  } catch (e) {
    const error = e as Error;
    res.status(500).json({ error: error.message });
  }
});

// Save a vlog for a specific week
router.post('/vlogs', async (req: Request<object, object, CreateVlogRequest>, res: Response) => {
  const { weekStartDate, videoUrl, embedHtml } = req.body;
  if (!weekStartDate || !videoUrl || !embedHtml) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  
  try {
    await db.query(`
      INSERT INTO vlogs (week_start_date, video_url, embed_html)
      VALUES ($1, $2, $3)
      ON CONFLICT (week_start_date)
      DO UPDATE SET video_url = EXCLUDED.video_url, embed_html = EXCLUDED.embed_html
    `, [weekStartDate, videoUrl, embedHtml]);
    
    res.json({ ok: true });
  } catch (e) {
    const error = e as Error;
    res.status(500).json({ error: error.message });
  }
});

export default router;
