import React from "react";
import { Helmet } from "react-helmet";
import styled from "styled-components";

import APP_CONFIG from "../../../appConfig";
import AdminPageTitle from "../../components/Layout/AdminPageTitle";
import MaxWidth from "../../components/Layout/MaxWidth";
import Page from "../../components/Layout/Page";
import PageHeader from "../../components/Layout/PageHeader";
import Stack from "../../components/Layout/Stack";
import AdminSidebar from "../../components/Sidebar/AdminSidebar";

const Wrapper = styled.div`
  display: flex;
`;

interface AdminPageProps {
  pageTitle: string;
  pageAction: React.ReactNode;
  children: React.ReactNode;
}

const AdminPage = (props: AdminPageProps) => {
  return (
    <Wrapper>
      <Helmet>
        <title>
          {props.pageTitle} | {APP_CONFIG.APP_NAME} | Instant Status
        </title>
      </Helmet>
      <AdminSidebar />
      <Page>
        <PageHeader />
        <MaxWidth>
          <AdminPageTitle>
            <Stack spacing={8} align="center" justify="spaceBetween">
              <h1>{props.pageTitle}</h1>
              {props.pageAction}
            </Stack>
          </AdminPageTitle>
          {props.children}
        </MaxWidth>
      </Page>
    </Wrapper>
  );
};

export default AdminPage;
