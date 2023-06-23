// @ts-ignore
import AsciiTable from "ascii-table";
import { ITableHeader, SolfegeMelody, TSyllable } from "../solfege";
import { TNoteAllAccidentalOctave } from "../utils";

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

function heading_in_measures(tableHeader: ITableHeader[]) {
  const tempArr: string[] = []
  tableHeader.forEach(h => {
    tempArr.push("*");
    for (let i = 0; i < h.duration - 1; i++) {
      tempArr.push("")
    }
  });
  return tempArr;
}

export class LogTable {
  static write(solfege: SolfegeMelody, tableHeader: ITableHeader[], timeSignatue: 1 | 2 | 3 | 4) {
    const solfegePagination = solfege.pagination(MAXDURATION, timeSignatue);
    let tableHeadersSecond = tableHeader.splice(solfegePagination[0].duration() / timeSignatue);
    const tableHeaders = [tableHeader, tableHeadersSecond]

    for (const [index, fragment] of solfegePagination.entries()) {

      const tableObject = create_table_object(fragment, solfege.ambitus(solfege.lowest));
      const rows = fill_rows(fragment, tableObject, solfege.lowest);

      var table = AsciiTable.factory({
        heading: heading_in_measures(tableHeaders[index]),
        rows: rows,
      });

      for (let i = 0; i < fragment.duration(); i++) {
        table.setAlign(i, AsciiTable.CENTER)
      }

      table = table.setJustify()

      let tableStr = table.toString();

      for (const headíng of tableHeaders[index]) {
        tableStr = replaceAt(tableStr, tableStr.indexOf("*"), headíng.name)
      }
      function replaceAt(str: string, index: number, replacement: string) {
        return str.substring(0, index) + replacement + str.substring(index + replacement.length);
      }

      console.log(tableStr);
    }

  }
}
