import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Dashboard from "../pages/Dashboard";
import AdminLoginGate from "../components/AdminLoginGate";
import ErrorPage from "../pages/ErrorPage";

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default URL — renders Dashboard at "/" so the URL stays clean */}
        <Route path="/" element={<Dashboard />} />
        {/* Keep /dashboard as an alias so existing bookmarks still work */}
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        
        {/* Hidden admin route with login gate */}
        <Route path="/admin/123" element={<AdminLoginGate />} />
        
        {/* Hide standard /admin route by redirecting to home */}
        <Route path="/admin" element={<Navigate to="/" replace />} />
        
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
