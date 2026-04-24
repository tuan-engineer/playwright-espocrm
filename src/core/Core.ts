import winston from 'winston';
import path from 'path';
import { randomUUID } from 'crypto';

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.printf((info) => {
    return `[${info['timestamp']}][${info['id']}][${info['level']}]: ${info['message']}`;
  }),
);

export function generateId(): string {
  return randomUUID();
}

const logger = winston.createLogger({
  format: logFormat,
  transports: [
    new winston.transports.File({
      filename: path.join(process.cwd(), 'logs/playwright.log'),
      maxsize: 5242880,
      maxFiles: 5,
    }),
    new winston.transports.Console({
      format: winston.format.combine(winston.format.colorize({ all: true }), logFormat),
    }),
  ],
});

export const log = (msg: unknown, id: string, type: 'info' | 'warn' | 'error' = 'info') => {
  let stringMsg: string;
  if (msg instanceof Error) {
    stringMsg = msg.stack || msg.message;
  } else if (typeof msg === 'object' && msg !== null) {
    stringMsg = JSON.stringify(msg, null, 2);
  } else {
    stringMsg = String(msg);
  }
  logger.log(type, stringMsg, { id });
};

export const sleep = (ms: number) => new Promise((res) => setTimeout(res, ms));
