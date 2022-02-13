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
import AdminRolesTable from "./Tables/AdminRolesTable";
import { NewUserProps } from "./Tables/AdminUsersTable";

const Wrapper = styled.div`
  display: flex;
`;

const AdminRolesPage = () => {
  const [isCreateOpen, toggleIsCreateOpen] = useToggle(false);
  const [newRow, setNewRow] = useState<NewUserProps[]>([]);

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
      : apiGetAvailableStacksAndEnvironmentsQuery?.data;

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
              <h1>Manage Roles</h1>
              {!isCreateOpen && (
                <SmallButton
                  onClick={onCreateOpen}
                  $color={theme.color.lightOne}
                  $variant="primary"
                >
                  Add Role
                </SmallButton>
              )}
            </Stack>
          </AdminPageTitle>
          <AdminRolesTable
            roles={[...newRow, ...roles]}
            availableStacks={availableStacks}
            availableEnvironments={availableEnvironments}
            onSuccess={getAdminRolesQuery.refetch}
            onCancel={onCreateClose}
          />
        </MaxWidth>
      </Page>
    </Wrapper>
  );
};

export default memo(AdminRolesPage);
