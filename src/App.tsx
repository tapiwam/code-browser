import "./App.css";
import { Grid, GridItem, Heading, Show } from "@chakra-ui/react";
import NavBar from "./components/NavBar";
import SideBar from "./components/SideBar";
import treeData from "./data/sampleFiles";
import CSVGrid from "./components/csv-grid/CSVGrid";
// import * as csvStr from "./data/sampleCsv.csv";

function App() {
  const data = treeData;
  // const csvStr = readFileSync("./data/sampleCsv.csv", "utf-8");

  const csvStr = `
  A,B,C,C,D,D
  A1,B1,C1,D1,E1,F1
  1,2,3,4,5,6
  7,8,9,10,11,12
  `;

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
          <GridItem area="aside" paddingX={5}>
            {/* Show file list */}
            <SideBar data={data} />
          </GridItem>
        </Show>

        <GridItem area="main">
          {/* Show editor */}

          {/* <MonacoEditorView /> */}

          <CSVGrid csvStr={csvStr} oneCsvChange={(str) => console.log(str)} />
        </GridItem>
      </Grid>
    </>
  );
}

export default App;
