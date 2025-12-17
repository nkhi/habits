import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const logFile = path.join(__dirname, 'server.log');

export function logToFile(msg: string): void {
  try {
    fs.appendFileSync(logFile, msg + '\n');
  } catch {
    // ignore logging errors
  }
}
