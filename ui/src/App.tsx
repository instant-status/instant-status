import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
  useSearchParams,
} from "react-router-dom";

import APP_CONFIG from "../appConfig";
import DevMenu from "./components/DevTools/DevMenu";
import useIsLoggedIn from "./hooks/useIsLoggedIn";
import Admin from "./pages/Admin/Admin";
import AutoLogin from "./pages/Auth/AutoLogin";
import Login from "./pages/Auth/Login";
import Logout from "./pages/Auth/Logout";
import StatusPage from "./pages/StatusOverview/StatusPage";
import HistoryPage from "./pages/Updates/History";
import { StoreProvider } from "./store/globalStore";

const AuthCheck = (props: { requireAuth: boolean; children: JSX.Element }) => {
  const { isLoggedIn } = useIsLoggedIn();

  const location = useLocation() as {
    state?: {
      from?: {
        pathname?: string;
      };
    };
  };

  if (!isLoggedIn && props.requireAuth) {
    return (
      <Navigate
        to={APP_CONFIG.GOOGLE_AUTH_URL ? `/google` : `/login`}
        state={{ from: location }}
        replace={true}
      />
    );
  }

  if (isLoggedIn && props.requireAuth === false) {
    return (
      <Navigate to={location.state?.from?.pathname ?? `/`} replace={true} />
    );
  }

  return props.children;
};

const Root = () => {
  const location = useLocation();
  const navigateTo = useNavigate();

  const [searchParams] = useSearchParams();
  const shouldRedirect = searchParams.get(`restore_page`) === `true`;

  const ignoredPaths = [`/logout`, `/google`, `/login`];

  useEffect(() => {
    if (!ignoredPaths.includes(location.pathname)) {
      if (shouldRedirect) {
        const loginRedirect = localStorage.getItem(`currentPage`);
        if (loginRedirect) navigateTo(loginRedirect);
      }
      localStorage.setItem(`currentPage`, location.pathname);
    }
  }, [location.pathname, shouldRedirect]);

  return (
    <Routes>
      <Route
        path="login"
        element={
          <AuthCheck requireAuth={false}>
            {APP_CONFIG.GOOGLE_AUTH_URL ? <AutoLogin /> : <Login />}
          </AuthCheck>
        }
      />
      <Route
        path="google"
        element={
          <AuthCheck requireAuth={false}>
            <AutoLogin />
          </AuthCheck>
        }
      />
      <Route
        path="history"
        element={
          <AuthCheck requireAuth={true}>
            <HistoryPage />
          </AuthCheck>
        }
      />
      <Route
        path="admin/*"
        element={
          <AuthCheck requireAuth={true}>
            <Admin />
          </AuthCheck>
        }
      />
      <Route path="logout" element={<Logout />} />
      <Route
        path="*"
        element={
          <AuthCheck requireAuth={true}>
            <StatusPage />
          </AuthCheck>
        }
      />
    </Routes>
  );
};

const App = () => {
  const queryClient = new QueryClient();

  return (
    <>
      <Helmet>
        <title>{APP_CONFIG.APP_NAME} | Instant Status</title>
      </Helmet>
      <QueryClientProvider client={queryClient}>
        <StoreProvider>
          <BrowserRouter>
            <Root />
          </BrowserRouter>
        </StoreProvider>
      </QueryClientProvider>

      {APP_CONFIG.DEV_MODE && <DevMenu />}
    </>
  );
};

export default App;
