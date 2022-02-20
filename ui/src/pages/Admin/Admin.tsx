import React, { memo } from "react";
import { Redirect } from "react-router";

const AdminPage = () => {
  return <Redirect to="/admin/stacks" />;
};

export default memo(AdminPage);
