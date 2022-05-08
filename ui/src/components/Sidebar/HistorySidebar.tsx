import React, { memo } from "react";
import { useQuery } from "react-query";

import apiRoutes from "../../api/apiRoutes";
import Sidebar from "./Sidebar";

const HistorySidebar = () => {
  const sidebarQuery = useQuery(`sidebarData`, apiRoutes.apiGetStacksMetadata);

  return (
    <Sidebar
      stackCount={sidebarQuery.data?.stackCount}
      serverCount={sidebarQuery.data?.serverCount}
      isSuperAdmin={sidebarQuery.data?.isSuperAdmin}
      isLoading={sidebarQuery.isLoading}
    >
      <div />
    </Sidebar>
  );
};

export default memo(HistorySidebar);
