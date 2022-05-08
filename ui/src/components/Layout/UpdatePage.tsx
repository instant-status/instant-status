import React from "react";
import { Helmet } from "react-helmet";
import styled from "styled-components";

import APP_CONFIG from "../../../appConfig";
import HistorySidebar from "../Sidebar/HistorySidebar";
import AdminPageTitle from "./AdminPageTitle";
import MaxWidth from "./MaxWidth";
import Page from "./Page";
import PageHeader from "./PageHeader";
import Stack from "./Stack";

const Wrapper = styled.div`
  display: flex;
`;

interface UpdatePageProps {
  pageTitle: string;
  pageAction?: React.ReactNode;
  children: React.ReactNode;
}

const UpdatePage = (props: UpdatePageProps) => {
  return (
    <Wrapper>
      <Helmet>
        <title>
          {props.pageTitle} | {APP_CONFIG.APP_NAME} | Instant Status
        </title>
      </Helmet>
      <HistorySidebar />
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

export default UpdatePage;
