import { lighten } from "polished";
import React from "react";
import { Helmet } from "react-helmet";
import { QueryClient, QueryClientProvider } from "react-query";
import {
  BrowserRouter,
  Navigate,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { QueryParamProvider } from "use-query-params";
import APP_CONFIG from "../appConfig";
import DevMenu from "./components/DevTools/DevMenu";
import useIsLoggedIn from "./hooks/useIsLoggedIn";
import Admin from "./pages/Admin/Admin";

import AutoLogin from "./pages/Auth/AutoLogin";
import Login from "./pages/Auth/Login";
import Logout from "./pages/Auth/Logout";
import StatusPage from "./pages/StatusOverview/StatusPage";
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
        to={APP_CONFIG.GOOGLE_AUTH_URL ? "/google" : "/login"}
        state={{ from: location }}
        replace={true}
      />
    );
  }

  if (isLoggedIn && props.requireAuth === false) {
    return (
      <Navigate to={location.state?.from?.pathname ?? "/"} replace={true} />
    );
  }

  return props.children;
};

// Not happy with this...
const RouteAdapter = ({ children }) => {
  const navigate = useNavigate();
  const location = useLocation();

  const adaptedHistory = React.useMemo(
    () => ({
      replace(location) {
        navigate(location, { replace: true, state: location.state });
      },
      push(location) {
        navigate(location, { replace: false, state: location.state });
      },
    }),
    [navigate],
  );
  return children({ history: adaptedHistory, location });
};

const App = () => {
  const queryClient = new QueryClient();

  return (
    <ThemeProvider theme={theme}>
      <Helmet>
        <title>{APP_CONFIG.APP_NAME}</title>
      </Helmet>
      <GlobalStyle />
      <QueryClientProvider client={queryClient}>
        <StoreProvider>
          <BrowserRouter>
            <QueryParamProvider ReactRouterRoute={RouteAdapter}>
              <Routes>
                <Route
                  path="/"
                  element={
                    <AuthCheck requireAuth={true}>
                      <StatusPage />
                    </AuthCheck>
                  }
                />
                <Route
                  path="login"
                  element={
                    <AuthCheck requireAuth={false}>
                      <Login />
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
                  path="admin/*"
                  element={
                    <AuthCheck requireAuth={true}>
                      <Admin />
                    </AuthCheck>
                  }
                />
                <Route path="logout" element={<Logout />} />
              </Routes>
            </QueryParamProvider>
          </BrowserRouter>
        </StoreProvider>
      </QueryClientProvider>

      {APP_CONFIG.DEV_MODE && <DevMenu />}
    </ThemeProvider>
  );
};

export default App;
