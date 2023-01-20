import fs from "fs";
import { Log } from "./logger/logSync";

export function LogError(error: string): never {
  Log.error("#########################################");
  Log.error(error);
  Log.error("#########################################");
  Log.write("Stack Trace : ");
  throw new Error(error);
}

export function writeToFile(fileName: string, content: string) {
  fs.writeFileSync(fileName, content);
  Log.write("wrote to file: " + fileName);
}
export const isDev = () => process.env.NODE_ENV === "dev";
