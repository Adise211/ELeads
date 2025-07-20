import "@mantine/core/styles.css";
import "./App.css";
import { MantineProvider } from "@mantine/core";
import DefaultLayout from "./layouts/DefaultLayout";

function App() {
  return (
    <MantineProvider>
      <DefaultLayout />
    </MantineProvider>
  );
}

export default App;
