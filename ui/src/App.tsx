import { lighten } from "polished";
import React from "react";
import { Helmet } from "react-helmet";
import { ReactQueryDevtools } from "react-query-devtools";
import { BrowserRouter, Redirect, Route, Switch } from "react-router-dom";
import { createGlobalStyle, ThemeProvider } from "styled-components";

import DevMenu from "./components/devTools/DevMenu";
import APP_CONFIG from "../../config/appConfig";
import useIsLoggedIn from "./hooks/useIsLoggedIn";
import AutoLogin from "./pages/AutoLogin";
import Login from "./pages/Login";
import Logout from "./pages/Logout";
import StatusPage from "./pages/StatusPage";
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
`;

const App = () => {
  const { isLoggedIn } = useIsLoggedIn();

  return (
    <ThemeProvider theme={theme}>
      <Helmet>
        <title>{APP_CONFIG.APP_NAME}</title>
      </Helmet>
      <GlobalStyle />
      <BrowserRouter>
        <Route
          render={({ location }) => (
            <Switch location={location} key={location.pathname}>
              <Route exact path="/google">
                {!isLoggedIn ? <AutoLogin /> : <Redirect to="/" />}
              </Route>
              <Route exact path="/login">
                {!isLoggedIn ? <Login /> : <Redirect to="/" />}
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
      </BrowserRouter>
      {APP_CONFIG.DEV_MODE && (
        <>
          <DevMenu />
          <ReactQueryDevtools initialIsOpen={true} />
        </>
      )}
    </ThemeProvider>
  );
};

export default App;
