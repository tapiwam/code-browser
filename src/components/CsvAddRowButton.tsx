import { Button } from "@chakra-ui/react";

interface CsvAddRowProps {
  onAddRow: () => void;
}

const CsvAddRowButton = ({ onAddRow }: CsvAddRowProps) => {
  return <Button onClick={onAddRow}>Add Row</Button>;
};

export default CsvAddRowButton;
