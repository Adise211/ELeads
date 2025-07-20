import "@mantine/core/styles.css";
import "./App.css";
import { MantineProvider } from "@mantine/core";
import { Button } from "@mantine/core";

function App() {
  return (
    <MantineProvider>
      <div>Hello World</div>
      <Button>Click me</Button>
    </MantineProvider>
  );
}

export default App;
