import { useState } from "react";

import cloneDeep from "lodash/cloneDeep";

import {
  readHeaders,
  getCleanLines,
  readCsvFile,
  modelToCsv,
  CSVData,
  CSVRecord,
} from "../models/csvUtils";

import {
  Table,
  Thead,
  Tbody,
  Tfoot,
  Tr,
  Th,
  Td,
  TableCaption,
  TableContainer,
  Editable,
  EditablePreview,
  EditableInput,
} from "@chakra-ui/react";

interface Props {
  csvStr: string;
}
const CSVGrid = ({ csvStr }: Props) => {
  const parsed: CSVData = readCsvFile(2, csvStr);
  const [data, setData] = useState(parsed);
  console.log(data);

  const onCellChange = (cell: CSVRecord, newValue: string) => {
    const clone: CSVData = cloneDeep(data);

    const rowInData = cell.row - clone.headers.numberOfHeaderLines;
    const colInData = cell.column;

    console.log("onCellChange", cell, newValue, rowInData, colInData);
    clone.records[rowInData][colInData].value = newValue;
    clone.records[rowInData][colInData].formattedValue = newValue;
    setData(clone);
  };

  return (
    <>
      <div>CSVGrid</div>
      {/* {JSON.stringify(data)} */}

      <TableContainer>
        <Table variant="simple">
          <Thead bg={"gray.200"}>
            {data.headers.headerRecords.map((line, index) => (
              <Tr key={index}>
                {line.map((col) => (
                  <Th key={col.key}>{col.value}</Th>
                ))}
              </Tr>
            ))}
          </Thead>

          <Tbody>
            {data.records.map((line, index) => (
              <Tr key={index}>
                {line.map((col) => (
                  <Td key={col.key}>
                    <Editable defaultValue={col.value}>
                      <EditablePreview />
                      <EditableInput
                        onChange={(e) => onCellChange(col, e.target.value)}
                      />
                    </Editable>
                  </Td>
                ))}
              </Tr>
            ))}
          </Tbody>
        </Table>
      </TableContainer>
    </>
  );
};

export default CSVGrid;
