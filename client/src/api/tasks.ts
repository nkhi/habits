import type { Task } from '../types';

export type GroupedTasks = Record<string, {
  active: Task[];
  completed: Task[];
  failed: Task[];
}>;

export async function getTasks(baseUrl: string): Promise<Record<string, Task[]>> {
  const response = await fetch(`${baseUrl}/tasks`);
  if (!response.ok) throw new Error('Failed to fetch tasks');
  return response.json();
}

export async function getWorkTasks(baseUrl: string): Promise<Record<string, Task[]>> {
  const response = await fetch(`${baseUrl}/tasks/work`);
  if (!response.ok) throw new Error('Failed to fetch work tasks');
  return response.json();
}

export async function getTasksForWeek(baseUrl: string, start: string, end: string): Promise<Record<string, Task[]>> {
  const response = await fetch(`${baseUrl}/tasks/week?start=${start}&end=${end}`);
  if (!response.ok) throw new Error('Failed to fetch tasks for week');
  return response.json();
}

export async function getGroupedTasks(baseUrl: string, category?: 'life' | 'work'): Promise<GroupedTasks> {
  const url = category 
    ? `${baseUrl}/tasks/grouped?category=${category}`
    : `${baseUrl}/tasks/grouped`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch grouped tasks');
  return response.json();
}

export type TaskCounts = Record<string, {
  active: number;
  completed: number;
  failed: number;
}>;

export async function getTaskCounts(baseUrl: string, category?: 'life' | 'work'): Promise<TaskCounts> {
  const url = category 
    ? `${baseUrl}/tasks/counts?category=${category}`
    : `${baseUrl}/tasks/counts`;
  const response = await fetch(url);
  if (!response.ok) throw new Error('Failed to fetch task counts');
  return response.json();
}

export async function createTask(baseUrl: string, task: Task): Promise<void> {
  const response = await fetch(`${baseUrl}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task)
  });
  if (!response.ok) throw new Error('Failed to create task');
}

export async function updateTask(baseUrl: string, id: string, updates: Partial<Task>): Promise<Task> {
  const response = await fetch(`${baseUrl}/tasks/${id}`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(updates)
  });
  if (!response.ok) throw new Error('Failed to update task');
  return response.json();
}

export async function deleteTask(baseUrl: string, id: string): Promise<void> {
  const response = await fetch(`${baseUrl}/tasks/${id}`, {
    method: 'DELETE'
  });
  if (!response.ok) throw new Error('Failed to delete task');
}

export async function batchPuntTasks(
  baseUrl: string, 
  taskIds: string[], 
  sourceDate: string, 
  targetDate: string
): Promise<{ ok: boolean; newTasks: Task[] }> {
  const response = await fetch(`${baseUrl}/tasks/batch/punt`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ taskIds, sourceDate, targetDate })
  });
  if (!response.ok) throw new Error('Failed to batch punt tasks');
  return response.json();
}

export async function batchFailTasks(baseUrl: string, taskIds: string[]): Promise<void> {
  const response = await fetch(`${baseUrl}/tasks/batch/fail`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ taskIds })
  });
  if (!response.ok) throw new Error('Failed to batch fail tasks');
}
