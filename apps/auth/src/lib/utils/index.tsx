type ClassValue = string | number | ClassDictionary | ClassArray | undefined | null | false;

interface ClassDictionary {
  [id: string]: boolean | undefined | null;
}

type ClassArray = ClassValue[];

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
