import { IS_CLIENT, IS_DEV } from './platform';

type Key = string;
type TimedValue<T = unknown> = [Date, T];

const debug = new Map<Key, TimedValue[]>();

const relativeTimeFormat = new Intl.RelativeTimeFormat('en', {
  style: 'long',
  numeric: 'auto',
});

const timeFormat = new Intl.DateTimeFormat('de', {
  hour: '2-digit',
  minute: '2-digit',
  second: '2-digit',
});

const f = {
  debug: (key: string, value: unknown) => [
    `%cNEW DEBUG %c| %c${key} %c| %c${f.value(value)}`,
    'color: orange; font-weight: bold;',
    `color: white;`,
    'color: SpringGreen;',
    'color: white;',
    `color: Salmon;`,
  ],
  time: (date: Date) => timeFormat.format(date),
  timeAgo: (date: Date) => relativeTimeFormat.format((date.valueOf() - Date.now()) / 1000, 'seconds'),
  value: (value: unknown) => {
    if (value === undefined) return '';

    return typeof value === 'object' ? JSON.stringify(value) : String(value);
  },
  entry: (label: string, value?: unknown) => [`%c${label}`, `font-weight: bold`, ``, value],
};

const logPrevious = (key: Key, date: Date) => {
  const previous = debug.get(key)?.filter(([_date, _value]) => _date !== date);

  if (previous !== undefined && previous.length > 0) {
    console.groupCollapsed(...f.entry('Previous', previous.length));

    for (const [_date, _value] of previous) {
      console.log(...f.entry(f.time(_date), _value));
    }

    console.groupEnd();
  }
};

const log = <T>(key: Key, [date, value]: TimedValue<T>, format?: (v: T) => unknown) => {
  const instanceOrType = value instanceof Object ? value.constructor.name : typeof value;
  console.group(`%c${key} %c(${instanceOrType})`, 'color: orange; font-weight: bold;', `color: SpringGreen;`);
  console.log(...f.entry(`String`, f.value(value)));
  console.log(...f.entry(`Value`, value));
  if (format !== undefined) console.log(...f.entry(`Formatted`, format(value)));
  logPrevious(key, date);
  console.groupEnd();
};

export const d = <T>(v: Record<string, T>, format?: (v: T) => unknown) => {
  if (!IS_DEV) return;

  if (v === undefined || v === null) return;

  for (const key in v) {
    const value = v[key];

    const newValue: TimedValue<T> = [new Date(), value];
    const previousValues = debug.get(key);

    debug.set(key, [...(previousValues ?? []), newValue]);

    log(key, newValue, format);
  }
};

export const dd = () => {
  if (!IS_DEV) return;

  console.group(`%cALL DEBUGS`, 'color: orange; font-weight: bold;');

  for (const [key, values] of debug.entries()) {
    const [lastDate, lastValue] = values[values.length - 1];
    console.groupCollapsed(
      `%c${key} %c| %c${f.value(lastValue)}`,
      'color: SpringGreen;',
      `color: white;`,
      'color: Salmon;',
    );
    console.log(...f.entry(`Time`, f.time(lastDate)));

    logPrevious(key, lastDate);

    console.groupEnd();
  }

  console.groupEnd();
};

if (IS_DEV && IS_CLIENT) {
  (window as any).d = d;
  (window as any).dd = dd;
}
