import Cookies from "js-cookie";
import React, { memo, useContext } from "react";
import styled from "styled-components";
import PageContent from "../components/PageContent";
import Sidebar from "../components/sidebar/Sidebar";
import { StateContext } from "../context/StateContext";
import Login from "./Login";

const Wrapper = styled.div`
  display: flex;
`;

const StatusPage = () => {
  const { pageData } = useContext(StateContext);

  const hasData = Object.entries(pageData).length > 0;

  if (localStorage.getItem("bearer") || Cookies.get("Auth-Bearer")) {
    if (pageData[0] && pageData[0].error) {
      return <Login />;
    }
    if (hasData) {
      return (
        <Wrapper>
          <Sidebar />
          <PageContent />
        </Wrapper>
      );
    }
    return <h1>Loading</h1>;
  }

  return <Login />;
};

export default memo(StatusPage);
