// frontend/src/App.js
import { useEffect, useState } from "react";
import axios from "axios";
import {
  BrowserRouter,
  Navigate,
  Outlet,
  Route,
  Routes,
} from "react-router-dom";
import AppLayout from "./components/AppLayout";
import Dashboard from "./pages/Dashboard";

const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function AuthPage({ title }) {
  return (
    <main className="flex min-h-screen items-center justify-center bg-zinc-100 px-4">
      <section className="w-full max-w-md rounded-xl border border-zinc-200 bg-white p-6 shadow-sm">
        <h1 className="text-2xl font-semibold text-zinc-900">{title}</h1>
      </section>
    </main>
  );
}

function ProtectedDashboardLayout() {
  const [isChecking, setIsChecking] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    let isActive = true;

    const checkAuth = async () => {
      const token = localStorage.getItem("token");

      if (!token) {
        if (isActive) {
          setIsAuthenticated(false);
          setIsChecking(false);
        }
        return;
      }

      try {
        await axios.get(`${API_BASE_URL}/auth/verify`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!isActive) return;
        setIsAuthenticated(true);
      } catch (error) {
        localStorage.removeItem("token");
        if (!isActive) return;
        setIsAuthenticated(false);
      } finally {
        if (isActive) {
          setIsChecking(false);
        }
      }
    };

    checkAuth();

    return () => {
      isActive = false;
    };
  }, []);

  if (isChecking) {
    return (
      <div className="flex min-h-screen items-center justify-center text-sm text-zinc-500">
        Checking session...
      </div>
    );
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return (
    <AppLayout>
      <Outlet />
    </AppLayout>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<AuthPage title="Login" />} />
        <Route path="/register" element={<AuthPage title="Register" />} />

        <Route element={<ProtectedDashboardLayout />}>
          <Route path="/dashboard" element={<Dashboard />} />
        </Route>

        <Route path="*" element={<Navigate to="/dashboard" replace />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
