import APP_CONFIG from "@config/appConfig";
import React, { memo } from "react";
import { useQuery } from "react-query";

import Stack from "../../components/Layout/Stack";
import Sidebar from "../../components/Sidebar/Sidebar";
import SidebarListTab from "../../components/Sidebar/SidebarListTab";
import fetchUrl from "../../hooks/useFetch";

const AdminSidebar = () => {
  const sidebarQuery = useQuery(`sidebarData`, () =>
    fetchUrl(`${APP_CONFIG.DATA_URL}/v2/metadata`),
  );

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
