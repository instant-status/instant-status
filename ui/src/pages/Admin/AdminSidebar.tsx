import React, { memo } from "react";
import { useQuery } from "react-query";

import apiRoutes from "../../api/apiRoutes";
import Stack from "../../components/Layout/Stack";
import Sidebar from "../../components/Sidebar/Sidebar";
import SidebarListTab from "../../components/Sidebar/SidebarListTab";

const AdminSidebar = () => {
  const sidebarQuery = useQuery(`sidebarData`, apiRoutes.apiGetStacksMetadata);

  return (
    <Sidebar
      stackCount={sidebarQuery.data?.stackCount}
      serverCount={sidebarQuery.data?.serverCount}
    >
      <Stack direction="down" spacing={4}>
        <SidebarListTab to={`/admin/stacks`}>Manage Stacks</SidebarListTab>
      </Stack>
    </Sidebar>
  );
};

export default memo(AdminSidebar);
