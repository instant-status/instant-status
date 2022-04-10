import React, { useCallback, useState } from "react";
import { useQuery } from "react-query";

import apiRoutes from "../../api/apiRoutes";
import { SmallButton } from "../../components/Controls/Buttons";
import AdminPage from "../../components/Layout/AdminPage";
import { NewRowProps } from "../../globalTypes";
import useToggle from "../../hooks/useToggle";
import theme from "../../utils/theme";
import AdminUsersTable from "./Tables/AdminUsersTable";

const AdminUsersPage = () => {
  const [isCreateOpen, toggleIsCreateOpen] = useToggle(false);
  const [newRow, setNewRow] = useState<NewRowProps[]>([]);

  const adminGetUsersQuery = useQuery(`adminGetUsers`, apiRoutes.apiGetUsers, {
    refetchOnWindowFocus: false,
  });

  const users = adminGetUsersQuery.isFetching ? [] : adminGetUsersQuery?.data;

  const adminRolesQuery = useQuery(`adminRoles`, apiRoutes.apiGetRoles, {
    refetchOnWindowFocus: false,
  });

  const roles = adminRolesQuery.isFetching ? [] : adminRolesQuery?.data;

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
      pageTitle="Manage Users"
      pageAction={
        !isCreateOpen && (
          <SmallButton
            onClick={onCreateOpen}
            $color={theme.color.lightOne}
            $variant="primary"
          >
            Add User
          </SmallButton>
        )
      }
    >
      <AdminUsersTable
        users={[...newRow, ...users]}
        availableRoles={roles}
        onSuccess={adminGetUsersQuery.refetch}
        onCancel={onCreateClose}
      />
    </AdminPage>
  );
};

export default AdminUsersPage;
