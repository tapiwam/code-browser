import { useState } from "react";

import _ from "lodash";

import { modelToCsv, readCsvFile, addColumn } from "./csvUtils";
import { CSVData, CSVRecord } from "./csv-types";

import {
  Button,
  ButtonGroup,
  Editable,
  EditableInput,
  EditablePreview,
  HStack,
  Table,
  TableContainer,
  Tbody,
  Td,
  Text,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import CsvAddColumnButton from "./CsvAddColumnButton";

interface Props {
  csvStr: string;
  oneCsvChange: (csvStr: string) => void;
}
const CSVGrid = ({ csvStr, oneCsvChange }: Props) => {
  const parsed: CSVData = readCsvFile(2, csvStr);
  const [data, setData] = useState(parsed);
  console.log(data);

  const onCellChange = (cell: CSVRecord, newValue: string) => {
    const clone: CSVData = _.cloneDeep(data);

    const rowInData = cell.row - clone.headers.numberOfHeaderLines;
    const colInData = cell.column;

    // console.log("onCellChange", cell, newValue, rowInData, colInData);
    clone.records[rowInData][colInData].value = newValue;
    clone.records[rowInData][colInData].formattedValue = newValue;
    setData(clone);
    oneCsvChange(modelToCsv(clone));
  };

  const addColumn = (columnKeys: string[]) => {
    // const clone: CSVData = _.cloneDeep(data);
    // clone = addColumn(clone, columnKeys);
    // setData(clone);
    // oneCsvChange(modelToCsv(clone));
    console.log("addColumn", columnKeys);
  };

  return (
    <>
      <div>CSVGrid</div>
      {/* {JSON.stringify(data)} */}

      <HStack mb={2}>
        <Text flex={1}>Name</Text>
        <ButtonGroup size={"xs"}>
          <CsvAddColumnButton
            numberOfColumnRows={data.headers.numberOfHeaderLines}
            onAddColumn={addColumn}
          />
        </ButtonGroup>
      </HStack>

      <TableContainer>
        <Table variant="simple">
          <Thead bg={"gray.200"}>
            <Tr>
              <Th>-</Th>
              {data.headers.headerKeys.map((key, index) => (
                <Th key={index}>{key}</Th>
              ))}
            </Tr>

            {data.headers.headerRecords.map((line, index) => (
              <Tr key={index}>
                {/* First column is actions */}
                <Th>-</Th>

                {/* Header items from data */}
                {line.map((col) => (
                  <Th key={col.key}>{col.value}</Th>
                ))}
              </Tr>
            ))}
          </Thead>

          <Tbody>
            {data.records.map((line, index) => (
              <Tr key={index}>
                {/* First column is actions */}
                <Th>-</Th>

                {/* Data items from data */}
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
