import { Authenticated, Refine } from "@refinedev/core";
import { DevtoolsProvider } from "@refinedev/devtools";
import { RefineKbar, RefineKbarProvider } from "@refinedev/kbar";
import GroupIcon from "@mui/icons-material/Group";
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import AssignmentIcon from '@mui/icons-material/Assignment';
import ChecklistIcon from '@mui/icons-material/Checklist';

import PersonIcon from '@mui/icons-material/Person';
import MeetingRoomIcon from '@mui/icons-material/MeetingRoom';
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
import { IUser } from "./interfaces";
import { HomePage } from "./pages/home/HomePage";
import { BluewaterLogo } from "./components/BluewaterLogo";
import FamiliesAdmin from "./pages/admin/families";
import ProfilesAdmin from "./pages/admin/profiles";
import RoomsAdmin from "./pages/admin/rooms";
import EventsAdmin from "./pages/admin/events";
import { EventShow } from "./pages/events/show";
import TasksPage from "./pages/tasks/list";
import TaskDetailPage from "./pages/tasks/show";
import { TaskEdit } from "./pages/tasks/edit";
import { TaskCreate } from "./pages/tasks/create";
import FamiliesPage from "./pages/family/list";
import FamilyDetailPage from "./pages/family/show";
import { FamilyEdit } from "./pages/family/edit";
import { FamilyCreate } from "./pages/family/create";
import EventsPage from "./pages/events/list";
import { EventEdit } from "./pages/events/edit";
import { EventCreate } from "./pages/events/create";
import ChecklistsPage from "./pages/checklists/list";
import { ChecklistShow } from "./pages/checklists/show";
import { ChecklistEdit } from "./pages/checklists/edit";
import { ChecklistCreate } from "./pages/checklists/create";
import { Typography } from "@mui/material";
import React, { useEffect, useState } from "react";

export const accessControlProvider = {
  can: async ({ resource, action, params }: any) => {
    const identity = authProvider.getIdentity ? (await authProvider.getIdentity()) as IUser : undefined;
    const isAdmin = identity?.is_admin;

    const restrictedResources = ["profiles", "rooms"];
    if (restrictedResources.includes(resource) && !isAdmin) {
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

const AdminOnly: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [allowed, setAllowed] = useState<boolean | null>(null);
  useEffect(() => {
    (async () => {
      try {
        const identity = authProvider.getIdentity ? (await authProvider.getIdentity()) as IUser : undefined;
        setAllowed(!!identity?.is_admin);
      } catch {
        setAllowed(false);
      }
    })();
  }, []);

  if (allowed === null) return null;
  if (!allowed) return <ErrorComponent />;
  return <>{children}</>;
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
                    list: "/events",
                    edit: "/events/edit/:id",
                    create: "/events/create",

                  },
                  {
                    name: "families",
                    list: "/families",
                    show: "/families/:id",
                    edit: "/families/edit/:id",
                    create: "/families/create",
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
                    name: "checklists",
                    list: "/checklists",
                    show: "/checklists/:id",
                    edit: "/checklists/edit/:id",
                    create: "/checklists/create",
                    icon: <ChecklistIcon />,
                  },
                  {
                    name: "profiles",
                    list: "/admin/profiles",
                    icon: <PersonIcon />,
                  },
                  {
                    name: "rooms",
                    list: "/admin/rooms",
                    icon: <MeetingRoomIcon />,
                  },
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
                            text={<Typography variant="subtitle1">Bluewater Portal</Typography>}
                            icon={<BluewaterLogo fontSize="small" />}
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
                      <Route index element={<EventsPage />} />
                      <Route path="show/:id" element={<EventShow />} />
                      <Route path="edit/:id" element={<EventEdit />} />
                      <Route path="create" element={<EventCreate />} />

                    </Route>

                    <Route path="/profile">
                      <Route index element={<ManageProfile />} />
                    </Route>

                    <Route path="/families">
                      <Route index element={<FamiliesPage />} />

                      <Route path=":id" element={<FamilyDetailPage />} />
                      <Route path="edit/:id" element={<FamilyEdit />} />
                      <Route path="create" element={<FamilyCreate />} />
                    </Route>

                    <Route path="/tasks">
                      <Route index element={<TasksPage />} />
                      <Route path=":id" element={<TaskDetailPage />} />
                      <Route path="edit/:id" element={<TaskEdit />} />
                      <Route path="create" element={<TaskCreate />} />

                    </Route>

                    <Route path="/checklists">
                      <Route index element={<ChecklistsPage />} />
                      <Route path=":id" element={<ChecklistShow />} />
                      <Route path="edit/:id" element={<ChecklistEdit />} />
                      <Route path="create" element={<ChecklistCreate />} />

                    </Route>

                    <Route path="/admin" element={<AdminOnly><Outlet /></AdminOnly>}>
                      <Route path="families" element={<FamiliesAdmin />} />
                      <Route path="profiles" element={<ProfilesAdmin />} />
                      <Route path="rooms" element={<RoomsAdmin />} />
                      <Route path="events" element={<EventsAdmin />} />
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
