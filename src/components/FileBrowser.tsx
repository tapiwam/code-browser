import RenderTree from "../models/RenderTree";

import React, { useState } from "react";
import { IoMdArrowDropright } from "react-icons/io";
import TreeView, { flattenTree } from "react-accessible-treeview";
import { Box, HStack, Icon, Link } from "@chakra-ui/react";
import {
  FaFile,
  FaHtml5,
  FaList,
  FaRegFolder,
  FaRegFolderOpen,
} from "react-icons/fa";
import { DiCss3, DiJavascript, DiNpm } from "react-icons/di";

interface Props {
  folder: any;
}

const FileBrowser = ({ folder }: Props) => {
  const data = flattenTree(folder);

  return (
    <Box paddingY="5px" className="directory">
      <TreeView
        data={data}
        aria-label="directory tree"
        nodeRenderer={({
          element,
          isBranch,
          isExpanded,
          isDisabled,
          getNodeProps,
          level,
          handleExpand,
        }) => (
          <HStack>
            <Box {...getNodeProps()} style={{ paddingLeft: 10 * (level - 1) }}>
              {isBranch ? (
                <FolderIcon isOpen={isExpanded} />
              ) : (
                <FileIcon filename={element.name} />
              )}

              <Link>{element.name}</Link>
            </Box>
          </HStack>
        )}
      />
    </Box>
  );
};

const FolderIcon = ({ isOpen }) =>
  isOpen ? (
    <Icon as={FaRegFolderOpen} color={"gray.500"} />
  ) : (
    <Icon as={FaRegFolder} color={"gray.500"} />
  );

const FileIcon = ({ filename }) => {
  const extension = filename.slice(filename.lastIndexOf(".") + 1);
  switch (extension) {
    case "js":
      return <Icon as={DiJavascript} color={"yellow"} />;
    case "css":
      return <Icon as={DiCss3} color={"turquoise"} />;
    case "json":
      return <Icon as={FaList} color={"yellow"} />;
    case "html":
      return <Icon as={FaHtml5} color={"yellow"} />;
    case "npmignore":
      return <Icon as={DiNpm} color={"red"} />;
    default:
      return <Icon as={FaFile} color={"grey.400"} />;
  }
};

export default FileBrowser;
