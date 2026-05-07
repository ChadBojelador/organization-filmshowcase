import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import Login from "../components/Login";
import Register from "../components/Register";
import Dashboard from "../pages/Dashboard";
import AdminDashboard from "../pages/AdminDashboard";
import ErrorPage from "../pages/ErrorPage";

const TOKEN_KEY = "token";

function hasToken() {
  if (typeof window === "undefined") {
    return false;
  }

  return Boolean(window.localStorage.getItem(TOKEN_KEY));
}

function GuestOnlyRoute({ children }) {
  if (hasToken()) {
    return <Navigate to="/" replace />;
  }

  return children;
}

function ProtectedRoute({ children }) {
  if (!hasToken()) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Default URL — renders Dashboard at "/" so the URL stays clean */}
        <Route path="/" element={<Dashboard />} />
        {/* Keep /dashboard as an alias so existing bookmarks still work */}
        <Route path="/dashboard" element={<Navigate to="/" replace />} />
        <Route
          path="/login"
          element={
            <GuestOnlyRoute>
              <Login />
            </GuestOnlyRoute>
          }
        />
        <Route
          path="/register"
          element={
            <GuestOnlyRoute>
              <Register />
            </GuestOnlyRoute>
          }
        />
        {/* Admin is now protected — unauthenticated users are redirected to /login */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <AdminDashboard />
            </ProtectedRoute>
          }
        />
        <Route path="*" element={<ErrorPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoutes;
