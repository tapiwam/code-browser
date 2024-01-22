import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  useDisclosure,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
} from "@chakra-ui/react";

import {
  Control,
  FieldValues,
  useFieldArray,
  useForm,
  useWatch,
} from "react-hook-form";

type FormValues = {
  columns: string[];
};

interface CsvAddColumnProps {
  numberOfColumnRows: number;
  onAddColumn: (columnKeys: string[]) => void;
}

const FinalColumns = ({ control }: { control: Control<FormValues> }) => {
  const formValues = useWatch({
    name: "columns",
    control,
  });
  return <p>Items: {formValues}</p>;
};

const CsvAddColumnButton = ({
  numberOfColumnRows,
  onAddColumn,
}: CsvAddColumnProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const itemKeys: string[] = [];
  for (let i = 0; i < numberOfColumnRows; i++) {
    itemKeys.push(" ");
  }

  const {
    control,
    register,
    reset,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    defaultValues: {
      columns: itemKeys,
    },
  });

  const { fields, append, remove } = useFieldArray({
    name: "columns",
    control,
  });

  const onSubmit = (data: FormValues) => {
    console.log(data);
    onAddColumn(data.columns);
    // Reset form
    reset();

    // Close modal
    onClose();
  };

  return (
    <>
      <Button onClick={onOpen}>Add Column</Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <form onSubmit={handleSubmit(onSubmit)}>
            <ModalHeader>Add Column</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
              <Text mb={8} size={"sm"}>
                The file has {fields.length} header rows. Please define the
                column names below.
              </Text>

              {fields.map((field, index) => (
                <FormControl
                  variant="floating"
                  key={field.id}
                  mb={5}
                  isInvalid={!!errors?.columns?.[index]}
                >
                  <Input
                    as="input"
                    variant="outline"
                    {...register(`columns.${index}` as const, {
                      required: true,
                      validate: {
                        notEmpty: (value) => value.trim() !== "",
                        minLength: (v) => v.trim().length >= 2,
                        alphaNumeric: (v) => /^[a-zA-Z0-9]+$/.test(v),
                      },
                    })}
                    id={field.id}
                    key={field.id}
                    isInvalid={!!errors?.columns?.[index]}
                  />
                  <FormLabel>Column {index + 1}</FormLabel>
                  <FormErrorMessage>
                    {errors?.columns?.[index]?.type === "notEmpty" && (
                      <Text size={"sm"} color="red.500">
                        Column name cannot be empty
                      </Text>
                    )}
                    {errors?.columns?.[index]?.type === "minLength" && (
                      <Text size={"sm"} color="red.500">
                        Column name must be at least 2 characters
                      </Text>
                    )}
                    {errors?.columns?.[index]?.type === "alphaNumeric" && (
                      <Text size={"sm"} color="red.500">
                        Column name must be alphanumeric only
                      </Text>
                    )}
                  </FormErrorMessage>
                </FormControl>
              ))}
            </ModalBody>

            <ModalFooter>
              <Button variant="ghost" mr={3} onClick={() => reset()}>
                Reset
              </Button>
              <Button colorScheme="blue" mr={3} type="submit">
                Add Columns
              </Button>
            </ModalFooter>
          </form>
        </ModalContent>
      </Modal>
    </>
  );
};

export default CsvAddColumnButton;
