import React, { memo } from "react";
import { useQuery } from "react-query";

import apiRoutes from "../../api/apiRoutes";
import Stack from "../Layout/Stack";
import Sidebar from "./Sidebar";
import SidebarListTab from "./SidebarListTab";

const AdminSidebar = () => {
  const sidebarQuery = useQuery(`sidebarData`, apiRoutes.apiGetStacksMetadata);

  return (
    <Sidebar
      stackCount={sidebarQuery.data?.stackCount}
      serverCount={sidebarQuery.data?.serverCount}
      isSuperAdmin={sidebarQuery.data?.isSuperAdmin}
      isLoading={sidebarQuery.isLoading}
    >
      <Stack direction="down" spacing={4}>
        <SidebarListTab to={`/admin/stacks`}>Manage Stacks</SidebarListTab>
        <SidebarListTab to={`/admin/roles`}>Manage Roles</SidebarListTab>
        <SidebarListTab to={`/admin/users`}>Manage Users</SidebarListTab>
      </Stack>
    </Sidebar>
  );
};

export default memo(AdminSidebar);
