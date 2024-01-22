import { useState } from "react";

import _ from "lodash";

import { CSVData, CSVRecord } from "./csv-types";
import { addColumn, addRow, modelToCsv, readCsvFile } from "./csvUtils";

import {
  ButtonGroup,
  Editable,
  EditableInput,
  EditablePreview,
  HStack,
  Input,
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
import CsvAddRowButton from "../CsvAddRowButton";

interface Props {
  csvStr: string;
  onCsvChange: (csvStr: string) => void;
}
const CSVGrid = ({ csvStr, onCsvChange }: Props) => {
  const parsed: CSVData = readCsvFile(2, csvStr);
  const [data, setData] = useState<CSVData>(parsed);
  console.log(data);

  const onCellChange = (cell: CSVRecord, newValue: string) => {
    const clone: CSVData = _.cloneDeep(data);

    const rowInData = cell.row - clone.headers.numberOfHeaderLines;
    const colInData = cell.column;

    // console.log("onCellChange", cell, newValue, rowInData, colInData);
    clone.records[rowInData][colInData].value = newValue;
    clone.records[rowInData][colInData].formattedValue = newValue;
    setData(clone);
    onCsvChange(modelToCsv(clone));
  };

  const onAddColumn = (columnKeys: string[]) => {
    const newdata = addColumn(data, columnKeys);
    setData(newdata);
    onCsvChange(modelToCsv(newdata));
    console.log("addedColumn", columnKeys, newdata);
  };

  const onAddRow = () => {
    const newdata = addRow(data);
    setData(newdata);
    onCsvChange(modelToCsv(newdata));
    console.log("addedRow", newdata);
  };

  return (
    <>
      <div>CSVGrid</div>
      {/* {JSON.stringify(data)} */}

      <HStack mb={2}>
        <Text flex={1}>Name</Text>
        <ButtonGroup size={"xs"}>
          <CsvAddRowButton onAddRow={onAddRow} />
          <CsvAddColumnButton
            numberOfColumnRows={data.headers.numberOfHeaderLines}
            onAddColumn={onAddColumn}
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
                    {col.value.length > 0 && (
                      <Editable defaultValue={col.value}>
                        <EditablePreview />
                        <EditableInput
                          placeholder="Enter value"
                          onBlur={(e) => onCellChange(col, e.target.value)}
                        />
                      </Editable>
                    )}

                    {col.value.length === 0 && (
                      <Input
                        isInvalid
                        variant={"outline"}
                        onBlur={(e) => onCellChange(col, e.target.value)}
                        placeholder="Enter value"
                      />
                    )}
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
