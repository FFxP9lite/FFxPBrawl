// Parts of this code was taken from NBS v44 and were AI generated

import { getPackageName } from "src/util";
import { config } from "../definitions";
import { fs } from '../utility/fs';

function getTimestamp(): string {
  const d = new Date();
  const dd = String(d.getDate()).padStart(2, "0");
  const mm = String(d.getMonth() + 1).padStart(2, "0");
  const yy = String(d.getFullYear()).slice(2);
  const hh = String(d.getHours()).padStart(2, "0");
  const mi = String(d.getMinutes()).padStart(2, "0");
  const ss = String(d.getSeconds()).padStart(2, "0");
  return `[${dd}/${mm}/${yy} ${hh}:${mi}:${ss}]`;
}

function format(args: any[]): string {
  return args
    .map((a) => {
      if (typeof a === "string") return a;

      if (isArrayBuffer(a)) {
        return Array.from(new Uint8Array(a))
          .map((b) => b.toString(16).padStart(2, "0"))
          .join(" ");
      }

      if (isUint8Array(a)) {
        return Array.from(a)
          .map((b) => b.toString(16).padStart(2, "0"))
          .join(" ");
      }

      try {
        return String(a);
      } catch {
        return "[object]";
      }
    })
    .join(" ");
}

// TODO: logging to logcat
/*
Log levels:
0 - Error, warn, info, debug, verbose
1 - Error, warn, info, debug
2 - Error, warn, info
3 - Error, warn
4 - Error
5 - None
*/
export class Logger {
  static error(...args: any[]): void {
    if (config.logLevel >= 5) return;
    const msg = format(args);
    const line = `${getTimestamp()} [ERROR] ${msg}`;
    console.log(line);
    writeLog(line);
  }

  static warn(...args: any[]): void {
    if (config.logLevel >= 4) return;
    const msg = format(args);
    const line = `${getTimestamp()} [WARN] ${msg}`;
    console.log(line);
    writeLog(line);
  }

  static info(...args: any[]): void {
    if (config.logLevel >= 3) return;
    const msg = format(args);
    const line = `${getTimestamp()} [INFO] ${msg}`;
    console.log(line);
    writeLog(line);
  }

  static debug(...args: any[]): void {
    if (config.logLevel >= 2) return;
    const msg = format(args);
    const line = `${getTimestamp()} [DEBUG] ${msg}`;
    console.log(line);
    writeLog(line);
  }

  static verbose(...args: any[]): void {
    if (config.logLevel != 0) return;
    const msg = format(args);
    const line = `${getTimestamp()} [VERBOSE] ${msg}`;
    console.log(line);
    writeLog(line);
  }
}

function isUint8Array(v: any): v is Uint8Array {
  return (
    v &&
    typeof v === "object" &&
    v.constructor &&
    v.constructor.name === "Uint8Array" &&
    typeof v.byteLength === "number"
  );
}

function isArrayBuffer(v: any): v is ArrayBuffer {
  return (
    v &&
    typeof v === "object" &&
    v.constructor &&
    v.constructor.name === "ArrayBuffer" &&
    typeof v.byteLength === "number"
  );
}

export function setupLogFile() {
  const logDir = `/storage/emulated/0/Android/media/${getPackageName()}`;
  const latestLogPath = `${logDir}/latest.log`;

  const latestPtr = Memory.allocUtf8String(latestLogPath);

  // See if latest.log exists
  // Yes - Rename to oldN.log
  // No - Create latest.log

  const fd = fs.open(latestPtr, 0, 0); // O_RDONLY 
  if (fd >= 0) {
    fs.close(fd);

    let n = 1;
    while (true) {
      const oldPath = `${logDir}/old${n}.log`;
      const oldPtr = Memory.allocUtf8String(oldPath);

      const testFd = fs.open(oldPtr, 0, 0);
      if (testFd < 0) {
        fs.rename(latestPtr, oldPtr);
        break;
      }
      fs.close(testFd);
      n++;
    }
  }

  const newFd = fs.open(
    latestPtr,
    1 | 64 | 512, // O_WRONLY | O_CREAT | O_TRUNC
    0o644
  );

  if (newFd >= 0) {
    fs.close(newFd);
  }
}

function writeLog(str: string) {
  if (!config.writeLogsToFile) {
    return;
  }

  const fd = fs.open(
    Memory.allocUtf8String(`/storage/emulated/0/Android/media/${getPackageName()}/latest.log`),
    1 | 1024, // O_WRONLY | O_APPEND
    0o644
  );

  if (fd < 0) {
    return;
  }

  const line = str + "\n";
  const buf = Memory.allocUtf8String(line);

  fs.write(fd, buf, line.length);
  fs.close(fd);
}
