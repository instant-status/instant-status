import APP_CONFIG from "@config/appConfig";
import { lighten } from "polished";
import React from "react";
import { Helmet } from "react-helmet";
import { QueryClient, QueryClientProvider } from "react-query";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { createGlobalStyle, ThemeProvider } from "styled-components";
import { QueryParamProvider } from "use-query-params";

import DevMenu from "./components/DevTools/DevMenu";
import AutoLogin from "./containers/Auth/AutoLogin";
import Login from "./containers/Auth/Login";
import Logout from "./containers/Auth/Logout";
import StatusPage from "./containers/StatusPage";
import useIsLoggedIn from "./hooks/useIsLoggedIn";
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

const App = () => {
  const { isLoggedIn } = useIsLoggedIn();
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
            <QueryParamProvider ReactRouterRoute={Route}>
              <Route
                render={({ location }) => (
                  <Switch location={location} key={location.pathname}>
                    <Route exact path="/google">
                      {!isLoggedIn ? <AutoLogin /> : <Redirect to="/" />}
                    </Route>
                    <Route exact path="/login">
                      {!isLoggedIn ? (
                        APP_CONFIG.GOOGLE_AUTH_URL ? (
                          <Redirect to="/google" />
                        ) : (
                          <Login />
                        )
                      ) : (
                        <Redirect to="/" />
                      )}
                    </Route>
                    <Route exact path="/logout">
                      <Logout />
                    </Route>
                    <Route path="/">
                      {isLoggedIn ? <StatusPage /> : <Redirect to="/login" />}
                    </Route>
                  </Switch>
                )}
              />
            </QueryParamProvider>
          </BrowserRouter>
        </StoreProvider>
      </QueryClientProvider>

      {APP_CONFIG.DEV_MODE && <DevMenu />}
    </ThemeProvider>
  );
};

export default App;
