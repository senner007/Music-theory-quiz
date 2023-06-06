// @ts-ignore
import AsciiTable from "ascii-table";
import { ITableHeader, SolfegeMelody, Syllable } from "../solfege";

interface ITableObject {
  [key: string]: Syllable[];
}

function createTableObject(solfege: SolfegeMelody) {
  const ambitus = solfege.ambitus();

  const obj: ITableObject = {};
  for (let i = 0; i < ambitus + 1; i++) {
    obj[i] = [...Array(solfege.duration)]
  }
  return obj;
}

function fillRows(solfege: SolfegeMelody, tableObject: ITableObject) {
  let totalDuration: number = 0;

  solfege.getMelody.forEach((melodyNote) => {
    melodyNote.noteNames.forEach((n) => {
      const pitchRow: number = solfege.distance_from_lowest(n);
      const pitchSyllable = solfege.syllable(n);
      tableObject[pitchRow][totalDuration] = pitchSyllable;
    });

    totalDuration = totalDuration + melodyNote.duration;
  });

  return Object.values(tableObject).reverse();
}

function headingInMeasures(tableHeader: ITableHeader[]) {
  const tempArr: string[] = []
  tableHeader.forEach(h => {
    tempArr.push(h.name);
    for (let i = 0; i < h.duration - 1; i++ ) {
      tempArr.push("")
    }
  });
  return tempArr;
}

export class LogTable {
  static write(solfege: SolfegeMelody, tableHeader: ITableHeader[]) {
    const tableObject = createTableObject(solfege);
    const rows = fillRows(solfege, tableObject);

    var table = AsciiTable.factory({
      heading: headingInMeasures(tableHeader),
      rows: rows,
    });

    for (let i = 0; i < solfege.duration; i++) {
      table.setAlign(i, AsciiTable.CENTER)
    }

    table = table.setJustify()

    console.log(table.toString());
  }
}
