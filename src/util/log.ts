// deno-lint-ignore-file no-explicit-any

import { setup, getLogger, LogConfig } from 'std/log/mod.ts';
import { ConsoleHandler } from 'std/log/handlers.ts';
import { GenericFunction } from 'std/log/logger.ts';
import { green, underline, reset } from 'std/fmt/colors.ts';

const inspect = (obj: any) => Deno.inspect(obj, { colors: true });

const DEFAULT_LEVEL = 'DEBUG';

const logConfig: LogConfig = {
  handlers: {
    'default': new ConsoleHandler(DEFAULT_LEVEL, {
      formatter: (logRecord) => {
        const { levelName, loggerName, msg, args } = logRecord;
        // const lArgs = args.length ? args.map(arg => `${arg}`).join(':') : null;
        // return `[${levelName}] (logName:${loggerName}): ${msg}${lArgs?' - ARGS: ':''}${lArgs}`;
        return `[${levelName}] (logName:${loggerName}): ${msg} ${args}`;
      }
    }),
  },
  loggers: {
    default: {
      level: DEFAULT_LEVEL,
      handlers: ["default"],
    },
  },
};

setup(logConfig);

type DenoLogFns = 'debug' | 'info' | 'warning' | 'error' | 'critical';

const logger = (moduleName: string) => {
  const denoLog = getLogger(moduleName);

  // Why? I want to disallow calling the logger without some
  // string message for context (my own bad habit)
  const logProxy = (
    key: DenoLogFns, fmt?: (msg: string) => unknown) =>
      <T>(msg: T extends GenericFunction ? never : T, ...args: unknown[]): T | undefined => {
        if (typeof msg === "string" && fmt) {
          denoLog[key](fmt(msg), args);
        } else {
          denoLog[key](msg, args);
        }
        return;
      }

  return {
    debug: denoLog.info, //(msg: any, ...args: any[]) => denoLog.debug(msg, args),
    info: logProxy('info', msg => reset(msg)),
    ok: logProxy('info', msg => green(msg)),
    log: logProxy('info', msg => reset(msg)),
    inspect: (msg: any, ...args: any[]) => {
      denoLog.debug(msg, ...args.map(inspect));
      // denoLog.debug('inspect', msg.map(m =>
      //   Deno.inspect(m, { colors: true })
      // ));
    },
    warn: logProxy('warning', msg => reset(msg)),
    error: logProxy('error', msg => reset(msg)),
    fatal: logProxy('critical'),
    extra: logProxy('info', (msg) => underline(reset(msg))),
  }
}


// const _test = () => {
//   let debugRan = 'NO';
//   const mylog = logger('default');
//   mylog.extra('THIS IS SO EXTRA')
//   mylog.debug('DEBUG TEST');
//   mylog.debug(() => {
//     debugRan = 'YES';
//     return green('This runs in a function');
//   });
//   mylog.info('INFO TEST');
//   mylog.ok('IT WAS OK');
//   mylog.warn('WARN TEST');
//   mylog.log('LOG TEST');
//   mylog.error('ERROR TEST', new Error('TEST ERROR'));
//   mylog.fatal('FATAL TEST');
//   mylog.log('debugRan:', debugRan);
// }
//
// if (import.meta.main) {
//   _test();
// }


export default logger;
