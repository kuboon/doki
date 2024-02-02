const WeekChars = ['M', 'T', 'W', 'R', 'F', 'A', 'S']

export const DokiSymbol = "⥁"

/**
 * @param date {Date}
 */
export function dateToDokiJson(date) {
  const iso = getISOWeek(date)
  const weekChar = WeekChars[(date.getUTCDay() + 6) % 7];
  const doki = date.getUTCHours() * 10 + Math.floor(date.getUTCMinutes() / 6);
  const minutes = date.getUTCMinutes() % 6;
  return { iso, weekChar, doki, minutes };
}

export function dokiJsonFormat(dokiJson, style) {
  switch (style) {
    case 'short':
      return dokiJson.weekChar + zeroPad(dokiJson.doki, 3);
    case 'minutes':
      return dokiJsonFormat(dokiJson, 'short') + ':' + dokiJson.minutes;
    case 'full':
      return zeroPad(dokiJson.iso.year, 4) + 'W' + zeroPad(dokiJson.iso.week, 2) + dokiJsonFormat(dokiJson, 'minutes');
    // case 'full2':
    //   const date = dokiJsonToDate(dokiJson);
    //   const dateStr = date.toISOString().split('T')[0];
    //   return dateStr + dokiJsonFormat(dokiJson, 'minutes');
  }
  throw new Error('unknown style: ' + style);
}

export function dokiFormat(date, style = 'short') {
  return dokiJsonFormat(dateToDokiJson(date), style);
}

/**
 *
 * @param {String} str
 * @returns
 */
export function parseToDokiJson(str) {
  const match = str.match(/^(\d{4})W(\d{2})([UMTWHFS])(\d{3})(?::(\d))?$/);
  if (!match) throw new Error('invalid doki format');
  const iso = { year: parseInt(match[1]), week: parseInt(match[2]) };
  const weekChar = match[3];
  const doki = parseInt(match[4]);
  const minutes = parseInt(match[5] || 0);
  return { iso, weekChar, doki, minutes };
}

export function dokiJsonToDate(dokiJson) {
  const { iso, weekChar, doki, minutes } = dokiJson;
  const date = getDateFromISOWeek(iso.year, iso.week);
  date.setUTCDate(date.getUTCDate() + WeekChars.indexOf(weekChar));
  date.setUTCHours(Math.floor(doki / 10), (doki % 10) * 6 + minutes, 0, 0);
  return date;
}

export class Doki {
  static Symbol = DokiSymbol;
  static parse(str) {
    return new Doki(parseToDokiJson(str));
  }
  constructor(date_or_json) {
    if (date_or_json instanceof Date) {
      this.date = date_or_json;
      this.json = dateToDokiJson(date_or_json);
    } else {
      this.date = dokiJsonToDate(date_or_json);
      this.json = date_or_json;
    }
  }
  get year() { return this.json.year }
  get weekNum() { return this.json.weekNum }
  get weekChar() { return this.json.weekChar }
  get doki() { return this.json.doki }
  get minutes() { return this.json.minutes }

  fmt(style) {
    return dokiJsonFormat(this.json, style);
  }
}

function zeroPad(num, places) {
  return String(num).padStart(places, '0');
}

// original source: https://weeknumber.net/how-to/javascript
function getISOWeek(date_) {
  const date = new Date(date_.getTime());
  date.setUTCHours(0, 0, 0, 0);
  // Thursday in current week decides the year.
  date.setUTCDate(date.getUTCDate() + 3 - (date.getUTCDay() + 6) % 7);
  // January 4 is always in week 1.
  if (date_.getFullYear() !== date.getUTCFullYear()) {
    return { year: date_.getUTCFullYear(), week: 0 };
  }
  const week1 = new Date(Date.UTC(date.getFullYear(), 0, 4));
  // Adjust to Thursday in week 1 and count number of weeks from date to week1.
  const week = 1 + Math.round(((date.getTime() - week1.getTime()) / 86400000
    - 3 + (week1.getUTCDay() + 6) % 7) / 7);
  const year = date.getUTCFullYear();
  return { year, week };
}
function getDateFromISOWeek(year, week) {
  const date = new Date(Date.UTC(year, 0, 4));
  date.setUTCDate((12 - date.getUTCDay()) % 7 + (week - 1) * 7);
  return date;
}

export const test = { getISOWeek, getDateFromISOWeek }
