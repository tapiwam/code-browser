import "./App.css";
import { Grid, GridItem, Show } from "@chakra-ui/react";
import NavBar from "./components/NavBar";

function App() {
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
            File List
          </GridItem>
        </Show>

        <GridItem area="main" bgColor={"green"}>
          {/* Show editor */} Editor
        </GridItem>
      </Grid>
    </>
  );
}

export default App;
