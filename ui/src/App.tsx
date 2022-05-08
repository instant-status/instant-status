import { lighten } from "polished";
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
import { createGlobalStyle, ThemeProvider } from "styled-components";

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
import theme from "./utils/theme";

const GlobalStyle = createGlobalStyle`
  html {
    box-sizing: border-box;
    height: 100%;
  }
  *,
  *:before,
  *:after {
    box-sizing: inherit;
  }
  body {
    font-family: "PT Sans", sans-serif;
    font-weight: 400;
    font-size: 18px;
    margin: 0;
    padding: 0;
    min-height: 100%;
    background-color: ${(props) => props.theme.color.darkOne};
  }
  b, strong {
    font-weight: 700;
  }
  hr {
    border-color: ${(props) => lighten(0.1, props.theme.color.darkOne)}
  }
  .full-width {
    width: 100%;
    height: 100%;
    padding: 2rem;
    overflow: auto;
  }
`;

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
    <ThemeProvider theme={theme}>
      <Helmet>
        <title>{APP_CONFIG.APP_NAME} | Instant Status</title>
      </Helmet>
      <GlobalStyle />
      <QueryClientProvider client={queryClient}>
        <StoreProvider>
          <BrowserRouter>
            <Root />
          </BrowserRouter>
        </StoreProvider>
      </QueryClientProvider>

      {APP_CONFIG.DEV_MODE && <DevMenu />}
    </ThemeProvider>
  );
};

export default App;
