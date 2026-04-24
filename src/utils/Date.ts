// pages/DateHelper.ts
import dayjs, { type Dayjs } from 'dayjs';
import customParseFormat from 'dayjs/plugin/customParseFormat';
import relativeTime from 'dayjs/plugin/relativeTime';
import isBetween from 'dayjs/plugin/isBetween';
import isSameOrBefore from 'dayjs/plugin/isSameOrBefore';
import isSameOrAfter from 'dayjs/plugin/isSameOrAfter';
import utc from 'dayjs/plugin/utc';
import timezone from 'dayjs/plugin/timezone';
import duration from 'dayjs/plugin/duration';

dayjs.extend(customParseFormat);
dayjs.extend(relativeTime);
dayjs.extend(isBetween);
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);
dayjs.extend(utc);
dayjs.extend(timezone);
dayjs.extend(duration);

export class DateHelper {
  // ─── FORMATS ────────────────────────────────────────────────────────
  static readonly FORMAT = {
    DATE: 'DD/MM/YYYY',
    DATE_US: 'MM/DD/YYYY',
    DATE_ISO: 'YYYY-MM-DD',
    DATETIME: 'DD/MM/YYYY HH:mm',
    DATETIME_FULL: 'DD/MM/YYYY HH:mm:ss',
    TIME: 'HH:mm',
    TIME_FULL: 'HH:mm:ss',
    MONTH_YEAR: 'MM/YYYY',
    DISPLAY: 'D MMMM YYYY',
  };

  // ─── NOW / TODAY ─────────────────────────────────────────────────────

  /** Returns the current dayjs instance */
  static now(): Dayjs {
    return dayjs();
  }

  /** Returns today's date as a formatted string (default: DD/MM/YYYY) */
  static today(format = this.FORMAT.DATE): string {
    return dayjs().format(format);
  }

  /** Returns today's date in ISO format: YYYY-MM-DD */
  static todayISO(): string {
    return dayjs().format(this.FORMAT.DATE_ISO);
  }

  /** Returns the current time as a formatted string (default: HH:mm) */
  static currentTime(format = this.FORMAT.TIME): string {
    return dayjs().format(format);
  }

  /** Returns the current full year as a number */
  static currentYear(): number {
    return dayjs().year();
  }

  /** Returns the current month as a 1-based number (1 = January) */
  static currentMonth(): number {
    return dayjs().month() + 1;
  }

  // ─── FORMAT ──────────────────────────────────────────────────────────

  /** Formats a date value using the given format string */
  static format(date: string | Date | Dayjs, format = this.FORMAT.DATE): string {
    return dayjs(date).format(format);
  }

  /** Parses an ISO date string and returns it in the given format */
  static formatFromISO(isoDate: string, format = this.FORMAT.DATE): string {
    return dayjs(isoDate).format(format);
  }

  /** Parses a date string using a specific input format and returns a dayjs instance */
  static parse(dateStr: string, inputFormat: string): Dayjs {
    return dayjs(dateStr, inputFormat);
  }

  /** Converts a date string from a given format to ISO format (YYYY-MM-DD) */
  static toISO(dateStr: string, inputFormat: string): string {
    return dayjs(dateStr, inputFormat).format(this.FORMAT.DATE_ISO);
  }

  // ─── ADD / SUBTRACT ──────────────────────────────────────────────────

  /** Adds the specified number of days to a date (defaults to today) */
  static addDays(days: number, from?: string | Dayjs, format = this.FORMAT.DATE): string {
    return dayjs(from).add(days, 'day').format(format);
  }

  /** Subtracts the specified number of days from a date (defaults to today) */
  static subtractDays(days: number, from?: string | Dayjs, format = this.FORMAT.DATE): string {
    return dayjs(from).subtract(days, 'day').format(format);
  }

  /** Adds the specified number of months to a date (defaults to today) */
  static addMonths(months: number, from?: string | Dayjs, format = this.FORMAT.DATE): string {
    return dayjs(from).add(months, 'month').format(format);
  }

  /** Subtracts the specified number of months from a date (defaults to today) */
  static subtractMonths(months: number, from?: string | Dayjs, format = this.FORMAT.DATE): string {
    return dayjs(from).subtract(months, 'month').format(format);
  }

  /** Adds the specified number of years to a date (defaults to today) */
  static addYears(years: number, from?: string | Dayjs, format = this.FORMAT.DATE): string {
    return dayjs(from).add(years, 'year').format(format);
  }

  /** Adds the specified number of hours to a date (defaults to now) */
  static addHours(hours: number, from?: string | Dayjs, format = this.FORMAT.DATETIME): string {
    return dayjs(from).add(hours, 'hour').format(format);
  }

  /** Adds the specified number of minutes to a date (defaults to now) */
  static addMinutes(minutes: number, from?: string | Dayjs, format = this.FORMAT.DATETIME): string {
    return dayjs(from).add(minutes, 'minute').format(format);
  }

  // ─── RELATIVE / USEFUL DATES ─────────────────────────────────────────

  /** Returns yesterday's date as a formatted string */
  static yesterday(format = this.FORMAT.DATE): string {
    return dayjs().subtract(1, 'day').format(format);
  }

  /** Returns tomorrow's date as a formatted string */
  static tomorrow(format = this.FORMAT.DATE): string {
    return dayjs().add(1, 'day').format(format);
  }

  /** Returns the first day of the current month */
  static startOfMonth(format = this.FORMAT.DATE): string {
    return dayjs().startOf('month').format(format);
  }

  /** Returns the last day of the current month */
  static endOfMonth(format = this.FORMAT.DATE): string {
    return dayjs().endOf('month').format(format);
  }

  /** Returns the first day of the current week */
  static startOfWeek(format = this.FORMAT.DATE): string {
    return dayjs().startOf('week').format(format);
  }

  /** Returns the last day of the current week */
  static endOfWeek(format = this.FORMAT.DATE): string {
    return dayjs().endOf('week').format(format);
  }

  /** Returns the date N days ago from today */
  static nDaysAgo(n: number, format = this.FORMAT.DATE): string {
    return dayjs().subtract(n, 'day').format(format);
  }

  /** Returns the date N days from today */
  static nDaysFromNow(n: number, format = this.FORMAT.DATE): string {
    return dayjs().add(n, 'day').format(format);
  }

  // ─── COMPARE ─────────────────────────────────────────────────────────

  /** Returns true if `date` is strictly before `compareDate` */
  static isBefore(date: string | Dayjs, compareDate: string | Dayjs): boolean {
    return dayjs(date).isBefore(dayjs(compareDate));
  }

  /** Returns true if `date` is strictly after `compareDate` */
  static isAfter(date: string | Dayjs, compareDate: string | Dayjs): boolean {
    return dayjs(date).isAfter(dayjs(compareDate));
  }

  /** Returns true if `date` is the same as or before `compareDate` */
  static isSameOrBefore(date: string | Dayjs, compareDate: string | Dayjs): boolean {
    return dayjs(date).isSameOrBefore(dayjs(compareDate));
  }

  /** Returns true if `date` is the same as or after `compareDate` */
  static isSameOrAfter(date: string | Dayjs, compareDate: string | Dayjs): boolean {
    return dayjs(date).isSameOrAfter(dayjs(compareDate));
  }

  /**
   * Returns true if `date` falls within the range [start, end] (inclusive).
   * @example DateHelper.isBetween('2026-04-15', '2026-04-01', '2026-04-30') // true
   */
  static isBetween(date: string | Dayjs, start: string | Dayjs, end: string | Dayjs): boolean {
    return dayjs(date).isBetween(dayjs(start), dayjs(end), null, '[]');
  }

  /** Returns true if the given date is today */
  static isToday(date: string | Dayjs): boolean {
    return dayjs(date).isSame(dayjs(), 'day');
  }

  /** Returns true if the date string is a valid date (optionally with a format hint) */
  static isValid(date: string, format?: string): boolean {
    return format ? dayjs(date, format).isValid() : dayjs(date).isValid();
  }

  // ─── DIFF ────────────────────────────────────────────────────────────

  /** Returns the difference in whole days between two dates (dateA - dateB) */
  static diffInDays(dateA: string | Dayjs, dateB: string | Dayjs): number {
    return dayjs(dateA).diff(dayjs(dateB), 'day');
  }

  /** Returns the difference in whole hours between two dates (dateA - dateB) */
  static diffInHours(dateA: string | Dayjs, dateB: string | Dayjs): number {
    return dayjs(dateA).diff(dayjs(dateB), 'hour');
  }

  /** Returns the difference in whole minutes between two dates (dateA - dateB) */
  static diffInMinutes(dateA: string | Dayjs, dateB: string | Dayjs): number {
    return dayjs(dateA).diff(dayjs(dateB), 'minute');
  }

  /** Returns a human-readable relative string, e.g. "3 days ago" or "in 2 hours" */
  static fromNow(date: string | Dayjs): string {
    return dayjs(date).fromNow();
  }

  // ─── TIMEZONE ────────────────────────────────────────────────────────

  /** Converts a date to the specified timezone and returns it as a formatted string */
  static toTimezone(date: string | Dayjs, tz: string, format = this.FORMAT.DATETIME): string {
    return dayjs(date).tz(tz).format(format);
  }

  /** Returns the current time in the specified timezone as a formatted string */
  static nowInTimezone(tz: string, format = this.FORMAT.DATETIME): string {
    return dayjs().tz(tz).format(format);
  }

  // ─── RANGE GENERATOR ─────────────────────────────────────────────────

  /**
   * Generates an array of dates from `start` to `end` (inclusive).
   * @example DateHelper.dateRange('2026-04-01', '2026-04-05')
   * // ['01/04/2026', '02/04/2026', '03/04/2026', '04/04/2026', '05/04/2026']
   */
  static dateRange(start: string, end: string, format = this.FORMAT.DATE): string[] {
    const dates: string[] = [];
    let current = dayjs(start);
    const last = dayjs(end);
    while (current.isSameOrBefore(last, 'day')) {
      dates.push(current.format(format));
      current = current.add(1, 'day');
    }
    return dates;
  }

  // ─── TIMESTAMP ───────────────────────────────────────────────────────

  /** Returns the current Unix timestamp in milliseconds */
  static timestamp(): number {
    return dayjs().valueOf();
  }

  /** Converts a Unix timestamp (ms) to a formatted date string */
  static fromTimestamp(ts: number, format = this.FORMAT.DATETIME): string {
    return dayjs(ts).format(format);
  }

  // ─── CONVERT BETWEEN FORMATS ─────────────────────────────────────────

  /**
   * Converts a date string from one format to another.
   * @example DateHelper.convertFormat('25/12/2026', 'DD/MM/YYYY', 'YYYY-MM-DD') // '2026-12-25'
   */
  static convertFormat(dateStr: string, fromFormat: string, toFormat: string): string {
    return dayjs(dateStr, fromFormat).format(toFormat);
  }
}
