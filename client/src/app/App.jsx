import { Analytics } from '@vercel/analytics/react';
import { SpeedInsights } from '@vercel/speed-insights/react';
import AppRoutes from "../routes";

function App() {
  return (
    <>
      <AppRoutes />
      <Analytics />
      <SpeedInsights />
    </>
  );
}

export default App;
