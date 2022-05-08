import React, { memo } from "react";
import { Navigate, Route, Routes } from "react-router-dom";

import AdminRoles from "./AdminRoles";
import AdminStacks from "./AdminStacks";
import AdminUsers from "./AdminUsers";

const AdminPage = () => {
  return (
    <Routes>
      <Route path="stacks" element={<AdminStacks />} />
      <Route path="roles" element={<AdminRoles />} />
      <Route path="users" element={<AdminUsers />} />
      <Route path="*" element={<Navigate to="stacks" />} />
    </Routes>
  );
};

export default memo(AdminPage);
