import "./App.css";
import { Grid, GridItem, Heading, Show } from "@chakra-ui/react";
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import treeData from "./data/sampleFiles";

import Editor, { DiffEditor, useMonaco, loader } from "@monaco-editor/react";
import MonacoEditorView from "./components/MonacoEditorView";

function App() {
  const data = treeData;

  return (
    <>
      <Grid
        templateAreas={{
          base: `"nav" "main"`,
          lg: `"nav nav" "aside main"`,
        }}
        templateColumns={{
          base: "1fr",
          lg: "200px 1fr",
        }}
      >
        <GridItem area="nav">
          <NavBar />
        </GridItem>

        <Show above="lg">
          <GridItem area="aside" bgColor="blue" paddingX={5}>
            {/* Show file list */}
            <SideBar data={data} />
          </GridItem>
        </Show>

        <GridItem area="main" bgColor={"green"}>
          {/* Show editor */}

          <MonacoEditorView />
        </GridItem>
      </Grid>
    </>
  );
}

export default App;
