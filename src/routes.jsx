import { DashboardPage } from "./pages/dashboard/DashboardPage";
import AuthCallback from "./pages/auth/AuthCallback";
import AuthError from "./pages/auth/AuthError";
import LoginPage from "./pages/auth/LoginPage";
import UsersList from "./components/user/UsersList";
import SubjectPage from "./pages/subject/SubjectPage";


const routes = [
  { path: "/login", element: <LoginPage /> },
  { path: "/auth/callback", element: <AuthCallback /> },
  { path: "/auth/error", element: <AuthError /> },
  { path: "/usuarios", element: <UsersList /> },
  { path: "/*", element: <DashboardPage /> },
  { path: "/subjects", element: <SubjectPage /> },
];

export default routes;