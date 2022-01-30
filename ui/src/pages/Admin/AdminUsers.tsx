import React, { memo, useCallback, useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";

import apiRoutes from "../../api/apiRoutes";
import { SmallButton } from "../../components/Controls/Buttons";
import AdminPageTitle from "../../components/Layout/AdminPageTitle";
import MaxWidth from "../../components/Layout/MaxWidth";
import Page from "../../components/Layout/Page";
import PageHeader from "../../components/Layout/PageHeader";
import Stack from "../../components/Layout/Stack";
import AdminSidebar from "../../components/Sidebar/AdminSidebar";
import useToggle from "../../hooks/useToggle";
import theme from "../../utils/theme";
import AdminUsersTable, { NewUserProps } from "./Tables/AdminUsersTable";

const Wrapper = styled.div`
  display: flex;
`;

const AdminUsersPage = () => {
  const [isCreateOpen, toggleIsCreateOpen] = useToggle(false);
  const [newRow, setNewRow] = useState<NewUserProps[]>([]);

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
    <Wrapper>
      <AdminSidebar />
      <Page>
        <PageHeader />
        <MaxWidth>
          <AdminPageTitle>
            <Stack spacing={8} align="center" justify="spaceBetween">
              <h1>Manage Users</h1>
              {!isCreateOpen && (
                <SmallButton
                  onClick={onCreateOpen}
                  $color={theme.color.lightOne}
                  $variant="primary"
                >
                  Add User
                </SmallButton>
              )}
            </Stack>
          </AdminPageTitle>
          <AdminUsersTable
            users={[...newRow, ...users]}
            availableRoles={roles}
            onSuccess={adminGetUsersQuery.refetch}
            onCancel={onCreateClose}
          />
        </MaxWidth>
      </Page>
    </Wrapper>
  );
};

export default memo(AdminUsersPage);
