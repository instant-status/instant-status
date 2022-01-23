import React, { memo, useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";

import apiRoutes from "../../api/apiRoutes";
import { SmallButton } from "../../components/Controls/Buttons";
import AdminPageTitle from "../../components/Layout/AdminPageTitle";
import MaxWidth from "../../components/Layout/MaxWidth";
import Page from "../../components/Layout/Page";
import PageHeader from "../../components/Layout/PageHeader";
import Stack from "../../components/Layout/Stack";
import theme from "../../utils/theme";
import AdminSidebar from "./AdminSidebar";

const Wrapper = styled.div`
  display: flex;
`;

const AdminRolesPage = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const updatesQuery = useQuery(`adminRoles`, apiRoutes.apiGetAdminRoles);

  const roles = updatesQuery.isFetching ? [] : updatesQuery?.data;

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
                  onClick={() => setIsCreateOpen(true)}
                  $color={theme.color.lightOne}
                  $variant="primary"
                >
                  Add Role
                </SmallButton>
              )}
            </Stack>
          </AdminPageTitle>
          <Stack direction="down" spacing={8} fullWidth={true}>
            {roles.map((role) => (
              <div key={role.id} style={{ color: `#fff` }}>
                <div>
                  <b>Role Name: </b>
                  {role.name}
                </div>
                <div>
                  <b>Can view stacks: </b>
                  {role.view_stacks.map((stack) => stack.name).join(`, `)}
                </div>
                <div>
                  <b>Can update stacks: </b>
                  {role.update_stacks.map((stack) => stack.name).join(`, `)}
                </div>
              </div>
            ))}

            {/* <AnimatePresence>
              {isCreateOpen && (
                <CreateStacksForm
                  existingStackIds={existingStackIds}
                  onSuccess={onNewStackSuccess}
                  onAbort={onNewStackAbort}
                />
              )}
            </AnimatePresence> */}
            {/* <AdminStacksTable stacks={users} /> */}
          </Stack>
        </MaxWidth>
      </Page>
    </Wrapper>
  );
};

export default memo(AdminRolesPage);
