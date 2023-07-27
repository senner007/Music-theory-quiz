// @ts-ignore
import AsciiTable from "ascii-table";
import { ITableHeader, SolfegeMelody, TSyllable } from "../solfege";
import { TNoteAllAccidentalOctave, splitArrayInChunks } from "../utils";
import { Log } from "./logSync";
import { ObjectEntries } from "../objectUtils";

const MAXDURATION = 35; // max duration for a melody fragment. Fragment length should be less than the avarage screen width.

interface ITableObject {
  [key: string]: TSyllable[];
}

function create_table_object(solfege: SolfegeMelody, ambitus: number) {
  const obj: ITableObject = {};
  const emptyDurationArray = [...Array(solfege.duration())];
  for (let i = 0; i < ambitus + 1; i++) {
    obj[i] = emptyDurationArray;
  }

  return obj;
}

function fill_rows(solfege: SolfegeMelody, tableObject: ITableObject, lowestNote: TNoteAllAccidentalOctave) {
  const tableObjectCopy: ITableObject = JSON.parse(JSON.stringify(tableObject));
  let totalDuration: number = 0;

  solfege.getMelody.forEach((melodyNote) => {
    melodyNote.noteNames.forEach((n) => {
      const pitchRow = solfege.distance_from_lowest(n, lowestNote);
      const pitchSyllable = solfege.syllable(n);
      tableObjectCopy[pitchRow][totalDuration] = pitchSyllable;
    });

    totalDuration = totalDuration + melodyNote.duration;
  });
  return tableObjectCopy;
}

function heading_markers(tableHeader: ITableHeader[]) {
  return tableHeader.map((h) => ["*", ...Array.from({length:  h.duration -1}, () => "")]).flat()

}

function replaceHeaders(table: string, tableHeaders: ITableHeader[]) {
  let tableCopy = table;
  for (const headíng of tableHeaders) {
    tableCopy = replaceAt(tableCopy, tableCopy.indexOf("*"), headíng.name);
  }
  function replaceAt(str: string, index: number, replacement: string) {
    return `${str.substring(0, index)}${replacement}${str.substring(index + replacement.length)}`;
  }
  return tableCopy;
}

export class LogTable {
  static write(solfege: SolfegeMelody, tableHeader: ITableHeader[]) {
    const solfegePagination = solfege.pagination(MAXDURATION);
    const tableHeaders = splitArrayInChunks(tableHeader, solfegePagination.first_or_throw().duration() / solfege.timeSignature);
    
    for (const [index, fragment] of solfegePagination.entries()) {
      const tableObject = create_table_object(fragment, solfege.ambitus());
      const tableObjectFilled = fill_rows(fragment, tableObject, solfege.lowest);
      const rows = ObjectEntries(tableObjectFilled).values.to_reverse();

      var table = AsciiTable.factory({
        heading: heading_markers(tableHeaders[index]),
        rows: rows,
      });

      for (let i = 0; i < fragment.duration(); i++) {
        // forgot what this does.
        table.setAlign(i, AsciiTable.CENTER);
      }

      table = table.setJustify();

      const tableStr = table.toString();
      const tableWithHeaders = replaceHeaders(tableStr, tableHeaders[index]);

      Log.write(tableWithHeaders);
    }
  }
}
