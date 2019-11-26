import React, { useState, useEffect } from "react";
import GoogleLogin from "react-google-login";
import { GoogleLogout } from "react-google-login";
import useFetch from "./hooks/useFetch";
import Sidebar from "./components/sidebar/Sidebar";
import styled from "styled-components";
import PageContent from "./components/PageContent";

const Wrapper = styled.div`
  display: flex;
`;

const StatusPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("isLoggedIn") === "true") {
      setIsLoggedIn(true);
    }
  }, []);

  const responseGoogle = (response: any) => {
    if (response.Zi) {
      setIsLoggedIn(true);
      localStorage.setItem("isLoggedIn", "true");
      localStorage.setItem("user", JSON.stringify(response.Zi));
    } else {
      alert("Something went wrong! Try again...");
    }
  };

  const logout = () => {
    setIsLoggedIn(false);
    localStorage.setItem("isLoggedIn", "false");
    localStorage.setItem("user", null);
  };

  return (
    <Wrapper>
      <PageContent />
    </Wrapper>
  );
};
// <GoogleLogin
//   clientId="1005728579916-nepm78d66vdfgle17pd3c64pdrg16v0d.apps.googleusercontent.com"
//   buttonText="Login with Google"
//   onSuccess={responseGoogle}
//   onFailure={responseGoogle}
//   cookiePolicy={"single_host_origin"}
// />
// <GoogleLogout
//   clientId="1005728579916-nepm78d66vdfgle17pd3c64pdrg16v0d.apps.googleusercontent.com"
//   buttonText="Logout"
//   onLogoutSuccess={logout}
// />

export default StatusPage;
