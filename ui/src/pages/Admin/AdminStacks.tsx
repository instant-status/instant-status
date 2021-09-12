import { AnimatePresence } from "framer-motion";
import React, { memo, useState } from "react";
import { useQuery } from "react-query";
import styled from "styled-components";

import apiRoutes from "../../api/apiRoutes";
import { SmallButton } from "../../components/Controls/Buttons";
import Page from "../../components/Layout/Page";
import PageHeader from "../../components/Layout/PageHeader";
import Stack from "../../components/Layout/Stack";
import theme from "../../utils/theme";
import AdminSidebar from "./AdminSidebar";
import CreateStacksForm from "./Forms/CreateStacksForm";
import AdminStacksTable from "./Tables/AdminStacksTable";

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

const StatusPage = () => {
  const [isCreateOpen, setIsCreateOpen] = useState(false);

  const updatesQuery = useQuery(`stacksData`, apiRoutes.apiGetStacksList);

  const stacksList = updatesQuery.isFetching ? [] : updatesQuery?.data;
  const existingStackIds = stacksList.map((update: { name: string }) =>
    update.name.toLowerCase(),
  );

  const onNewStackSuccess = () => {
    setIsCreateOpen(false);
    updatesQuery.refetch();
  };

  const onNewStackAbort = () => {
    setIsCreateOpen(false);
  };

  return (
    <Wrapper>
      <AdminSidebar />
      <Page>
        <PageHeader />
        <MaxWidth>
          <PageTitle>
            <Stack spacing={8} align="center" justify="spaceBetween">
              <h1>Manage Stacks</h1>
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
            <AnimatePresence>
              {isCreateOpen && (
                <CreateStacksForm
                  existingStackIds={existingStackIds}
                  onSuccess={onNewStackSuccess}
                  onAbort={onNewStackAbort}
                />
              )}
            </AnimatePresence>
            <AdminStacksTable stacks={stacksList} />
          </Stack>
        </MaxWidth>
      </Page>
    </Wrapper>
  );
};

export default memo(StatusPage);
