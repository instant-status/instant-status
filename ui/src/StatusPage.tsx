import React, { useState, useEffect } from "react";
import GoogleLogin from "react-google-login";
import { GoogleLogout } from "react-google-login";
import useFetch from "./hooks/useFetch";

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

  const res = useFetch("http://localhost:3000/demo", [isLoggedIn]);
  if (!res) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      {!isLoggedIn ? (
        <GoogleLogin
          clientId="1005728579916-nepm78d66vdfgle17pd3c64pdrg16v0d.apps.googleusercontent.com"
          buttonText="Login with Google"
          onSuccess={responseGoogle}
          onFailure={responseGoogle}
          cookiePolicy={"single_host_origin"}
        />
      ) : (
        <>
          <pre>{JSON.stringify(res)}</pre>
          <GoogleLogout
            clientId="1005728579916-nepm78d66vdfgle17pd3c64pdrg16v0d.apps.googleusercontent.com"
            buttonText="Logout"
            onLogoutSuccess={logout}
          />
        </>
      )}
    </div>
  );
};

export default StatusPage;
