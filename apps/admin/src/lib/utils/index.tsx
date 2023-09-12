import { CommonConstant } from "@configs/constants/common";
import { getDate, getHours, getMinutes, getSeconds, isWithinInterval, parse, set } from "date-fns";

export type ClassValue = string | number | ClassDictionary | ClassArray | undefined | null | false;

export interface ClassDictionary {
  [id: string]: boolean | undefined | null;
}

export type ClassArray = ClassValue[];

export function classNames(...args: ClassValue[]): string {
  const classes = [];

  for (const arg of args) {
    if (!arg) continue;

    const argType = typeof arg;

    if (argType === 'string' || argType === 'number') {
      classes.push(arg);
    } else if (Array.isArray(arg)) {
      if (arg.length) {
        const inner = classNames(...arg);
        if (inner) {
          classes.push(inner);
        }
      }
    } else if (argType === 'object' && arg !== null) { // Add a check for not null
      for (const key in arg as ClassDictionary) { // Type assertion
        if ((arg as ClassDictionary)[key]) {
          classes.push(key);
        }
      }
    }
  }

  return classes.join(' ');
}

export const delay = (ms: number) => new Promise(res => setTimeout(res, ms));


export const safeStringify = (obj: any) => {
  const seen = new Set();
  return JSON.stringify(obj, function (key, val) {
    if (typeof val === "object" && val !== null) {
      if (seen.has(val)) return;
      seen.add(val);
    }
    return val;
  });
}


export const showZodErrors = (errors: any) => {
  return Object.keys(errors).map(key => ({
    key: key,
    message: errors[key].message,
    type: errors[key].type,
  }));
}

export const timeToDate = (timeString: string, referenceDate: Date) => {
  const [time, period] = timeString.split(' ');
  const [hours, minutes, seconds] = time.split(':').map(Number);

  let hour24 = hours;

  if (period === "PM" && hours < 12) {
    hour24 = hours + 12;
  }
  if (period === "AM" && hours === 12) {
    hour24 = 0;
  }

  return set(referenceDate, { hours: hour24, minutes, seconds });
}

export const getCurrentWorkingShift = () => {
  const dateTime = new Date();

  for (const shift of CommonConstant.WORK_SHIFTS) {
    const shiftStartDate = timeToDate(shift.start, dateTime);
    let shiftEndDate = timeToDate(shift.end, dateTime);

    // If the end time is earlier than the start time, assume the shift goes into the next day
    if (getHours(shiftEndDate) < getHours(shiftStartDate) ||
      (getHours(shiftEndDate) === getHours(shiftStartDate) && getMinutes(shiftEndDate) <= getMinutes(shiftStartDate))) {
      shiftEndDate = set(shiftEndDate, { date: getDate(shiftEndDate) + 1 });
    }

    if (isWithinInterval(dateTime, { start: shiftStartDate, end: shiftEndDate })) {
      return shift.number;
    }
  }
  return 0;
}