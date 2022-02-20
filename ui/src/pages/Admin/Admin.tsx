import React, { memo, useEffect } from "react";
import { Redirect } from "react-router";
import styled from "styled-components";

import Page from "../../components/Layout/Page";
import PageHeader from "../../components/Layout/PageHeader";
import Stack from "../../components/Layout/Stack";
import AdminSidebar from "../../components/Sidebar/AdminSidebar";
import theme from "../../utils/theme";

const Wrapper = styled.div`
  display: flex;
`;

const PageTitle = styled.header`
  color: ${theme.color.lightOne};
  width: 100%;
  padding: 0 32px;
`;

const AdminPage = () => {
  return <Redirect to="/admin/stacks" />;

  // return (
  //   <Wrapper>
  //     <AdminSidebar />
  //     <Page>
  //       <PageHeader />
  //       <PageTitle>
  //         <Stack spacing={8} align="center" justify="spaceBetween">
  //           <h1>Admin</h1>
  //         </Stack>
  //       </PageTitle>
  //     </Page>
  //   </Wrapper>
  // );
};

export default memo(AdminPage);
