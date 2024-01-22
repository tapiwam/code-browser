export interface CSVHeader {
  delimeter: string;
  newLine: string;
  numberOfColumns: number;
  // In standard CSV files this will be 1. For files liek rule files there can be more
  numberOfHeaderLines: number;
  // If file has more than one header line then the unique headerKey will be the combined key of the headers
  headerKeys: string[];

  headerLines: string[];
  headerRecords: CSVRecord[][];
  headerArray: string[][];
  hasErrors: boolean;
  errors: string[];
}

export interface CSVData {
  rows: number;
  columns: number;
  headers: CSVHeader;
  rawData: string;
  lines: string[];
  dataLines: string[];
  records: CSVRecord[][];
  hasErrors: boolean;
  errors: string[];
}

export interface CSVRecord {
  key: string;
  columnKey: string;
  row: number;
  column: number;
  value: string;
  formattedValue: string;
  error: string;
}
