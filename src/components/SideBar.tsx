import RenderTree from "../models/RenderTree";
import FileBrowser from "./FileBrowser";
import { Heading } from "@chakra-ui/react";

interface Props {
  data: RenderTree;
}

const SideBar = ({ data }: Props) => {
  return (
    <>
      <Heading as={"h3"}>Files</Heading>

      <FileBrowser folder={data} />
    </>
  );
};

export default SideBar;
