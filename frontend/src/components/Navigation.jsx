import { Link, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import "./Navigation.css";

function Navigation() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [director, setDirector] = useState(null);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    const directorData = localStorage.getItem("director");
    if (token && directorData) {
      setIsAuthenticated(true);
      setDirector(JSON.parse(directorData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("director");
    setIsAuthenticated(false);
    setDirector(null);
    setMobileMenuOpen(false);
    navigate("/", { replace: true });
  };

  return (
    <nav className="nav">
      <div className="container">
        <div className="nav-content">
          <Link to="/" className="nav-brand">
            🎬 FESTORAMA
          </Link>

          <button 
            className="mobile-menu-btn"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
          >
            ☰
          </button>

          <div className={`nav-menu ${mobileMenuOpen ? "active" : ""}`}>
            <ul className="nav-links">
              <li>
                <Link to="/" onClick={() => setMobileMenuOpen(false)}>
                  Gallery
                </Link>
              </li>

              {isAuthenticated ? (
                <>
                  <li>
                    <Link to="/submit" onClick={() => setMobileMenuOpen(false)}>
                      Submit Film
                    </Link>
                  </li>
                  <li className="nav-user">
                    <span className="user-name">{director?.teamName || "Director"}</span>
                    <button
                      onClick={handleLogout}
                      className="nav-logout"
                    >
                      Logout
                    </button>
                  </li>
                </>
              ) : (
                <>
                  <li>
                    <Link to="/login" onClick={() => setMobileMenuOpen(false)}>
                      Login
                    </Link>
                  </li>
                  <li>
                    <Link to="/register" className="btn btn-primary" onClick={() => setMobileMenuOpen(false)}>
                      Register
                    </Link>
                  </li>
                </>
              )}
            </ul>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navigation;
