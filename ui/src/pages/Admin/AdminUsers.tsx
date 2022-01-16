import React, { memo, useState } from "react";
import Select from "react-dropdown-select";
import { useQuery } from "react-query";
import styled from "styled-components";

import apiRoutes from "../../api/apiRoutes";
import { SmallButton } from "../../components/Controls/Buttons";
import Page from "../../components/Layout/Page";
import PageHeader from "../../components/Layout/PageHeader";
import Stack from "../../components/Layout/Stack";
import theme from "../../utils/theme";
import AdminSidebar from "./AdminSidebar";

const Wrapper = styled.div`
  display: flex;
`;

const PageTitle = styled.header`
  color: ${theme.color.lightOne};
  width: 100%;
  padding: 0 32px;
`;

const MaxWidth = styled.div`
  max-width: 1000px;
  width: 100%;
`;

const AdminUsersPage = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const adminUsersQuery = useQuery(`adminUsers`, apiRoutes.apiGetAdminUsers);

  const users = adminUsersQuery.isFetching ? [] : adminUsersQuery?.data;

  const adminRolesQuery = useQuery(`adminRoles`, apiRoutes.apiGetAdminRoles);

  const roles = adminRolesQuery.isFetching ? [] : adminRolesQuery?.data;

  return (
    <Wrapper>
      <AdminSidebar />
      <Page>
        <PageHeader />
        <MaxWidth>
          <PageTitle>
            <Stack spacing={8} align="center" justify="spaceBetween">
              <h1>Users</h1>
              {!isCreateOpen && (
                <SmallButton
                  onClick={() => setIsCreateOpen(true)}
                  $color={theme.color.lightOne}
                  $variant="primary"
                >
                  Create Stacks
                </SmallButton>
              )}
            </Stack>
          </PageTitle>
          <Stack direction="down" spacing={8} fullWidth={true}>
            {users.map((user) => (
              <div key={user.id}>
                <h3 style={{ color: `#fff` }}>
                  {user.first_name} {user.last_name}
                </h3>
                <div style={{ color: `#fff` }}>{user.email}</div>
                <div style={{ color: `#fff` }}>
                  {user.is_super_admin
                    ? `is_super_admin: true`
                    : `is_super_admin: false`}
                </div>
                <Select
                  addPlaceholder="test"
                  multi={true}
                  searchable={true}
                  options={roles.map((role) => ({
                    label: role.name,
                    value: role.id,
                  }))}
                  onChange={(values) => {}}
                  values={(user.roles || []).map((role) => ({
                    label: role.name,
                    value: role.id,
                  }))}
                />
                <div></div>
              </div>
            ))}
          </Stack>
        </MaxWidth>
      </Page>
    </Wrapper>
  );
};

export default memo(AdminUsersPage);
