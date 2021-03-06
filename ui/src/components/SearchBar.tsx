import React from "react";
import styled from "styled-components";

const StyledSearchBar = styled.input`
  background-color: ${({ theme }) => theme.color.darkOne};
  border-radius: 10px;
  border: none;
  box-shadow: ${({ theme }) => theme.shadow.card};
  color: #fff;
  font-size: 24px;
  height: 40px;
  margin-bottom: 30px;
  max-width: 570px;
  text-align: center;
  width: 100%;
`;

const SearchBar = () => {
  return <StyledSearchBar type="text" disabled placeholder="Search" />;
};

export default SearchBar;
