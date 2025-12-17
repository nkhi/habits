/**
 * Database Types - Matching CockroachDB schema
 * These types represent the raw database rows
 */

// ============================================
// Database Row Types (snake_case from DB)
// ============================================

export interface DbVlog {
  week_start_date: Date;
  video_url: string;
  embed_html: string;
}

export interface DbHabit {
  id: string;
  name: string;
  order: number | null;
  default_time: string | null;
  active: boolean | null;
  created_date: Date | null;
  comment: string | null;
}

export interface DbEntry {
  entry_id: string;
  date: Date;
  habit_id: string;
  state: number | null;
  timestamp: Date | null;
}

export interface DbQuestion {
  id: string;
  text: string;
  order: number | null;
  active: boolean | null;
  date: string | null;
}

export interface DbTask {
  id: string;
  text: string;
  completed: boolean | null;
  date: Date | null;
  created_at: Date | null;
  category: string | null;
  state: string | null;
  order: string | null;  // VARCHAR(255) for fractional indexing
}

export interface DbNextItem {
  id: string;
  title: string;
  content: string | null;
  color: string | null;
  size: string | null;
  created_at: Date | null;
  deleted_at: Date | null;
  started_at: Date | null;
}

export interface DbList {
  id: string;
  title: string;
  color: string | null;
  created_at: Date | null;
  order: string | null;  // VARCHAR(255) for fractional indexing
}

export interface DbListItem {
  id: string;
  list_id: string;
  text: string;
  completed: boolean | null;
  created_at: Date | null;
  position: number | null;
}

export interface DbDiaryEntry {
  id: string;
  date: Date;
  question_id: string;
  answer: string | null;
  created_at: Date | null;
}

// ============================================
// API Response Types (camelCase for frontend)
// ============================================

export interface Vlog {
  weekStartDate: Date | string;
  videoUrl: string;
  embedHtml: string;
}

export interface Habit {
  id: string;
  name: string;
  order: number | null;
  defaultTime: string | null;
  active: boolean | null;
  createdDate: Date | string | null;
  comment: string | null;
}

export interface Entry {
  entryId: string;
  date: Date | string;
  habitId: string;
  state: number | null;
  timestamp: Date | string | null;
}

export interface Question {
  id: string;
  text: string;
  order: number | null;
  active: boolean | null;
  date: string | null;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  date: string;
  createdAt: string;
  category: string;
  state: string;
  order: string | null;
}

export interface NextItem {
  id: string;
  title: string;
  content: string | null;
  color: string | null;
  size: string | null;
  createdAt: string | null;
  deletedAt: string | null;
  startedAt: string | null;
}

export interface List {
  id: string;
  title: string;
  color: string | null;
  createdAt: string | null;
  order: string | null;
  items: ListItem[];
}

export interface ListItem {
  id: string;
  listId: string;
  text: string;
  completed: boolean;
  createdAt: string | null;
  position?: number;
}

export interface DiaryEntry {
  id: string;
  date: string;
  questionId: string;
  answer: string | null;
  createdAt: string | null;
}

// ============================================
// Request Body Types
// ============================================

export interface CreateTaskRequest {
  id: string;
  text?: string;
  completed?: boolean;
  date: string;
  createdAt?: string;
  category?: string;
  state?: string;
  order?: string;
}

export interface UpdateTaskRequest {
  text?: string;
  completed?: boolean;
  date?: string;
  category?: string;
  state?: string;
  order?: string;
}

export interface ReorderRequest {
  order: string;
  date?: string;
  category?: string;
  state?: string;
}

export interface BatchPuntRequest {
  taskIds: string[];
  sourceDate: string;
  targetDate: string;
}

export interface BatchFailRequest {
  taskIds: string[];
}

export interface BatchReorderRequest {
  moves: Array<{
    id: string;
    order: string;
    date?: string;
    category?: string;
    state?: string;
  }>;
}

export interface CreateHabitEntryRequest {
  entryId: string;
  date: string;
  habitId: string;
  state?: number;
  timestamp?: string;
}

export interface CreateVlogRequest {
  weekStartDate: string;
  videoUrl: string;
  embedHtml: string;
}

export interface CreateQuestionRequest {
  id: string;
  text: string;
  order?: number;
  active?: boolean;
  date?: string;
}

export interface CreateDiaryEntryRequest {
  id: string;
  date: string;
  questionId: string;
  answer?: string;
  createdAt?: string;
}

export interface UpdateDiaryEntryRequest {
  answer?: string;
  date?: string;
  questionId?: string;
}

export interface CreateNextItemRequest {
  id: string;
  title: string;
  content?: string;
  color?: string;
  size?: string;
}

export interface UpdateNextItemRequest {
  title?: string;
  content?: string;
  color?: string;
  size?: string;
  deletedAt?: string;
  startedAt?: string;
}

export interface CreateListRequest {
  id: string;
  title: string;
  color?: string;
  order?: string;
}

export interface UpdateListRequest {
  title?: string;
  color?: string;
  order?: string;
  items?: ListItem[];
}

// ============================================
// Utility Types
// ============================================

export interface TasksByDate {
  [date: string]: Task[];
}

export interface GroupedTasks {
  [date: string]: {
    active: Task[];
    completed: Task[];
    failed: Task[];
  };
}

export interface TaskCounts {
  [date: string]: {
    active: number;
    completed: number;
    failed: number;
  };
}

export interface DiaryByDate {
  [date: string]: DiaryEntry[];
}

// Helper to format date to YYYY-MM-DD string
export function formatDate(date: Date | string): string {
  if (typeof date === 'string') return date;
  return date.toISOString().split('T')[0];
}
