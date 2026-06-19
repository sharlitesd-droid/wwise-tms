import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import { ToastProvider } from './context/ToastContext';
import ProtectedRoute from './components/auth/ProtectedRoute';
import LoginPage from './components/auth/LoginPage';
import RegisterPage from './components/auth/RegisterPage';
import Layout from './components/layout/Layout';
import Dashboard from './components/dashboard/Dashboard';
import TaskList from './components/tasks/TaskList';
import ProjectList from './components/projects/ProjectList';
import Reports from './components/reports/Reports';
import UserManagement from './components/users/UserManagement';
import LoadingSpinner from './components/common/LoadingSpinner';

function PublicRoute({ children }) {
  const { user, userProfile, loading } = useAuth();
  if (loading) return <LoadingSpinner message="Signing in..." />;
  if (user && userProfile) return <Navigate to="/" replace />;
  return children;
}

export default function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ToastProvider>
          <Routes>
          <Route
            path="/login"
            element={
              <PublicRoute>
                <LoginPage />
              </PublicRoute>
            }
          />
          <Route
            path="/register"
            element={
              <PublicRoute>
                <RegisterPage />
              </PublicRoute>
            }
          />
          <Route
            element={
              <ProtectedRoute>
                <Layout />
              </ProtectedRoute>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="tasks" element={<TaskList />} />
            <Route path="projects" element={<ProjectList />} />
            <Route path="reports" element={<Reports />} />
            <Route
              path="users"
              element={
                <ProtectedRoute adminOnly>
                  <UserManagement />
                </ProtectedRoute>
              }
            />
          </Route>
          <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </ToastProvider>
      </AuthProvider>
    </BrowserRouter>
  );
}
