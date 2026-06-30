import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./pages/LoginPage";
import SignupPage from "./pages/SignupPage";
import CommunityBrowsePage from "./pages/CommunityBrowsePage";
import DashboardPage from "./pages/DashboardPage";
import ProtectedRoute from "./components/layout/ProtectedRoute";
import CommunityChatPage from "./pages/CommunityChatPage";
import CommunityManagePage from "./pages/CommunityManagePage";
import PageWrapper from "./components/layout/PageWrapper";
function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/dashboard"
        element={
          <ProtectedRoute>
            <DashboardPage />
          </ProtectedRoute>
        }
      />
      <Route path="/community/:communityId/manage" element={<ProtectedRoute><CommunityManagePage /></ProtectedRoute>} />
      
      <Route path="/community/:communityId" element={<ProtectedRoute><CommunityChatPage /></ProtectedRoute>} />
      <Route path="*" element={<Navigate to="/login" />} />
      <Route path="/signup" element={<SignupPage />} />
      <Route path="/communities" element={<ProtectedRoute><CommunityBrowsePage /></ProtectedRoute>} />
    </Routes>
  );
}

export default App;