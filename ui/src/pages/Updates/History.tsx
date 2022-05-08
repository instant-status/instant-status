import React from "react";
import { useQuery } from "react-query";

import apiRoutes from "../../api/apiRoutes";
import UpdatePage from "../../components/Layout/UpdatePage";
import UpdatesTable from "./Tables/UpdatesTable";

const HistoryPage = () => {
  const updatesQuery = useQuery(`updatesData`, apiRoutes.apiGetUpdatesList, {
    refetchOnWindowFocus: false,
  });

  const placeholderData = { updateList: [], totalCount: 0 };

  const updatesData = updatesQuery.isFetching
    ? placeholderData
    : updatesQuery?.data ?? placeholderData;

  return (
    <UpdatePage pageTitle={`Update History (${updatesData.updateList.length})`}>
      <UpdatesTable
        updates={updatesData.updateList}
        totalCount={updatesData.totalCount}
      />
    </UpdatePage>
  );
};

export default HistoryPage;
