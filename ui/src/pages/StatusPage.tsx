import React, { memo } from "react";
import { QueryCache, ReactQueryCacheProvider } from "react-query";
import styled from "styled-components";

import PageContent from "../components/PageContent";
import Sidebar from "../components/sidebar/Sidebar";
import { StateProvider } from "../context/StateContext";

const Wrapper = styled.div`
  display: flex;
`;

const queryCache = new QueryCache();

const StatusPage = () => {
  return (
    <Wrapper>
      <StateProvider>
        <Sidebar />
        <ReactQueryCacheProvider queryCache={queryCache}>
          <PageContent />
        </ReactQueryCacheProvider>
      </StateProvider>
    </Wrapper>
  );
};

export default memo(StatusPage);
