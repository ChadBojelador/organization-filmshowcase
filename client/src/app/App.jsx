import AppRoutes from "../routes";
import StartupLoaderGate from "../components/StartupLoaderGate";

function App() {
  return (
    <StartupLoaderGate>
      <AppRoutes />
    </StartupLoaderGate>
  );
}

export default App;
