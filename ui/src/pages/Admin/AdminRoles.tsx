import React, { useCallback, useState } from "react";
import { useQuery } from "react-query";

import apiRoutes from "../../api/apiRoutes";
import { SmallButton } from "../../components/Controls/Buttons";
import AdminPage from "../../components/Layout/AdminPage";
import { NewRowProps } from "../../globalTypes";
import useToggle from "../../hooks/useToggle";
import AdminRolesTable from "./Tables/AdminRolesTable";

const AdminRolesPage = () => {
  const [isCreateOpen, toggleIsCreateOpen] = useToggle(false);
  const [newRow, setNewRow] = useState<NewRowProps[]>([]);

  const getAdminRolesQuery = useQuery(`adminRoles`, apiRoutes.apiGetRoles, {
    refetchOnWindowFocus: false,
  });

  const roles = getAdminRolesQuery.isFetching ? [] : getAdminRolesQuery?.data;

  const apiGetAvailableStacksAndEnvironmentsQuery = useQuery(
    `availableStacksAndEnvironments`,
    apiRoutes.apiGetAvailableStacksAndEnvironments,
    {
      refetchOnWindowFocus: false,
    },
  );

  const { availableStacks, availableEnvironments } =
    apiGetAvailableStacksAndEnvironmentsQuery.isFetching
      ? { availableStacks: [], availableEnvironments: [] }
      : apiGetAvailableStacksAndEnvironmentsQuery?.data || {
          availableStacks: [],
          availableEnvironments: [],
        };

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
      pageTitle="Manage Roles"
      pageAction={
        !isCreateOpen && (
          <SmallButton
            onClick={onCreateOpen}
            $color={`--color-lightOne`}
            $variant="primary"
          >
            Add Role
          </SmallButton>
        )
      }
    >
      <AdminRolesTable
        roles={[...newRow, ...roles]}
        availableStacks={availableStacks}
        availableEnvironments={availableEnvironments}
        onSuccess={getAdminRolesQuery.refetch}
        onCancel={onCreateClose}
      />
    </AdminPage>
  );
};

export default AdminRolesPage;
