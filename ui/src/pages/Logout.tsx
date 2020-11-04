import React, { memo, useEffect } from "react";
import { Redirect } from "react-router-dom";

const Logout = () => {
  useEffect(() => {
    localStorage.removeItem(`bearer`);
  }, []);
  return <Redirect to="/" />;
};

export default memo(Logout);
