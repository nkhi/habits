import express, { Request, Response } from 'express';
import * as db from '../db.ts';
import type { DbVlog } from '../db-types.ts';
import type { Vlog, CreateVlogRequest, BatchVlogsRequest, VlogsByWeek } from '../../shared/types.ts';

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
    const weekStartStr = typeof v.week_start_date === 'string' 
      ? v.week_start_date 
      : v.week_start_date.toISOString().split('T')[0];
    const vlog: Vlog = {
      weekStartDate: weekStartStr,
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

// Batch get vlogs for multiple weeks (replaces N individual calls with 1)
router.post('/vlogs/batch', async (req: Request<object, object, BatchVlogsRequest>, res: Response) => {
  const { weekStartDates } = req.body;
  
  if (!weekStartDates || !Array.isArray(weekStartDates) || weekStartDates.length === 0) {
    return res.status(400).json({ error: 'weekStartDates must be a non-empty array' });
  }
  
  try {
    const result = await db.query<DbVlog>(`
      SELECT * FROM vlogs WHERE week_start_date = ANY($1)
    `, [weekStartDates]);
    
    const vlogsByWeek: VlogsByWeek = {};
    result.rows.forEach(v => {
      const weekStart = typeof v.week_start_date === 'string' 
        ? v.week_start_date 
        : v.week_start_date.toISOString().split('T')[0];
      vlogsByWeek[weekStart] = {
        weekStartDate: weekStart,
        videoUrl: v.video_url,
        embedHtml: v.embed_html
      };
    });
    
    res.json(vlogsByWeek);
  } catch (e) {
    const error = e as Error;
    res.status(500).json({ error: error.message });
  }
});

export default router;

