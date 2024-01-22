import {
  readHeaders,
  getCleanLines,
  readCsvFile,
  modelToCsv,
  CSVData,
} from "../models/csvUtils";

interface Props {
  csvStr: string;
}
const CSVGrid = ({ csvStr }: Props) => {
  const data: CSVData = readCsvFile(2, csvStr);
  console.log(data);

  return (
    <>
      <div>CSVGrid</div>
      {JSON.stringify(data)}
    </>
  );
};

export default CSVGrid;
