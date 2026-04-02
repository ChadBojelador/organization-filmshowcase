import { useEffect, useState } from "react";
import { Navigate, Outlet, useLocation } from "react-router-dom";
import { clearStoredAuth, fetchCurrentUser, getStoredAuth } from "../utils/auth";

function RequireAuth() {
  const location = useLocation();
  const [authState, setAuthState] = useState({ status: "loading", isAuthenticated: false });

  useEffect(() => {
    let isMounted = true;

    const validate = async () => {
      const { token } = getStoredAuth();

      if (!token) {
        if (isMounted) {
          setAuthState({ status: "ready", isAuthenticated: false });
        }
        return;
      }

      const user = await fetchCurrentUser();

      if (!isMounted) {
        return;
      }

      if (user) {
        setAuthState({ status: "ready", isAuthenticated: true });
        return;
      }

      clearStoredAuth();
      setAuthState({ status: "ready", isAuthenticated: false });
    };

    validate();

    return () => {
      isMounted = false;
    };
  }, [location.pathname]);

  if (authState.status === "loading") {
    return <main className="page-main"><div className="container">Verifying session...</div></main>;
  }

  if (!authState.isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  return <Outlet />;
}

export default RequireAuth;
