import React, { memo } from "react";
import styled from "styled-components";

import PageContent from "../../components/Layout/PageContent";
import StatusSidebar from "./StatusSidebar";

const Wrapper = styled.div`
  display: flex;
`;

const StatusPage = () => {
  return (
    <Wrapper>
      <StatusSidebar />
      <PageContent />
    </Wrapper>
  );
};

export default memo(StatusPage);
