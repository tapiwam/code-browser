import _ from "lodash";
import { CSVData, CSVHeader, CSVRecord } from "./csv-types";

function getCleanLines(csvStr: string, newLine: string = "\n"): string[] {
  return csvStr
    .split(newLine)
    .map((line) => line.trim())
    .filter((line) => line.length > 0);
}

// Read csv file
function readHeaders(
  numberOfHeaderLines: number,
  csvStr: string,
  newLine = "\n",
  delimeter = ","
): CSVHeader {
  let hasErrors = false;
  const errors: string[] = [];
  let numberOfColumns: number = 0;
  let headerKeys: string[] = [];
  const headerArray: string[][] = [];
  let headerRecords: CSVRecord[][] = [];

  // Split csvStr into lines and get first lines upto numberOfHeaderLines
  const lines = getCleanLines(csvStr, newLine);

  // Validate number of header lines
  if (lines.length < numberOfHeaderLines) {
    hasErrors = true;
    errors.push(
      `Expected at least ${numberOfHeaderLines} header lines. Received ${lines.length}`
    );
    return {
      numberOfColumns,
      numberOfHeaderLines,
      headerKeys,
      headerLines: [],
      hasErrors,
      errors,
      headerArray,
      headerRecords,
      delimeter,
      newLine,
    };
  }

  // Get header lines
  const headerLines = lines.slice(0, numberOfHeaderLines);

  // Iterate through each header line and split into string arrays
  headerLines.forEach((header) => {
    const splitLine = header.split(delimeter);
    headerArray.push(splitLine);
  });

  // Get number of columns from first header
  numberOfColumns = headerArray[0].length;

  // Validate all otehr header rows have same number of columns
  for (let i = 1; i < numberOfHeaderLines; i++) {
    if (headerArray[i].length !== numberOfColumns) {
      hasErrors = true;
      errors.push(
        `Header line ${i + 1} has ${
          headerArray[i].length
        } columns but header line 1 has ${numberOfColumns} columns`
      );
    }
  }
  if (hasErrors) {
    return {
      delimeter,
      newLine,
      numberOfColumns,
      numberOfHeaderLines,
      headerKeys,
      headerLines,
      hasErrors,
      errors,
      headerArray,
      headerRecords,
    };
  }

  // Get header keys
  headerKeys = computeHeaderKeys(headerArray);

  // Build header records
  headerRecords = computeHeaderRecords(
    numberOfHeaderLines,
    numberOfColumns,
    headerArray,
    headerKeys
  );

  return {
    delimeter,
    newLine,
    numberOfColumns,
    numberOfHeaderLines,
    headerKeys,
    headerLines,
    hasErrors,
    errors,
    headerArray,
    headerRecords,
  };
}

function computeHeaderKeys(headerArray: string[][]): string[] {
  console.log("Header lines: ", headerArray);

  // Get number of columns from first header
  const numberOfHeaderLines = headerArray.length;
  const numberOfColumns = headerArray[0].length;
  const headerKeys: string[] = [];

  // Get header keys
  for (let col = 0; col < numberOfColumns; col++) {
    const headerKeyParts: string[] = [];

    let key = "H";
    for (let row = 0; row < numberOfHeaderLines; row++) {
      // console.log(
      //   "Processing - row=" +
      //     row +
      //     " col=" +
      //     col +
      //     " val=" +
      //     headerArray[row][col]
      // );

      key = key + "-" + row + "-" + col;
    }

    // console.log("Adding key=" + key);

    headerKeyParts.push(key);

    const headerKey = headerKeyParts.join("-");
    headerKeys[col] = headerKey;
  }

  return headerKeys;
}

function computeHeaderRecordsFromObj(header: CSVHeader): CSVRecord[][] {
  return computeHeaderRecords(
    header.numberOfHeaderLines,
    header.numberOfColumns,
    header.headerArray,
    header.headerKeys
  );
}

function computeHeaderRecords(
  numberOfHeaderLines: number,
  numberOfColumns: number,
  headerArray: string[][],
  headerKeys: string[]
): CSVRecord[][] {
  const headerRecords: CSVRecord[][] = [];

  for (let i = 0; i < numberOfHeaderLines; i++) {
    const headerRecordRow: CSVRecord[] = [];

    for (let j = 0; j < numberOfColumns; j++) {
      const headerRecord: CSVRecord = {
        key: "H-" + i + "-" + j,
        columnKey: headerKeys[j],
        row: i,
        column: j,
        value: headerArray[i][j],
        formattedValue: headerArray[i][j],
        error: "",
      };
      headerRecordRow.push(headerRecord);
    }

    headerRecords.push(headerRecordRow);
  }
  return headerRecords;
}

function readCsvFile(
  numberOfHeaderLines: number,
  csvStr: string,
  newLine = "\n",
  delimeter = ","
): CSVData {
  let rows = 0;
  let columns = 0;
  let dataLines: string[] = [];
  const fileErrors: string[] = [];
  const records: CSVRecord[][] = [];

  // Split csvStr into lines
  const lines = getCleanLines(csvStr, newLine);

  // Get header
  const header: CSVHeader = readHeaders(numberOfHeaderLines, csvStr);
  fileErrors.push(...header.errors);

  if (!header.hasErrors) {
    // Get number of rows
    rows = lines.length - header.numberOfHeaderLines;
    columns = header.numberOfColumns;
    dataLines = lines.slice(header.numberOfHeaderLines);

    // Iterate over each line and get records
    for (let i = 0; i < dataLines.length; i++) {
      const line = dataLines[i];
      const rowRecords: CSVRecord[] = [];

      //  Each col in the line
      for (let j = 0; j < columns; j++) {
        let rowHasError = false;
        const errors: string[] = [];

        // Get each token of the line
        const tokens = line.split(delimeter);

        if (tokens.length !== columns) {
          rowHasError = true;

          const errorMessage = `Row ${
            i + numberOfHeaderLines
          } has expected ${columns} tokens but received ${tokens.length}`;
          errors.push(errorMessage);
          fileErrors.push(errorMessage);
        }

        const record: CSVRecord = {
          key: i + numberOfHeaderLines + "_" + header.headerKeys[j],
          columnKey: header.headerKeys[j],
          row: i + numberOfHeaderLines,
          column: j,
          value: tokens[j],
          formattedValue: tokens[j],
          error: rowHasError ? errors.join(", ") : "",
        };

        rowRecords.push(record);
      }

      // Add parsed row records to records
      records.push(rowRecords);
    }
  }

  const resp: CSVData = {
    rows,
    columns,
    headers: header,
    rawData: csvStr,
    lines,
    records,
    dataLines,
    hasErrors: fileErrors.length > 0,
    errors: fileErrors,
  };

  // console.log(JSON.stringify(resp, null, 2));
  return resp;
}

function modelToCsv(model: CSVData): string {
  const lines: string[] = [];

  if (model.hasErrors) {
    console.error("Model has errors", model.errors);
    return "";
  }

  // Iterate through headers and get lines
  model.headers.headerLines.forEach((headerLine) => {
    lines.push(headerLine);
  });

  // Iterate through records and get lines
  model.records.forEach((record) => {
    lines.push(record.map((record) => record.formattedValue).join(","));
  });

  return lines.join("\n");
}

function addColumn(data: CSVData, columnKeys: string[]): CSVData {
  const clone: CSVData = _.cloneDeep(data);

  const header = clone.headers;

  if (columnKeys.length !== header.numberOfHeaderLines) {
    console.error(
      "Column keys length does not match number of columns: " +
        header.numberOfHeaderLines,
      columnKeys
    );
    return data;
  }

  // Add new column to headerLines
  for (let i = 0; i < columnKeys.length; i++) {
    header.headerLines[i] += "," + columnKeys[i];
  }

  // Add new column to headerArray
  for (let i = 0; i < columnKeys.length; i++) {
    header.headerArray[i].push(columnKeys[i]);
  }

  // Compute new header keys
  header.headerKeys = computeHeaderKeys(header.headerArray);
  // Add to column count
  header.numberOfColumns++;

  // Header records compute
  header.headerRecords = computeHeaderRecordsFromObj(header);

  clone.headers = header;

  console.log("Adding column", clone);
  return clone;
}

// readHeaders(2, sample2);

// const a = readCsvFile(1, sample1);
// console.log(modelToCsv(a));

// const b = readCsvFile(2, sample2);
// console.log(modelToCsv(b));

export { getCleanLines, modelToCsv, readCsvFile, readHeaders, addColumn };
