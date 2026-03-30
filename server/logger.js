import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const LOG_DIR  = path.join(__dirname, 'logs');
const LOG_FILE = path.join(LOG_DIR, 'app.log');

// create the logs/ directory if it doesn't exist
if (!fs.existsSync(LOG_DIR)) {
    fs.mkdirSync(LOG_DIR, { recursive: true });
}

export function log(level, event, detail = '') {
    const line = `[${new Date().toISOString()}] [${level}] ${event} - ${detail}\n`;

    // mirror to console so nodemon shows it in the terminal
    console.log(line.trimEnd());

    fs.appendFile(LOG_FILE, line, (err) => {
        if (err) console.error('Logger write error:', err.message);
    });
}

// helpers
export const logInfo  = (event, detail) => log('INFO',  event, detail);
export const logWarn  = (event, detail) => log('WARN',  event, detail);
export const logError = (event, detail) => log('ERROR', event, detail);