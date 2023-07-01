// @ts-ignore
import AsciiTable from "ascii-table";
import { ITableHeader, SolfegeMelody, TSyllable } from "../solfege";
import { TNoteAllAccidentalOctave } from "../utils";
import { Log } from "./logSync";

const MAXDURATION = 28; // max duration for a melody fragment. Fragment length should be less than the avarage screen width.

interface ITableObject {
  [key: string]: TSyllable[];
}

function create_table_object(solfege: SolfegeMelody, ambitus: number) {
  const obj: ITableObject = {};
  for (let i = 0; i < ambitus + 1; i++) {
    obj[i] = [...Array(solfege.duration())]
  }
  return obj;
}

function fill_rows(solfege: SolfegeMelody, tableObject: ITableObject, lowestNote: TNoteAllAccidentalOctave) {
  let totalDuration: number = 0;

  solfege.getMelody.forEach((melodyNote) => {
    melodyNote.noteNames.forEach((n) => {
      const pitchRow: number = solfege.distance_from_lowest(n, lowestNote);
      const pitchSyllable = solfege.syllable(n);
      tableObject[pitchRow][totalDuration] = pitchSyllable;
    });

    totalDuration = totalDuration + melodyNote.duration;
  });

  return Object.values(tableObject).reverse();
}

function heading_markers(tableHeader: ITableHeader[]) {
  const tempArr: string[] = []
  tableHeader.forEach(h => {
    tempArr.push("*");
    for (let i = 0; i < h.duration - 1; i++) {
      tempArr.push("")
    }
  });
  return tempArr;
}

function replaceHeaders(table : string, tableHeaders: ITableHeader[]
  ) {
    let tableCopy = table;
  for (const headíng of tableHeaders) {
    tableCopy = replaceAt(tableCopy, tableCopy.indexOf("*"), headíng.name)
  }
  function replaceAt(str: string, index: number, replacement: string) {
    return str.substring(0, index) + replacement + str.substring(index + replacement.length);
  }
  return tableCopy;
}

export class LogTable {
  static write(solfege: SolfegeMelody, tableHeader: ITableHeader[], timeSignatue: 1 | 2 | 3 | 4) {
    const solfegePagination = solfege.pagination(MAXDURATION, timeSignatue);
    let tableHeadersSecond = tableHeader.splice(solfegePagination.first().duration() / timeSignatue);
    const tableHeaders = [tableHeader, tableHeadersSecond]

    for (const [index, fragment] of solfegePagination.entries()) {

      const tableObject = create_table_object(fragment, solfege.ambitus(solfege.lowest));
      const rows = fill_rows(fragment, tableObject, solfege.lowest);

      var table = AsciiTable.factory({
        heading: heading_markers(tableHeaders[index]),
        rows: rows,
      });

      for (let i = 0; i < fragment.duration(); i++) { // forgot what this does.
        table.setAlign(i, AsciiTable.CENTER)
      }

      table = table.setJustify()

      const tableStr = table.toString();
      const tableWithHeaders = replaceHeaders(tableStr, tableHeaders[index]);

      Log.write(tableWithHeaders);
    }

  }
}
