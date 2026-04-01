import { Navigate, Route, Routes } from "react-router-dom";
import PublicGallery from "./pages/PublicGallery";
import AdminModeration from "./pages/AdminModeration";
import LoginPage from "./pages/LoginPage";
import RegistrationPage from "./pages/RegistrationPage";
import SubmissionPage from "./pages/SubmissionPage";
import RequireAuth from "./components/RequireAuth";

function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<PublicGallery />} />
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegistrationPage />} />
      <Route element={<RequireAuth />}>
        <Route path="/submit" element={<SubmissionPage />} />
      </Route>
      <Route path="/admin/moderation" element={<AdminModeration />} />
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  );
}

export default AppRoutes;
