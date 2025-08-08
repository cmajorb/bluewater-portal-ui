import { Authenticated, Refine } from "@refinedev/core";
import { DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import GroupIcon from "@mui/icons-material/Group";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import AssignmentIcon from '@mui/icons-material/Assignment';
import {
  ErrorComponent,
  RefineSnackbarProvider,
  ThemedLayoutV2,
  ThemedTitleV2,
  useNotificationProvider,
} from "@refinedev/mui";

import CssBaseline from "@mui/material/CssBaseline";
import GlobalStyles from "@mui/material/GlobalStyles";
import routerBindings, {
  CatchAllNavigate,
  DocumentTitleHandler,
  NavigateToResource,
  UnsavedChangesNotifier,
} from "@refinedev/react-router";
import { BrowserRouter, Outlet, Route, Routes } from "react-router";
import { authProvider } from "./authProvider";
import { Header } from "./components/header";
import { ColorModeContextProvider } from "./contexts/color-mode";
import {
  BookingCreate,
  BookingEdit,
  BookingList,
  BookingShow,
} from "./pages/bookings";
import { ManageProfile } from "./pages/profile";
import { ForgotPassword } from "./pages/forgotPassword";
import { Login } from "./pages/login";
import { Register } from "./pages/register";
import { customDataProvider } from "./dataProvider";
import { FamilyManager } from "./pages/family";
import { IUser } from "./interfaces";
import AdminPanel from "./pages/admin/manage";
import { HomePage } from "./pages/home/HomePage";
import FamiliesAdmin from "./pages/admin/families";
import ProfilesAdmin from "./pages/admin/profiles";
import RoomsAdmin from "./pages/admin/rooms";
import EventsAdmin from "./pages/admin/events";
import { EventShow } from "./pages/bookings/event";
import TasksPage from "./pages/tasks/list";
import TaskDetailPage from "./pages/tasks/show";
import TasksAdmin from "./pages/admin/tasks";
import { TaskEdit } from "./pages/tasks/edit";
import { TaskCreate } from "./pages/tasks/create";

export const accessControlProvider = {
  can: async ({ resource, action, params }: any) => {
    const identity = authProvider.getIdentity ? (await authProvider.getIdentity()) as IUser : undefined;
    const isAdmin = identity?.is_admin;

    if (resource === "admin" && !isAdmin) {
      // If the resource is "admin" and the user is not an admin, deny access.
      return {
        can: false,
        reason: "Unauthorized",
      };
    }

    // Allow access for all other cases
    return { can: true };
  },
};

function App() {
  return (
    <BrowserRouter>
      <RefineKbarProvider>
        <ColorModeContextProvider>
          <CssBaseline />
          <GlobalStyles styles={{ html: { WebkitFontSmoothing: "auto" } }} />
          <RefineSnackbarProvider>
            <DevtoolsProvider>
              <Refine
                dataProvider={customDataProvider}
                notificationProvider={useNotificationProvider}
                routerProvider={routerBindings}
                authProvider={authProvider}
                accessControlProvider={accessControlProvider}
                resources={[
                  {
                    name: "welcome",
                    list: "/welcome",
                    meta: { hide: true },
                  },
                  {
                    name: "bookings",
                    list: "/bookings",
                    create: "/bookings/create",
                    edit: "/bookings/edit/:id",
                    show: "/bookings/show/:id",
                    icon: <CalendarMonthIcon />,
                  },
                  {
                    name: "events",
                    show: "/events/show/:id",
                  },
                  {
                    name: "family member",
                    list: "/family",
                    icon: <GroupIcon />
                  },
                  {
                    name: "tasks",
                    list: "/tasks",
                    show: "/tasks/:id",
                    edit: "/tasks/edit/:id",
                    create: "/tasks/create",
                    icon: <AssignmentIcon />,
                  },
                  {
                    name: "admin",
                    list: "/admin",
                    icon: <AdminPanelSettingsIcon />, // optional
                  }
                ]}
                options={{
                  syncWithLocation: true,
                  warnWhenUnsavedChanges: true,
                  useNewQueryKeys: true,
                  projectId: "wSl3TA-VIhcRk-3HJ2cW",
                }}
              >
                <Routes>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-inner"
                        fallback={<CatchAllNavigate to="/login" />}
                      >
                        <ThemedLayoutV2 Header={Header} Title={({ collapsed }) => (
                          <ThemedTitleV2
                            collapsed={collapsed}
                            text="Bluewater Portal"
                          />
                        )}>
                          <Outlet />
                        </ThemedLayoutV2>
                      </Authenticated>
                    }
                  >
                    <Route
                      index
                      element={<NavigateToResource resource="welcome" />}
                    />
                    <Route path="/welcome" element={<HomePage />} />
                    <Route path="/bookings">
                      <Route index element={<BookingList />} />
                      <Route path="create" element={<BookingCreate />} />
                      <Route path="edit/:id" element={<BookingEdit />} />
                      <Route path="show/:id" element={<BookingShow />} />
                    </Route>

                    <Route path="/events">
                      <Route path="show/:id" element={<EventShow />} />
                    </Route>

                    <Route path="/profile">
                      <Route index element={<ManageProfile />} />
                    </Route>

                    <Route path="/family">
                      <Route index element={<FamilyManager />} />
                    </Route>

                    <Route path="/tasks">
                      <Route index element={<TasksPage />} />
                      <Route path=":id" element={<TaskDetailPage />} />
                      <Route path="edit/:id" element={<TaskEdit />} />
                      <Route path="create" element={<TaskCreate />} />
                      
                    </Route>

                    <Route path="/admin">
                      <Route index element={<AdminPanel />} />
                      <Route path="families" element={<FamiliesAdmin />} />
                      <Route path="profiles" element={<ProfilesAdmin />} />
                      <Route path="rooms" element={<RoomsAdmin />} />
                      <Route path="events" element={<EventsAdmin />} />
                      <Route path="tasks" element={<TasksAdmin />} />

                    </Route>

                    <Route path="*" element={<ErrorComponent />} />
                  </Route>
                  <Route
                    element={
                      <Authenticated
                        key="authenticated-outer"
                        fallback={<Outlet />}
                      >
                        <NavigateToResource />
                      </Authenticated>
                    }
                  >
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                      path="/forgot-password"
                      element={<ForgotPassword />}
                    />
                  </Route>
                </Routes>

                <RefineKbar />
                <UnsavedChangesNotifier />
                <DocumentTitleHandler />
              </Refine>
            </DevtoolsProvider>
          </RefineSnackbarProvider>
        </ColorModeContextProvider>
      </RefineKbarProvider>
    </BrowserRouter>
  );
}

export default App;
