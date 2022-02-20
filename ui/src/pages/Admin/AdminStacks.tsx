import React, { useCallback, useState } from "react";
import { useQuery } from "react-query";
import apiRoutes from "../../api/apiRoutes";
import { SmallButton } from "../../components/Controls/Buttons";
import AdminPage from "../../components/Layout/AdminPage";
import { NewRowProps } from "../../globalTypes";
import useToggle from "../../hooks/useToggle";
import theme from "../../utils/theme";
import AdminStacksTable from "./Tables/AdminStacksTable";

const AdminStacksPage = () => {
  const [isCreateOpen, toggleIsCreateOpen] = useToggle(false);
  const [newRow, setNewRow] = useState<NewRowProps[]>([]);

  const stacksQuery = useQuery(`stacksData`, apiRoutes.apiGetStacksList, {
    refetchOnWindowFocus: false,
  });

  const stacksList = stacksQuery.isFetching ? [] : stacksQuery?.data || [];

  const existingStackNames = stacksList.map((update: { name: string }) =>
    update.name.toLowerCase(),
  );

  const onCreateOpen = useCallback(() => {
    toggleIsCreateOpen();
    setNewRow([{ isInCreateMode: true }]);
  }, []);

  const onCreateClose = useCallback(() => {
    toggleIsCreateOpen(false);
    setNewRow([]);
  }, []);

  return (
    <AdminPage
      pageTitle="Manage Stacks"
      pageAction={
        !isCreateOpen && (
          <SmallButton
            onClick={onCreateOpen}
            $color={theme.color.lightOne}
            $variant="primary"
          >
            Add Stack
          </SmallButton>
        )
      }
    >
      <AdminStacksTable
        stacks={[...newRow, ...stacksList]}
        existingStackNames={existingStackNames}
        onSuccess={stacksQuery.refetch}
        onCancel={onCreateClose}
      />
    </AdminPage>
  );
};

export default AdminStacksPage;
