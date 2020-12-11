import React, { memo } from "react";
import styled from "styled-components";

import PageContent from "../components/PageContent";
import Sidebar from "../components/sidebar/Sidebar";
import { StateProvider } from "../context/StateContext";

const Wrapper = styled.div`
  display: flex;
`;

const StatusPage = () => {
  return (
    <Wrapper>
      <StateProvider>
        <Sidebar />
        <PageContent />
      </StateProvider>
    </Wrapper>
  );
};

export default memo(StatusPage);
