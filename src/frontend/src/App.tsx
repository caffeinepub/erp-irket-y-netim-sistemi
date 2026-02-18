import { RouterProvider, createRouter, createRoute, createRootRoute } from '@tanstack/react-router';
import { useInternetIdentity } from './hooks/useInternetIdentity';
import LoginSelection from './pages/LoginSelection';
import CompanyLogin from './pages/CompanyLogin';
import ManagerLogin from './pages/ManagerLogin';
import EmployeeLogin from './pages/EmployeeLogin';
import OwnerDashboard from './pages/OwnerDashboard';
import ManagerDashboard from './pages/ManagerDashboard';
import EmployeeDashboard from './pages/EmployeeDashboard';
import ManagerManagement from './pages/ManagerManagement';
import EmployeeManagement from './pages/EmployeeManagement';
import PersonnelManagement from './pages/PersonnelManagement';
import TaskManagement from './pages/TaskManagement';
import AnnouncementManagement from './pages/AnnouncementManagement';
import ReportingModule from './pages/ReportingModule';
import DashboardLayout from './components/Layout/DashboardLayout';

function RootComponent() {
  const { identity } = useInternetIdentity();
  return identity ? <DashboardLayout /> : <LoginSelection />;
}

const rootRoute = createRootRoute({
  component: RootComponent,
});

const indexRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/',
  component: LoginSelection,
});

const companyLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/company-login',
  component: CompanyLogin,
});

const managerLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/manager-login',
  component: ManagerLogin,
});

const employeeLoginRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employee-login',
  component: EmployeeLogin,
});

const ownerDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/owner',
  component: OwnerDashboard,
});

const managerManagementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/owner/managers',
  component: ManagerManagement,
});

const managerDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/manager',
  component: ManagerDashboard,
});

const employeeManagementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/manager/employees',
  component: EmployeeManagement,
});

const employeeDashboardRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/employee',
  component: EmployeeDashboard,
});

const personnelManagementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/personnel',
  component: PersonnelManagement,
});

const taskManagementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/tasks',
  component: TaskManagement,
});

const announcementManagementRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/announcements',
  component: AnnouncementManagement,
});

const reportingModuleRoute = createRoute({
  getParentRoute: () => rootRoute,
  path: '/reports',
  component: ReportingModule,
});

const routeTree = rootRoute.addChildren([
  indexRoute,
  companyLoginRoute,
  managerLoginRoute,
  employeeLoginRoute,
  ownerDashboardRoute,
  managerManagementRoute,
  managerDashboardRoute,
  employeeManagementRoute,
  employeeDashboardRoute,
  personnelManagementRoute,
  taskManagementRoute,
  announcementManagementRoute,
  reportingModuleRoute,
]);

const router = createRouter({ routeTree });

declare module '@tanstack/react-router' {
  interface Register {
    router: typeof router;
  }
}

export default function App() {
  return <RouterProvider router={router} />;
}
