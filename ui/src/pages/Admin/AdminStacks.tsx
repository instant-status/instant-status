import React, { memo } from "react";
import styled from "styled-components";

import SearchBar from "../../components/Controls/SearchBar";
import Page from "../../components/Layout/Page";
import AdminSidebar from "./AdminSidebar";

const Wrapper = styled.div`
  display: flex;
`;

const StatusPage = () => {
  return (
    <Wrapper>
      <AdminSidebar />
      <Page>
        <SearchBar />

        <h1>Content</h1>
      </Page>
    </Wrapper>
  );
};

export default memo(StatusPage);
