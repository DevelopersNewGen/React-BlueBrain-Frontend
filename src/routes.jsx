import { DashboardPage } from "./pages/dashboard/DashboardPage";
import AuthCallback from "./pages/auth/AuthCallback";
import AuthError from "./pages/auth/AuthError";
import LoginPage from "./pages/auth/LoginPage";
import UsersList from "./components/user/UsersList";
import ReportsPage from "./pages/reports/ReportsPage";
import SubjectPage from "./pages/subject/SubjectPage";
import ApplicationsPage from "./pages/application/ApplicationsPage";
import { TutorialPage } from "./pages/tutorial/TutorialPage";
import ProtectedRoute from "./shared/components/ProtectedRoute";


const routes = [
  { path: "/login", element: <LoginPage /> },
  { path: "/auth/callback", element: <AuthCallback /> },
  { path: "/auth/error", element: <AuthError /> },
  { 
    path: "/usuarios", 
    element: (
      <ProtectedRoute>
        <UsersList />
      </ProtectedRoute>
    ) 
  },
  { 
    path: "/reportes", 
    element: (
      <ProtectedRoute>
        <ReportsPage />
      </ProtectedRoute>
    ) 
  },
  { 
    path: "/", 
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ) 
  },
  { 
    path: "*", 
    element: (
      <ProtectedRoute>
        <DashboardPage />
      </ProtectedRoute>
    ) 
  },
  { 
    path: "/subjects", 
    element: (
      <ProtectedRoute>
        <SubjectPage />
      </ProtectedRoute>
    ) 
  },
  { 
    path: "/applications", 
    element: (
      <ProtectedRoute>
        <ApplicationsPage />
      </ProtectedRoute>
    ) 
  },
  { 
    path: "/tutorial", 
    element: (
      <ProtectedRoute>
        <TutorialPage />
      </ProtectedRoute>
    ) 
  },
];


export default routes;