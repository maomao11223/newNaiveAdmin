import { format } from "date-fns";

const DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm";
const DATE_FORMAT = "YYYY-MM-DD ";

export function formatToDateTime(date: Date | number, formatStr = DATE_TIME_FORMAT): string {
  return format(date, formatStr);
}

export function formatToDate(date: Date | number, formatStr = DATE_FORMAT): string {
  return format(date, formatStr);
}

export function timestampToDate(timestamp: number, timeZoneHour = 8) {
  const Timestamp = new Date(timestamp);
  Timestamp.setUTCHours(Timestamp.getUTCHours() + timeZoneHour);

  const year = Timestamp.getUTCFullYear();
  const month = Timestamp.getMonth() + 1;
  let returnMonth = "";
  returnMonth = month > 10 ? `${month}` : `0${month}`;

  const date = Timestamp.getUTCDate();
  let returnDate = "";
  returnDate = date > 10 ? `${date}` : `0${date}`;

  return `${year}-${returnMonth}-${returnDate}`;
}
