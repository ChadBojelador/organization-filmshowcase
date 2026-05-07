import { Analytics } from '@vercel/analytics/react';
import AppRoutes from "../routes";

function App() {
  return (
    <>
      <AppRoutes />
      <Analytics />
    </>
  );
}

export default App;
