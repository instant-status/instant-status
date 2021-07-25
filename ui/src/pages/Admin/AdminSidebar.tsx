import APP_CONFIG from "@config/appConfig";
import React, { memo } from "react";
import { useQuery } from "react-query";
import { Link } from "react-router-dom";

import Sidebar from "../../components/Sidebar/Sidebar";
import fetchUrl from "../../hooks/useFetch";

const AdminSidebar = () => {
  const sidebarQuery = useQuery(
    `sidebarData`,
    () => fetchUrl(`${APP_CONFIG.DATA_URL}/v2/metadata`),
    {
      refetchInterval: 10000, // Refetch the data every 10 seconds
    },
  );

  return (
    <Sidebar
      stackCount={sidebarQuery.data?.stackCount || 0}
      serverCount={sidebarQuery.data?.serverCount || 0}
    >
      <Link to="/admin/stacks">Stacks</Link>
    </Sidebar>
  );
};

export default memo(AdminSidebar);
